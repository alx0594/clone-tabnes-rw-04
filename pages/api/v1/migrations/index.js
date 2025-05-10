import migrationRunner from "node-pg-migrate";
import database from "infra/database.js";
import { join } from "node:path";

export default async function migrations(request, response) {
  const allowMethods = ["GET", "POST"];
  if (!allowMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.newClient();

    const defaultOptionsMigration = {
      dbClient: dbClient,
      dir: join("infra", "migrations"),
      direction: "up",
      dryRun: true,
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const migrationsPending = await migrationRunner(defaultOptionsMigration);
      return response.status(200).json(migrationsPending);
    }

    if (request.method === "POST") {
      const migrated = await migrationRunner({
        ...defaultOptionsMigration,
        dryRun: false,
      });

      if (migrated.length > 0) {
        return response.status(201).json(migrated);
      }

      return response.status(200).json(migrated);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end();
  }
}
