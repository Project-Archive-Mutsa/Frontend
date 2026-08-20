import { z } from "zod";

const errorPayloadSchema = z
  .object({
    success: z.boolean().optional(),
    message: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    errorCode: z.string().nullable().optional(),
  })
  .passthrough();

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
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

  return new ApiError(message || `${fallbackMessage} (${status})`, status, code);
}
