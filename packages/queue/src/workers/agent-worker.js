import { BaseWorker } from "./base-worker.js";
export class AgentWorker extends BaseWorker {
    process(payload) {
        if (payload.shouldFail)
            throw new Error("AGENT_FAILED");
        return Promise.resolve();
    }
}
