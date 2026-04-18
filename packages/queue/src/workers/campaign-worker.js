import { BaseWorker } from "./base-worker.js";
export class CampaignWorker extends BaseWorker {
    process(payload) {
        if (payload.retryableError)
            throw new Error("CAMPAIGN_RETRY");
        return Promise.resolve();
    }
}
