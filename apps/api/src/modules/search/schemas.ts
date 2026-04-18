// @ts-expect-error TODO: remover suppressão ampla
import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().max(80).default("")
});

