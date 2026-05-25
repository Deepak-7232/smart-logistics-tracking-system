/**
 * Centralized role constants.
 * Always import from here — never hardcode role strings in components.
 *
 * ADMIN  — manages the entire system
 * DRIVER — authenticated employee (was previously USER)
 */
export const ROLES = {
  ADMIN:  "ADMIN",
  DRIVER: "DRIVER",
};

/** Returns true if the given role is ADMIN */
export const isAdminRole  = (role) => role === ROLES.ADMIN;

/** Returns true if the given role is DRIVER */
export const isDriverRole = (role) => role === ROLES.DRIVER;

/** Returns true if role is in the allowedRoles array */
export const hasAllowedRole = (role, allowedRoles = []) =>
  allowedRoles.includes(role);
