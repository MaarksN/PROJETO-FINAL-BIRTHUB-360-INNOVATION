import { defineConfig } from "prisma/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

if (!process.env.DATABASE_URL) {
  const isDevOrTest = nodeEnv === "development" || nodeEnv === "test";

  if (isDevOrTest) {
    // Default to a local database only in development or test environments.
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/birthub?schema=public";
  } else {
    throw new Error(
      "DATABASE_URL environment variable must be set for Prisma in non-development environments."
    );
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: process.env.DATABASE_URL!
  }
});
