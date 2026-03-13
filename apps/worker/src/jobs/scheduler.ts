import { createLogger } from "@birthub/logger";

import { flushBufferedAuditEvents } from "./auditFlush.js";
import { inviteCleanupJob } from "./inviteCleanup.js";
import { quotaResetJob } from "./quotaReset.js";

const logger = createLogger("worker-cycle2-jobs");

export interface Cycle2JobsRuntime {
  stop: () => Promise<void>;
}

export function startCycle2Jobs(): Cycle2JobsRuntime {
  const timers = [
    setInterval(() => {
      void inviteCleanupJob().then((result) => {
        logger.info({ deleted: result.count }, "Invite cleanup job finished");
      });
    }, 60 * 60 * 1000),
    setInterval(() => {
      void flushBufferedAuditEvents().then((flushed) => {
        if (flushed > 0) {
          logger.info({ flushed }, "Audit flush job persisted buffered events");
        }
      });
    }, 5_000),
    setInterval(() => {
      const now = new Date();

      if (now.getUTCHours() === 0) {
        void quotaResetJob(now).then((result) => {
          logger.info(result, "Quota reset job ensured the new period exists");
        });
      }
    }, 60 * 60 * 1000)
  ];

  for (const timer of timers) {
    timer.unref?.();
  }

  return {
    stop: async () => {
      for (const timer of timers) {
        clearInterval(timer);
      }
    }
  };
}
