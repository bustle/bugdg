import { createClient } from 'redis';

export const createRedisConnection = async () => {
  const client = createClient();
  client.on('error', (err) => console.error('Redis Client Error', err));
  await client.connect();
  return client
}
