export function injectPrismaDelegates(client, delegateNames) {
    const originals = delegateNames.map((delegateName) => [
        delegateName,
        Reflect.get(client, delegateName)
    ]);
    for (const [delegateName, originalValue] of originals) {
        if (!originalValue) {
            Reflect.set(client, delegateName, {});
        }
    }
    return () => {
        for (const [delegateName, originalValue] of originals) {
            Reflect.set(client, delegateName, originalValue);
        }
    };
}
