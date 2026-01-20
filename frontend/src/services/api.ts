import axios, { AxiosError } from "axios";

let onUnauthorized: (() => void) | null = null;

export type ApiErrorEventDetail = {
  status?: number;
  message: string;
  url?: string;
  method?: string;
};

export const API_ERROR_EVENT = "sts:api-error";

export function setOnUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

function getBaseUrl() {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/";
  return raw.trim() === "" ? "/" : raw;
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    const detail: ApiErrorEventDetail = {
      status,
      message: getErrorMessage(err),
      url: err.config?.url,
      method: err.config?.method?.toUpperCase(),
    };
    window.dispatchEvent(new CustomEvent<ApiErrorEventDetail>(API_ERROR_EVENT, { detail }));
    if (status === 401 && onUnauthorized) onUnauthorized();
    return Promise.reject(err);
  },
);

export function getErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) return "Unexpected error";
  const status = err.response?.status;
  const data = err.response?.data;
  if (typeof data === "string" && data.trim()) return `[${status}] ${data}`;
  if (data && typeof data === "object") return `[${status}] ${JSON.stringify(data)}`;
  return status ? `Request failed (${status})` : "Network error";
}
