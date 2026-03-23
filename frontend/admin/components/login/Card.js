import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/login/theme';

const Card = ({
  children,
  style,
  padding = 'md',
  shadow = true,
  backgroundColor = COLORS.background,
  ...props
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: SPACING.sm };
      case 'md':
        return { padding: SPACING.md };
      case 'lg':
        return { padding: SPACING.lg };
      case 'xl':
        return { padding: SPACING.xl };
      default:
        return { padding: SPACING.md };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getPaddingStyle(),
        shadow && styles.shadow,
        { backgroundColor },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
  },
  shadow: Platform.select({
    web: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  }),
});

export default Card;
