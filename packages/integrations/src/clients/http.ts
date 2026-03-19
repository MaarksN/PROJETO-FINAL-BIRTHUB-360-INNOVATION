export interface HttpRequestOptions {
  apiKey?: string;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  headers?: Record<string, string>;
  queryAuthFallback?: QueryAuthFallbackOptions;
}

export interface QueryAuthFallbackOptions {
  parameterName: string;
  token: string;
  enabled?: boolean;
  provider?: string;
  triggerStatuses?: number[];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function appendQueryAuthToken(input: {
  parameterName: string;
  token: string;
  url: string;
}): string {
  const url = new URL(input.url);
  url.searchParams.set(input.parameterName, input.token);
  return url.toString();
}

function asBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "") {
    return defaultValue;
  }
  return !["0", "false", "no", "off"].includes(normalized);
}

export function isIntegrationsQueryTokenFallbackEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return asBoolean(env.INTEGRATIONS_ALLOW_QUERY_TOKEN_FALLBACK, true);
}

function resolveQueryFallbackEnabled(options: QueryAuthFallbackOptions | undefined): boolean {
  if (!options) {
    return false;
  }
  if (typeof options.enabled === "boolean") {
    return options.enabled;
  }
  return isIntegrationsQueryTokenFallbackEnabled();
}

function logQueryAuthFallback(input: {
  fromUrl: string;
  provider?: string;
  status: number;
  toUrl: string;
}): void {
  // Structured log for auditability during staged migration off query-token auth.
  console.warn(
    JSON.stringify({
      event: "integrations.query_auth_fallback",
      fromUrl: input.fromUrl,
      provider: input.provider ?? "unknown",
      status: input.status,
      timestamp: new Date().toISOString(),
      toUrl: input.toUrl
    }),
  );
}

async function requestJson<T>(input: {
  method: "GET" | "POST";
  options?: HttpRequestOptions;
  payload?: unknown;
  url: string;
}): Promise<T> {
  const options = input.options ?? {};
  const timeoutMs = options.timeoutMs ?? 10_000;
  const retries = options.retries ?? 2;
  const retryDelayMs = options.retryDelayMs ?? 250;
  const queryAuthFallback = options.queryAuthFallback;
  const fallbackEnabled = resolveQueryFallbackEnabled(queryAuthFallback);
  const fallbackStatuses = new Set(queryAuthFallback?.triggerStatuses ?? [401, 403]);

  let lastError: unknown;
  let attempt = 0;
  let requestUrl = input.url;
  let fallbackApplied = false;

  while (attempt <= retries) {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(requestUrl, {
        method: input.method,
        headers: {
          "content-type": "application/json",
          "user-agent": "birthub-integrations/1.0",
          ...(options.apiKey ? { authorization: `Bearer ${options.apiKey}` } : {}),
          ...(options.headers ?? {}),
        },
        ...(input.method === "POST" ? { body: JSON.stringify(input.payload) } : {}),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        if (
          !fallbackApplied &&
          fallbackEnabled &&
          queryAuthFallback &&
          fallbackStatuses.has(response.status)
        ) {
          const fallbackUrl = appendQueryAuthToken({
            parameterName: queryAuthFallback.parameterName,
            token: queryAuthFallback.token,
            url: input.url
          });
          logQueryAuthFallback({
            fromUrl: requestUrl,
            provider: queryAuthFallback.provider,
            status: response.status,
            toUrl: fallbackUrl
          });
          fallbackApplied = true;
          requestUrl = fallbackUrl;
          continue;
        }

        const error = new Error(`HTTP ${response.status}: ${body}`);
        if (attempt < retries && isRetryableStatus(response.status)) {
          attempt += 1;
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        throw error;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        attempt += 1;
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      break;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to call external API");
}

export async function postJson<T>(
  url: string,
  payload: unknown,
  options: HttpRequestOptions = {},
): Promise<T> {
  return requestJson<T>({
    method: "POST",
    options,
    payload,
    url
  });
}

export async function getJson<T>(
  url: string,
  options: HttpRequestOptions = {},
): Promise<T> {
  return requestJson<T>({
    method: "GET",
    options,
    url
  });
}
