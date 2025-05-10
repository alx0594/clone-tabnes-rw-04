import { Client } from "pg";

async function query(queryObjects) {
  let client;
  try {
    client = await newClient();
    const result = await client.query(queryObjects);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function newClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValue(),
  });
  await client.connect();
  return client;
}

const database = { query, newClient };

export default database;

function getSSLValue() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV !== "production" ? false : true;
}
