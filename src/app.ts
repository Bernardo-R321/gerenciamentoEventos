import DB from './db';
import server from './server';

async function main(): Promise<void> {
  await DB.initialize();

  server.start();
}

main();
