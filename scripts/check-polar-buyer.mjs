// Who a purchase of Polar belongs to: the id that Petto wrote when it made the checkout (metadata.discord_user_id) comes before the id of the Polar customer. Polar keeps one
// customer for each email, so a person who bought with the same email for two Discord accounts has a customer with the id of the first one.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(path.join(root, 'src/utils/polarWebhook.ts'), 'utf8');

const firstId = (text) => text.indexOf('metadata.discord_user_id');
const customerId = (text) => text.indexOf('external_id');

const fn = source.slice(source.indexOf('function userIdFrom'), source.indexOf('function statusFor'));
assert.ok(firstId(fn) !== -1 && firstId(fn) < customerId(fn), 'a subscription is given to the id of the checkout before the id of the customer');

const orders = source.match(/const userId = String\([^;]*\);/g) ?? [];
assert.equal(orders.length, 2, 'the paid and the refunded order each read their person once');
for (const line of orders) assert.ok(firstId(line) !== -1 && firstId(line) < customerId(line), `an order is given to the id of the checkout before the id of the customer: ${line}`);

console.log('OK: Polar purchases go to the id of the checkout first');
