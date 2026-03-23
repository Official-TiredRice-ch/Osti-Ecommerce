export * from './roles';
export * from './status';

export const USER_TABLE_COLUMNS = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'username', label: 'Username', width: 150 },
  { key: 'email', label: 'Email', width: 200 },
  { key: 'role', label: 'Role', width: 100 },
  { key: 'status', label: 'Status', width: 100 },
  { key: 'created_at', label: 'Created', width: 150 },
  { key: 'actions', label: 'Actions', width: 120 },
];

export const USER_FORM_FIELDS = {
  ADD: [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      icon: 'person-outline',
      validation: (value) => {
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return null;
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      icon: 'mail-outline',
      validation: (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return null;
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      icon: 'lock-closed-outline',
      validation: (value) => {
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select role',
      required: true,
      icon: 'shield-outline',
    },
  ],
  EDIT: [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      icon: 'person-outline',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      icon: 'mail-outline',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select role',
      required: true,
      icon: 'shield-outline',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      required: true,
      icon: 'toggle-outline',
    },
  ],
};
