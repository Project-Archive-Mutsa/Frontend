import { ApiError } from "./api-error";

export const DEFAULT_API_TIMEOUT_MS = 8_000;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMessage = "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
) {
  const controller = new AbortController();
  let didTimeout = false;
  const sourceSignal = init.signal;
  const abortFromSource = () => controller.abort(sourceSignal?.reason);

  if (sourceSignal?.aborted) {
    abortFromSource();
  } else {
    sourceSignal?.addEventListener("abort", abortFromSource, { once: true });
  }

  const timeoutId = globalThis.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, DEFAULT_API_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (didTimeout) {
      throw new ApiError(timeoutMessage, 408, "CLIENT_REQUEST_TIMEOUT");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
    sourceSignal?.removeEventListener("abort", abortFromSource);
  }
}
