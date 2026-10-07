export function getInitials(name) {
  if (!name) return "?";

  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) || "";
  const last = parts.length > 1 ? parts.at(-1)?.charAt(0) || "" : "";

  return (first + last).toUpperCase();
}
