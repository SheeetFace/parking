import type { AuthSuccessResponse } from "../types/api/authSuccessResponse";
import type { ErrorResponse } from "../types/api/errorResponse";

type Path = 'login' | 'register';

const BASE_URL = import.meta.env.VITE_API_URL + "auth";

export async function auth(email: string, password: string, path:Path): Promise<AuthSuccessResponse | ErrorResponse> {
    const response = await fetch(`${BASE_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error(data)
    }
    return data;
}