import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv({ path: path.resolve('../petto bot 1/.env') });

const clientId = process.env.DISCORD_CLIENT_ID;
const botToken = process.env.DISCORD_TOKEN;

if (!clientId || !botToken) {
  console.error('Missing DISCORD_CLIENT_ID or DISCORD_TOKEN. Keep both outside source control.');
  process.exit(1);
}

const endpoint = `https://discord.com/api/v10/applications/${clientId}/role-connections/metadata`;
const desired = {
  type: 7,
  key: 'petto_verified',
  name: 'Petto account verified',
  description: 'The user has connected their Discord account to Petto.',
  name_localizations: { 'es-ES': 'Cuenta de Petto verificada', 'pt-BR': 'Conta Petto verificada' },
  description_localizations: {
    'es-ES': 'El usuario conectó su cuenta de Discord con Petto.',
    'pt-BR': 'O usuário conectou sua conta do Discord ao Petto.',
  },
};

const headers = { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' };
const existingRes = await fetch(endpoint, { headers: { Authorization: `Bot ${botToken}` } });
if (!existingRes.ok) {
  console.error(`Discord metadata lookup failed (${existingRes.status}).`);
  process.exit(1);
}

const existing = await existingRes.json();
const merged = [...existing.filter((item) => item.key !== desired.key), desired];
if (merged.length > 5) {
  console.error('Discord allows at most five role connection metadata records.');
  process.exit(1);
}

const response = await fetch(endpoint, { method: 'PUT', headers, body: JSON.stringify(merged) });
if (!response.ok) {
  console.error(`Discord metadata registration failed (${response.status}).`);
  process.exit(1);
}

const appResponse = await fetch('https://discord.com/api/v10/applications/@me', {
  method: 'PATCH',
  headers,
  body: JSON.stringify({ role_connections_verification_url: 'https://petto.sbs/linked-role' }),
});
if (!appResponse.ok) {
  console.error(`Discord verification URL configuration failed (${appResponse.status}).`);
  process.exit(1);
}

console.log('Registered Petto Linked Roles metadata and verification URL.');
