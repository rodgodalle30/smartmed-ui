export const DEFAULT_SYSTEM_COLOR = "#475569";

const storageKey = () =>
  `smartmed:system-theme:${typeof window === "undefined" ? "default" : window.location.host}`;
const legacyAdminStorageKey = () =>
  `smartmed:admin-theme:${typeof window === "undefined" ? "default" : window.location.host}`;

export const normalizeSystemColor = (value) => {
  const color = typeof value === "string" ? value.trim() : "";

  if (!color) return null;
  if (typeof CSS !== "undefined" && !CSS.supports("color", color)) return null;

  return color;
};

export const getCachedSystemColor = () => {
  if (typeof localStorage === "undefined") return DEFAULT_SYSTEM_COLOR;

  try {
    return (
      normalizeSystemColor(localStorage.getItem(storageKey())) ||
      normalizeSystemColor(localStorage.getItem(legacyAdminStorageKey())) ||
      DEFAULT_SYSTEM_COLOR
    );
  } catch {
    return DEFAULT_SYSTEM_COLOR;
  }
};

export const cacheSystemColor = (color) => {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(storageKey(), color);
  } catch {
    // The live theme still works when browser storage is unavailable.
  }
};

export const clearCachedSystemColor = () => {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.removeItem(storageKey());
    localStorage.removeItem(legacyAdminStorageKey());
  } catch {
    // Ignore browsers where storage is unavailable or restricted.
  }
};

export const applySystemTheme = (color) => {
  if (typeof document === "undefined") return;

  const themeColor = normalizeSystemColor(color) || DEFAULT_SYSTEM_COLOR;
  const root = document.documentElement;

  root.style.setProperty("--system-color", themeColor);
  root.style.setProperty(
    "--system-color-hover",
    `color-mix(in srgb, ${themeColor} 82%, black)`,
  );
  root.style.setProperty(
    "--system-color-soft",
    `color-mix(in srgb, ${themeColor} 10%, transparent)`,
  );
  root.style.setProperty(
    "--system-color-border",
    `color-mix(in srgb, ${themeColor} 20%, transparent)`,
  );
  root.style.setProperty(
    "--system-color-faint",
    `color-mix(in srgb, ${themeColor} 5%, transparent)`,
  );
  root.style.setProperty(
    "--system-color-ring",
    `color-mix(in srgb, ${themeColor} 30%, transparent)`,
  );
  root.style.setProperty(
    "--system-color-60",
    `color-mix(in srgb, ${themeColor} 60%, transparent)`,
  );
  root.style.setProperty(
    "--system-color-active",
    `color-mix(in srgb, ${themeColor} 65%, black)`,
  );
};
