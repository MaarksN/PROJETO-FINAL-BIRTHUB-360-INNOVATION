export function executeDelayNode(config) {
    const delayMs = Math.max(1, Math.floor(config.duration_ms));
    return {
        delayMs,
        releaseAt: new Date(Date.now() + delayMs)
    };
}
