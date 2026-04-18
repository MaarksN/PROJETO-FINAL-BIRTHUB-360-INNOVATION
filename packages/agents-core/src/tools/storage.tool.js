function buildSignedUrl(provider, bucket, key) {
    if (provider === "s3") {
        return `https://s3.amazonaws.com/${bucket}/${key}?signature=mock`;
    }
    return `https://project.supabase.co/storage/v1/object/public/${bucket}/${key}?token=mock`;
}
export function callStorageTool(input, options) {
    if (!(options?.simulate ?? true)) {
        throw new Error("Live storage calls are disabled in this environment.");
    }
    return Promise.resolve({
        action: input.action,
        key: input.key,
        provider: input.provider,
        signedUrl: buildSignedUrl(input.provider, input.bucket, input.key)
    });
}
