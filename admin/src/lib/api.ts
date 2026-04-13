import type { ApiEnvelope } from "../types/admin";

const DEFAULT_API_ROOT = "http://127.0.0.1:8000/api";
const STORAGE_KEY = "tarkam-admin-auth";

function normalizeApiRoot(value?: string): string {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return DEFAULT_API_ROOT;
  }

  const normalized = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue.replace(/^\/+/, "")}`;

  return normalized.replace(/\/(v1|v2)\/?$/i, "").replace(/\/+$/, "");
}

function hasFileValue(value: unknown): boolean {
  if (value instanceof File) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(hasFileValue);
  }

  return false;
}

function shouldUseMultipart(payload: Record<string, unknown> | undefined): boolean {
  if (!payload) {
    return false;
  }

  return Object.values(payload).some(hasFileValue);
}

function appendFormData(formData: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendFormData(formData, `${key}[]`, item));
    return;
  }

  if (typeof value === "boolean") {
    formData.append(key, value ? "1" : "0");
    return;
  }

  if (typeof value === "object") {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, String(value));
}

function buildBody(
  method: string,
  payload?: Record<string, unknown>,
): {
  body?: BodyInit;
  headers: HeadersInit;
  method: string;
} {
  if (!payload) {
    return { headers: {}, method };
  }

  if (shouldUseMultipart(payload)) {
    const formData = new FormData();
    const multipartMethod = method === "PATCH" || method === "PUT" || method === "DELETE" ? "POST" : method;

    if (multipartMethod !== method) {
      formData.append("_method", method);
    }

    Object.entries(payload).forEach(([key, value]) => appendFormData(formData, key, value));

    return { body: formData, headers: {}, method: multipartMethod };
  }

  return {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method,
  };
}

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return {
      message: text,
    };
  }
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const API_ROOT = normalizeApiRoot(import.meta.env.VITE_API_BASE_URL);
export const PUBLIC_API_BASE = `${API_ROOT}/v1`;
export const ADMIN_API_BASE = `${API_ROOT}/v2`;

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as { token?: string };
    return parsed.token || null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    payload?: Record<string, unknown>;
    token?: string | null;
    base?: string;
  } = {},
): Promise<ApiEnvelope<T>> {
  const method = options.method || "GET";
  const base = options.base || ADMIN_API_BASE;
  const token = options.token ?? getStoredToken();
  const { body, headers, method: requestMethod } = buildBody(method, options.payload);
  const response = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    method: requestMethod,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  });

  const parsed = await parseResponse<T>(response);

  if (!response.ok) {
    throw new ApiError(
      parsed.message || `Request gagal dengan status ${response.status}`,
      response.status,
      parsed,
    );
  }

  return parsed;
}

export function extractList<T>(payload: ApiEnvelope<T[] | T>): T[] {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload as unknown[])) {
    return payload as unknown as T[];
  }

  return [];
}

export function extractItem<T>(payload: ApiEnvelope<T>): T | null {
  if (payload.data === undefined) {
    return null;
  }

  return payload.data;
}

export function getSessionStorageKey(): string {
  return STORAGE_KEY;
}
