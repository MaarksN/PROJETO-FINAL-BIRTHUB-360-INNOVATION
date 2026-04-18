// @ts-expect-error TODO: remover suppressão ampla
import { z } from "zod";

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
});

