// Import Axios
import axios from "axios";

// const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const DEFAULT_API_BASE_URL = "https://tarkam-api-web-production.up.railway.app/api/v1";

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

const Api = axios.create({
  baseURL:
    buildPublicApiBaseUrl(import.meta.env.VITE_API_BASE_URL) ||
    buildPublicApiBaseUrl((import.meta.env as Record<string, string | undefined>).API_BASE_URL) ||
    DEFAULT_API_BASE_URL,
});

export default Api;
