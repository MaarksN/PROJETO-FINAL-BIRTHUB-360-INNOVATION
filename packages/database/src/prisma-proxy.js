function bindClientValue(client, value) {
    if (typeof value !== "function") {
        return value;
    }
    return value.bind(client);
}
export function createPrismaProxy(getClient) {
    return new Proxy({}, {
        get(_target, property) {
            const client = getClient();
            const value = Reflect.get(client, property, client);
            return bindClientValue(client, value);
        },
        set(_target, property, value) {
            return Reflect.set(getClient(), property, value);
        }
    });
}
