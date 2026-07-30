export function getStoredUser(storage = localStorage) {
  const raw = storage.getItem("user");
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Generic safe JSON reader for any localStorage/sessionStorage key.
// Guards against the literal strings "undefined"/"null" (which happen
// when JSON.stringify(undefined) gets coerced into storage) and any
// other malformed JSON, returning `fallback` instead of throwing.
export function safeGetJSON(key, fallback = null, storage = localStorage) {
  const raw = storage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}