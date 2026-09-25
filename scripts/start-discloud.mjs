process.env.HOST ||= '0.0.0.0';
process.env.PORT ||= '8080';
await import('../build/dist/server/entry.mjs');
