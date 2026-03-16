import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../../constants/login/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.buttonPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhost);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'medium':
        baseStyle.push(styles.buttonMedium);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }
    
    // State styles
    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        baseTextStyle.push(styles.textPrimary);
        break;
      case 'secondary':
        baseTextStyle.push(styles.textSecondary);
        break;
      case 'outline':
        baseTextStyle.push(styles.textOutline);
        break;
      case 'ghost':
        baseTextStyle.push(styles.textGhost);
        break;
      default:
        baseTextStyle.push(styles.textPrimary);
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        baseTextStyle.push(styles.textSmall);
        break;
      case 'medium':
        baseTextStyle.push(styles.textMedium);
        break;
      case 'large':
        baseTextStyle.push(styles.textLarge);
        break;
      default:
        baseTextStyle.push(styles.textMedium);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.background} 
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    transition: Platform.OS === 'web' ? 'all 0.2s ease' : undefined,
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonSmall: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  buttonMedium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  buttonLarge: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: Platform.OS === 'web' ? 'not-allowed' : undefined,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textPrimary: {
    color: COLORS.background,
  },
  textSecondary: {
    color: COLORS.background,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textGhost: {
    color: COLORS.primary,
  },
  textSmall: {
    ...TYPOGRAPHY.body2,
  },
  textMedium: {
    ...TYPOGRAPHY.body1,
  },
  textLarge: {
    ...TYPOGRAPHY.h3,
  },
});

export default Button;
