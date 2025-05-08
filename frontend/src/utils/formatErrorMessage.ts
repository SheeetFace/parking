import type { ErrorResponse } from "../types/api/errorResponse";

export function formatErrorMessage(error: ErrorResponse): string {
  if (Array.isArray(error.message)) {
    return error.message.join(", ");
  }
  return error.message;
}
