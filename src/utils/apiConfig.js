const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const createApiUrl = (path = "") => {
  if (!path) return "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE_URL) {
    const base = API_BASE_URL.replace(/\/+$/, "");
    return `${base}${normalizedPath}`;
  }
  return normalizedPath;
};
