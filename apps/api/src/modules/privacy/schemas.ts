import {
  privacyDeleteRequestSchema,
  privacyDeleteResponseSchema
} from "@birthub/config";
import {
  ConsentPurpose,
  ConsentSource,
  ConsentStatus,
  RetentionAction,
  RetentionDataCategory,
  RetentionExecutionMode
} from "@birthub/database";
import { z } from "zod";

export {
  privacyDeleteRequestSchema,
  privacyDeleteResponseSchema
};

export const consentUpdateSchema = z
  .object({
    decisions: z
      .array(
        z
          .object({
            purpose: z.nativeEnum(ConsentPurpose),
            source: z.nativeEnum(ConsentSource),
            status: z.nativeEnum(ConsentStatus)
          })
          .strict()
      )
      .min(1)
  })
  .strict();

export const retentionUpdateSchema = z
  .object({
    policies: z
      .array(
        z
          .object({
            action: z.nativeEnum(RetentionAction).optional(),
            dataCategory: z.nativeEnum(RetentionDataCategory),
            enabled: z.boolean().optional(),
            retentionDays: z.number().int().min(0).max(3650).optional()
          })
          .strict()
      )
      .min(1)
  })
  .strict();

export const retentionRunSchema = z
  .object({
    mode: z.nativeEnum(RetentionExecutionMode).default(RetentionExecutionMode.DRY_RUN)
  })
  .strict();
