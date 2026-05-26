
export const ROLES = {
  ADMIN:  "ADMIN",
  DRIVER: "DRIVER",
};

export const isAdminRole  = (role) => role === ROLES.ADMIN;

export const isDriverRole = (role) => role === ROLES.DRIVER;

export const hasAllowedRole = (role, allowedRoles = []) =>
  allowedRoles.includes(role);
