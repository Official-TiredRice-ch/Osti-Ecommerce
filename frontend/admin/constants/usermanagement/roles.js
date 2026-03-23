export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.STAFF]: 'Staff',
  [USER_ROLES.CUSTOMER]: 'Customer',
};

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: '#ef4444', // red
  [USER_ROLES.STAFF]: '#f59e0b', // orange
  [USER_ROLES.CUSTOMER]: '#10b981', // green
};

export const ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: ROLE_LABELS[USER_ROLES.ADMIN] },
  { value: USER_ROLES.STAFF, label: ROLE_LABELS[USER_ROLES.STAFF] },
  { value: USER_ROLES.CUSTOMER, label: ROLE_LABELS[USER_ROLES.CUSTOMER] },
];
