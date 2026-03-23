import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from './Modal';
import Button from '../login/Button';
import { BodyText } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

const AlertModal = ({
  visible,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  variant = 'info',
  icon,
}) => {
  const getIconConfig = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'error':
        return { name: 'close-circle-outline', color: COLORS.error };
      case 'warning':
        return { name: 'warning-outline', color: COLORS.warning };
      case 'success':
        return { name: 'checkmark-circle-outline', color: COLORS.success };
      case 'info':
      default:
        return { name: 'information-circle-outline', color: COLORS.primary };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="small"
    >
      <View style={styles.content}>
        {iconConfig && (
          <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '20' }]}>
            <Ionicons name={iconConfig.name} size={48} color={iconConfig.color} />
          </View>
        )}
        
        <BodyText style={styles.message}>{message}</BodyText>
        
        <Button
          title={buttonText}
          variant="primary"
          onPress={onClose}
          style={styles.button}
        />
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
  button: {
    width: '100%',
  },
});

export default AlertModal;
