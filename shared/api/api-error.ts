import { z } from "zod";

const errorPayloadSchema = z
  .object({
    success: z.boolean().optional(),
    message: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    errorCode: z.string().nullable().optional(),
    requestId: z.string().nullable().optional(),
    fieldErrors: z.record(z.string(), z.string()).optional(),
  })
  .passthrough();

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly requestId: string | null;
  readonly fieldErrors: Readonly<Record<string, string>>;

  constructor(
    message: string,
    status: number,
    code: string | null = null,
    requestId: string | null = null,
    fieldErrors: Readonly<Record<string, string>> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.fieldErrors = fieldErrors;
  }
}

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new ApiError("서버 응답을 읽을 수 없습니다.", response.status);
  }
}

export function getApiError(
  payload: unknown,
  status: number,
  fallbackMessage: string,
) {
  const parsed = errorPayloadSchema.safeParse(payload);
  const message = parsed.success && parsed.data.success !== true ? parsed.data.message?.trim() : null;
  const code = parsed.success
    ? (parsed.data.code ?? parsed.data.errorCode ?? null)
    : null;
  const requestId = parsed.success ? (parsed.data.requestId ?? null) : null;
  const fieldErrors = parsed.success ? (parsed.data.fieldErrors ?? {}) : {};

  return new ApiError(
    message || `${fallbackMessage} (${status})`,
    status,
    code,
    requestId,
    fieldErrors,
  );
}
