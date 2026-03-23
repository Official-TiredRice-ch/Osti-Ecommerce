import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../login/theme';

// Extend login theme for dashboard-specific needs
export const DASHBOARD_COLORS = {
  ...COLORS,
  sidebar: '#1e293b',
  sidebarActive: '#334155',
  sidebarText: '#e2e8f0',
  sidebarTextActive: '#ffffff',
  headerBg: '#ffffff',
  contentBg: '#f8fafc',
  cardHover: '#f1f5f9',
};

export const DASHBOARD_SPACING = {
  ...SPACING,
  sidebarWidth: 240,
  headerHeight: 64,
  contentPadding: 24,
};

export { TYPOGRAPHY, BORDER_RADIUS };
