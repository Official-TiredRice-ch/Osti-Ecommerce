export const USER_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
};

export const STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.DISABLED]: 'Disabled',
};

export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: '#10b981', // green
  [USER_STATUS.DISABLED]: '#6b7280', // gray
};

export const STATUS_OPTIONS = [
  { value: USER_STATUS.ACTIVE, label: STATUS_LABELS[USER_STATUS.ACTIVE] },
  { value: USER_STATUS.DISABLED, label: STATUS_LABELS[USER_STATUS.DISABLED] },
];
