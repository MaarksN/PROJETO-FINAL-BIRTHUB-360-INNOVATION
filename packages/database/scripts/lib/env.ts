// @ts-nocheck
// 
export type SchemaDriftEnvironment = {
  databaseUrl?: string;
  shadowDatabaseUrl?: string;
};

function readOptionalEnv(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function getSchemaDriftEnvironment(
  env: NodeJS.ProcessEnv = process.env
): SchemaDriftEnvironment {
  return {
    databaseUrl: readOptionalEnv(env, "DATABASE_URL"),
    shadowDatabaseUrl: readOptionalEnv(env, "SHADOW_DATABASE_URL")
  };
}
