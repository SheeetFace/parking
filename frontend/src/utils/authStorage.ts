import type { AuthSuccessResponse } from "../types/api/authSuccessResponse";

export function saveAuthData(auth: AuthSuccessResponse) {
  if (!auth.accessToken || !auth.userId) {
    throw new Error("Invalid authorization data");
  }
  localStorage.setItem("accessToken", auth.accessToken);
  localStorage.setItem("userId", auth.userId);
}
