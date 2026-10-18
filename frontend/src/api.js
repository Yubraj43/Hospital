const PRODUCTION_API_BASE_URL = "https://generous-embrace-production-042e.up.railway.app/api";
const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const configuredLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(configuredApiBaseUrl);
const configuredRenderApi = /sirjana-hospital-backend\.onrender\.com/i.test(configuredApiBaseUrl);

// Keep production on Railway even if Vercel still has the old Render URL saved.
export const API_BASE_URL = (
  import.meta.env.PROD && (configuredLocalhost || configuredRenderApi)
    ? PRODUCTION_API_BASE_URL
    : configuredApiBaseUrl || PRODUCTION_API_BASE_URL
).replace(/\/$/, "");
