import { z, type ZodTypeAny } from "zod";

export const nodeEnvSchema = z.enum(["development", "test", "production"]).default("development");

export const nonEmptyString = z.string().trim().min(1);
export const optionalNonEmptyString = z
  .string()
  .trim()
  .min(1)
  .optional();

export const commaSeparatedList = z
  .string()
  .default("")
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

export const urlString = z.string().url();
export const optionalUrlString = z.string().url().optional();

export class EnvValidationError extends Error {
  constructor(scope: string, issues: string[]) {
    super(`[${scope}] invalid environment variables:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    this.name = "EnvValidationError";
  }
}

export function parseEnv<TSchema extends ZodTypeAny>(
  scope: string,
  schema: TSchema,
  env: NodeJS.ProcessEnv
): z.infer<TSchema> {
  const parsed = schema.safeParse(env);

  if (!parsed.success) {
    throw new EnvValidationError(
      scope,
      parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    );
  }

  // Zod guarantees the output shape here, but eslint cannot infer it through the generic helper.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return parsed.data;
}
