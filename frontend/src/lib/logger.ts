const PREFIX = "[EduNet]";

export function log(scope: string, message: string, data?: unknown): void {
  if (data !== undefined) {
    console.debug(`${PREFIX} ${scope}`, message, data);
  } else {
    console.debug(`${PREFIX} ${scope}`, message);
  }
}

export async function loggedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const method = init?.method ?? "GET";
  const url = typeof input === "string" ? input : input.toString();
  const startedAt = performance.now();
  log("http", `→ ${method} ${url}`);
  try {
    const response = await fetch(input, init);
    const durationMs = Math.round(performance.now() - startedAt);
    log("http", `← ${method} ${url} ${response.status} (${durationMs} ms)`);
    return response;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    log("http", `✗ ${method} ${url} failed after ${durationMs} ms`, error);
    throw error;
  }
}
