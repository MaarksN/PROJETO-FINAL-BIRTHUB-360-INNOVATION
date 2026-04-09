// @ts-nocheck
import type { ApiConfig } from "@birthub/config";
import { createLogger } from "@birthub/logger";
import { RetentionExecutionMode } from "@birthub/database";

import { runRetentionSweep } from "./retention.service.js";

const logger = createLogger("privacy-retention");
let retentionTimer: NodeJS.Timeout | null = null;

export function startPrivacyRetentionScheduler(
  config: ApiConfig,
  intervalMs = 60 * 60 * 1000
): void {
  if (retentionTimer) {
    return;
  }

  retentionTimer = setInterval(() => {
    void runRetentionSweep({
      config,
      mode: RetentionExecutionMode.AUTOMATED
    })
      .then((result) => {
        logger.info({ policiesExecuted: result.length }, "Privacy retention sweep executed");
      })
      .catch((error) => {
        logger.error({ error }, "Privacy retention sweep failed");
      });
  }, intervalMs);

  retentionTimer.unref();
}
