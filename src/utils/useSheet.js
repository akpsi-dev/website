import axios from "axios";
import useSWR from "swr";

export const ROSTER_SHEET_ID = "167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg";
export const ROSTER_RANGE = "Form Responses 1!C2:M";
export const LEADERSHIP_RANGE = "Leadership Test!A2:C";
export const CAREERS_SHEET_ID = "1YY9TyYXJPHNJ8n1M2O9iKQaB00oCIghhkb5UpxTxV0g";
export const CAREERS_RANGE = "Form Responses 1!B2:G";

const CACHE_PREFIX = "akpsi-sheet:";

function readCache(key) {
  try {
    const raw = window.sessionStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeCache(key, values) {
  try {
    window.sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(values));
  } catch {
    // storage full/unavailable — caching is best-effort
  }
}

// In development `npm start` has no /api routes (those need `vercel dev`),
// so fall back to calling Google directly with the dev-only REACT_APP keys.
// The NODE_ENV guard lets the production build drop this branch — and the
// keys — from the bundle entirely.
function devFallbackUrl(sheetId, range) {
  if (process.env.NODE_ENV !== "development") return null;
  const key =
    sheetId === CAREERS_SHEET_ID
      ? process.env.REACT_APP_CAREERS_INFO_KEY
      : process.env.REACT_APP_ACTIVE_INFO_KEY;
  if (!key) return null;
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${key}`;
}

async function fetchSheet([sheetId, range]) {
  const proxyUrl = `/api/sheet?id=${encodeURIComponent(sheetId)}&range=${encodeURIComponent(range)}`;
  try {
    const response = await axios.get(proxyUrl);
    // CRA's dev server answers unknown routes with index.html, so insist on
    // a real payload before trusting the proxy response.
    if (!Array.isArray(response.data?.values)) {
      throw new Error("Proxy unavailable");
    }
    return response.data.values;
  } catch (error) {
    const fallback = devFallbackUrl(sheetId, range);
    if (!fallback) throw error;
    const response = await axios.get(fallback);
    return response.data.values ?? [];
  }
}

/**
 * Cached Google Sheets fetch (via the /api/sheet proxy). Repeat navigations
 * render instantly from sessionStorage, and quota/network failures fall back
 * to the last good response instead of a blank page.
 */
export function useSheet(sheetId, range) {
  const cacheKey = `${sheetId}/${range}`;
  const swr = useSWR([sheetId, range], fetchSheet, {
    fallbackData:
      typeof window !== "undefined" ? readCache(cacheKey) : undefined,
    revalidateOnFocus: false,
    keepPreviousData: true,
    onSuccess: (values) => writeCache(cacheKey, values),
  });

  return {
    rows: swr.data,
    error: swr.data ? undefined : swr.error,
    isLoading: !swr.data && !swr.error,
  };
}

export function useRoster() {
  return useSheet(ROSTER_SHEET_ID, ROSTER_RANGE);
}
