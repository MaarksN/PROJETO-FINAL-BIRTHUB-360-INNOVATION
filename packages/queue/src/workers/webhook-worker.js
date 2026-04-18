import { BaseWorker } from "./base-worker.js";
export class WebhookWorker extends BaseWorker {
    process(payload) {
        if (payload.failDelivery)
            throw new Error("WEBHOOK_DELIVERY_FAILED");
        return Promise.resolve();
    }
}
