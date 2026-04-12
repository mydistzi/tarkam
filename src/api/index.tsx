// Import Axios
import axios from "axios";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api/v1";
// const DEFAULT_API_BASE_URL = "https://tarkam-api-web-production.up.railway.app/api/v1";

function normalizeApiBaseUrl(value: string | undefined): string {
  const baseUrl = String(value || "").trim();
  if (!baseUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(baseUrl)) {
    return baseUrl;
  }

  return `https://${baseUrl}`;
}

const Api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.BAILEYS_PUBLIC_BASE_URL) || DEFAULT_API_BASE_URL,
});

export default Api;
