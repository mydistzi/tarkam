// Import Axios
import axios from "axios";

const DEFAULT_API_BASE_URL = "https://tarkam-api-web-production.up.railway.app/api/v1";
const AUTH_STORAGE_KEY = "tarkam_auth_user";

function normalizeApiBaseUrl(value: string | undefined): string {
  const baseUrl = String(value || "").trim();
  if (!baseUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(baseUrl)) {
    return baseUrl.replace(/\/+$/, "");
  }

  return `https://${baseUrl.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

function buildPublicApiBaseUrl(value: string | undefined): string {
  const normalized = normalizeApiBaseUrl(value);

  if (!normalized) {
    return "";
  }

  if (/\/api\/v1$/i.test(normalized)) {
    return normalized;
  }

  if (/\/api$/i.test(normalized)) {
    return `${normalized}/v1`;
  }

  return `${normalized}/api/v1`;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const serialized = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const stored = JSON.parse(serialized) as { token?: string };
    return stored?.token ?? null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

const Api = axios.create({
  baseURL:
    buildPublicApiBaseUrl(import.meta.env.VITE_API_BASE_URL) ||
    buildPublicApiBaseUrl((import.meta.env as Record<string, string | undefined>).API_BASE_URL) ||
    DEFAULT_API_BASE_URL,
});

Api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default Api;
