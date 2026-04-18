// 
import { interpolateValue } from "../interpolation/interpolate.js";
const notificationBatchStore = new Map();
export async function executeNotificationNode(config, context, dispatcher) {
    const payload = interpolateValue(config, context);
    if (payload.batchKey && dispatcher) {
        const existing = notificationBatchStore.get(payload.batchKey);
        if (existing) {
            existing.count += 1;
            existing.payload = {
                ...payload,
                message: `${existing.count} notificacoes agregadas`
            };
            return {
                batchKey: payload.batchKey,
                batched: true,
                delivered: false,
                payload: existing.payload
            };
        }
        const timer = setTimeout(() => {
            const entry = notificationBatchStore.get(payload.batchKey);
            if (!entry) {
                return;
            }
            notificationBatchStore.delete(payload.batchKey);
            void dispatcher.send(entry.payload);
        }, payload.batchWindowMs ?? 5000);
        notificationBatchStore.set(payload.batchKey, {
            count: 1,
            payload,
            timer
        });
        return {
            batchKey: payload.batchKey,
            batched: true,
            delivered: false,
            payload
        };
    }
    if (dispatcher) {
        await dispatcher.send(payload);
    }
    return {
        delivered: true,
        payload
    };
}
