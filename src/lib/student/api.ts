import axios from "axios";
import { API_URL, http } from "@/lib/http";

export { API_URL };

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: { method: string; data?: unknown },
): Promise<T> {
  try {
    const res = await http.request<T>({
      url: path,
      method: options.method,
      data: options.data,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      throw new ApiError(
        extractMessage(error.response?.data, `Request failed with status ${status}`),
        status,
        error.response?.data,
      );
    }
    throw new ApiError("Network error. Please try again.", 0);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", data: body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", data: body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export function resolveFileUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_URL}/${path.replace(/^\.?\/?/, "")}`;
}
