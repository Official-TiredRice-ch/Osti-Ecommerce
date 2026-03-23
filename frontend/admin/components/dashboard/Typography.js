import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TYPOGRAPHY, DASHBOARD_COLORS as COLORS } from '../../constants/dashboard/theme';

export const Heading1 = ({ children, style, color = COLORS.text, ...props }) => (
  <Text style={[styles.h1, { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading2 = ({ children, style, color = COLORS.text, ...props }) => (
  <Text style={[styles.h2, { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading3 = ({ children, style, color = COLORS.text, ...props }) => (
  <Text style={[styles.h3, { color }, style]} {...props}>
    {children}
  </Text>
);

export const BodyText = ({ children, style, color = COLORS.text, ...props }) => (
  <Text style={[styles.body1, { color }, style]} {...props}>
    {children}
  </Text>
);

export const SmallText = ({ children, style, color = COLORS.textSecondary, ...props }) => (
  <Text style={[styles.body2, { color }, style]} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, style, color = COLORS.textLight, ...props }) => (
  <Text style={[styles.caption, { color }, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  h1: {
    ...TYPOGRAPHY.h1,
  },
  h2: {
    ...TYPOGRAPHY.h2,
  },
  h3: {
    ...TYPOGRAPHY.h3,
  },
  body1: {
    ...TYPOGRAPHY.body1,
  },
  body2: {
    ...TYPOGRAPHY.body2,
  },
  caption: {
    ...TYPOGRAPHY.caption,
  },
});
