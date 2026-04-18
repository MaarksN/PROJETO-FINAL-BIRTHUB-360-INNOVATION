import { BaseWorker } from "./base-worker.js";
export class ReportWorker extends BaseWorker {
    process(payload) {
        if (payload.failed)
            throw new Error("REPORT_FAILED");
        return Promise.resolve();
    }
}
