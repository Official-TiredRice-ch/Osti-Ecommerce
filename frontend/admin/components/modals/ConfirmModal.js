import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from './Modal';
import Button from '../login/Button';
import { BodyText } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  icon,
  loading = false,
}) => {
  const getIconConfig = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'danger':
        return { name: 'warning-outline', color: COLORS.error };
      case 'warning':
        return { name: 'alert-circle-outline', color: COLORS.warning };
      case 'success':
        return { name: 'checkmark-circle-outline', color: COLORS.success };
      default:
        return { name: 'help-circle-outline', color: COLORS.primary };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="small"
      closeOnBackdrop={!loading}
    >
      <View style={styles.content}>
        {iconConfig && (
          <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '20' }]}>
            <Ionicons name={iconConfig.name} size={48} color={iconConfig.color} />
          </View>
        )}
        
        <BodyText style={styles.message}>{message}</BodyText>
        
        <View style={styles.actions}>
          <Button
            title={cancelText}
            variant="outline"
            onPress={onClose}
            disabled={loading}
            style={styles.button}
          />
          <Button
            title={confirmText}
            variant={variant === 'danger' ? 'primary' : variant}
            onPress={onConfirm}
            loading={loading}
            style={[styles.button, variant === 'danger' && styles.dangerButton]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  message: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
});

export default ConfirmModal;
