import React from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../login/Card';
import { Heading3 } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING, BORDER_RADIUS } from '../../constants/dashboard/theme';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  const getModalWidth = () => {
    switch (size) {
      case 'small':
        return 400;
      case 'medium':
        return 500;
      case 'large':
        return 700;
      case 'full':
        return '90%';
      default:
        return 500;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        
        <View style={[styles.modalContainer, { width: getModalWidth() }]}>
          <Card shadow padding="none" style={styles.card}>
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && <Heading3>{title}</Heading3>}
                {showCloseButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Content */}
            <View style={styles.content}>
              {children}
            </View>
          </Card>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    maxWidth: '90%',
    maxHeight: '90%',
  },
  card: {
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
  },
});

export default Modal;
