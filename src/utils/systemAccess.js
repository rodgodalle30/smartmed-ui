const normalizeSystemName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export const getAllPermissions = (access) =>
  Array.isArray(access?.allpermissions)
    ? access.allpermissions.filter((permission) => typeof permission === "string")
    : [];

export const hasSystemPermission = (access, systemName) => {
  const normalizedSystemName = normalizeSystemName(systemName);
  if (!normalizedSystemName) return false;

  const prefix = `${normalizedSystemName}.`;

  return getAllPermissions(access).some((permission) =>
    permission.trim().toLowerCase().startsWith(prefix),
  );
};
