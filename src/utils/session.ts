// Encrypted session cookie for the dashboard login. The browser only receives an
// opaque AES-GCM payload; Discord OAuth tokens never appear as readable cookie data.
// Uses Web Crypto only (no Node `Buffer`) so it runs the same in `astro dev` and in
// the Cloudflare Workers runtime.

export interface Session {
  userId: string;
  username: string;
  avatar: string | null;
  /** Asset of the Discord avatar decoration (null: has none; missing: not read yet). */
  decoration?: string | null;
  /** Asset folder and palette name of the Discord nameplate (null: has none; missing: not read yet). */
  nameplate?: { asset: string; palette: string } | null;
  /** The @username (the display name is `username`), the hash of the Discord banner and the accent color (null: has none; missing: not read yet). */
  handle?: string | null;
  banner?: string | null;
  accentColor?: number | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

function toBase64Url(bytes: Uint8Array): string {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): Uint8Array {
  const pad = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(sig));
}

async function encryptionKey(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<Session>;
  return typeof session.userId === 'string'
    && typeof session.username === 'string'
    && (session.avatar === null || typeof session.avatar === 'string')
    && (session.decoration === undefined || session.decoration === null || typeof session.decoration === 'string')
    && (session.nameplate === undefined || session.nameplate === null || (typeof session.nameplate === 'object' && typeof session.nameplate.asset === 'string' && typeof session.nameplate.palette === 'string'))
    && (session.handle === undefined || session.handle === null || typeof session.handle === 'string')
    && (session.banner === undefined || session.banner === null || typeof session.banner === 'string')
    && (session.accentColor === undefined || session.accentColor === null || typeof session.accentColor === 'number')
    && typeof session.accessToken === 'string'
    && typeof session.refreshToken === 'string'
    && typeof session.expiresAt === 'number';
}

export async function encodeSession(session: Session, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(JSON.stringify(session)),
  );
  return `v1.${toBase64Url(iv)}.${toBase64Url(new Uint8Array(ciphertext))}`;
}

export async function decodeSession(value: string, secret: string): Promise<Session | null> {
  if (value.startsWith('v1.')) {
    const [, encodedIv, encodedCiphertext] = value.split('.');
    if (!encodedIv || !encodedCiphertext) return null;
    try {
      const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: fromBase64Url(encodedIv) },
        await encryptionKey(secret),
        fromBase64Url(encodedCiphertext),
      );
      const session: unknown = JSON.parse(new TextDecoder().decode(plaintext));
      return isSession(session) ? session : null;
    } catch {
      return null;
    }
  }

  // Accept one existing signed cookie so an already logged-in user is upgraded
  // to the encrypted format without forcing an avoidable logout.
  const dot = value.lastIndexOf('.');
  if (dot === -1) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = await hmac(secret, payload);
  if (expected !== sig) return null;
  try {
    const session: unknown = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return isSession(session) ? session : null;
  } catch {
    return null;
  }
}
