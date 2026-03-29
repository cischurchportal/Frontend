// Central API base URL — reads from env var in production, falls back to relative path for dev proxy
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export function apiUrl(path) {
  // Ensure path starts with /api/
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}
