const PRODUCTION_API_BASE_URL = "https://sirjana-hospital-backend.onrender.com/api";
const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const configuredLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(configuredApiBaseUrl);

// Prevent a local development URL from being baked into the deployed Vercel site.
export const API_BASE_URL = (
  import.meta.env.PROD && configuredLocalhost
    ? PRODUCTION_API_BASE_URL
    : configuredApiBaseUrl || PRODUCTION_API_BASE_URL
).replace(/\/$/, "");
