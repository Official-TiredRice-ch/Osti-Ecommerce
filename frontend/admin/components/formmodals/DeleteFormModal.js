import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../modals';
import Button from '../login/Button';
import Input from '../login/Input';
import Card from '../login/Card';
import { BodyText, SmallText, Caption } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

/**
 * DeleteFormModal - Reusable modal for delete confirmations
 * 
 * @param {boolean} visible - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Delete confirmation handler
 * @param {string} title - Modal title (e.g., "Delete Product")
 * @param {string} itemName - Name of item being deleted (for display)
 * @param {string} itemType - Type of item (e.g., "product", "user", "category")
 * @param {string} message - Custom warning message (optional)
 * @param {boolean} requireConfirmation - Require typing confirmation text (default: false)
 * @param {string} confirmationText - Text user must type to confirm (default: "DELETE")
 * @param {boolean} loading - Loading state
 * @param {array} warnings - Array of warning messages to display
 * @param {object} details - Additional details to show (key-value pairs)
 */
const DeleteFormModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Delete Item',
  itemName,
  itemType = 'item',
  message,
  requireConfirmation = false,
  confirmationText = 'DELETE',
  loading = false,
  warnings = [],
  details = {},
}) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (requireConfirmation && confirmInput !== confirmationText) {
      setError(`Please type "${confirmationText}" to confirm`);
      return;
    }
    onConfirm();
  };

  const handleClose = () => {
    setConfirmInput('');
    setError('');
    onClose();
  };

  const isConfirmDisabled = requireConfirmation && confirmInput !== confirmationText;

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={title}
      size="small"
      closeOnBackdrop={!loading}
      showCloseButton={!loading}
    >
      <View style={styles.content}>
        {/* Warning Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="warning-outline" size={56} color={COLORS.error} />
        </View>

        {/* Item Name */}
        {itemName && (
          <Card shadow={false} padding="md" style={styles.itemCard}>
            <SmallText color={COLORS.textSecondary}>You are about to delete:</SmallText>
            <BodyText style={styles.itemName}>{itemName}</BodyText>
          </Card>
        )}

        {/* Warning Message */}
        <BodyText style={styles.message}>
          {message || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
        </BodyText>

        {/* Additional Details */}
        {Object.keys(details).length > 0 && (
          <Card shadow={false} padding="md" style={styles.detailsCard}>
            {Object.entries(details).map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <SmallText color={COLORS.textSecondary}>{key}:</SmallText>
                <SmallText style={styles.detailValue}>{value}</SmallText>
              </View>
            ))}
          </Card>
        )}

        {/* Warnings List */}
        {warnings.length > 0 && (
          <View style={styles.warningsContainer}>
            <View style={styles.warningHeader}>
              <Ionicons name="alert-circle-outline" size={18} color={COLORS.warning} />
              <SmallText color={COLORS.warning} style={styles.warningTitle}>
                Important Warnings:
              </SmallText>
            </View>
            {warnings.map((warning, index) => (
              <View key={index} style={styles.warningItem}>
                <Caption color={COLORS.textSecondary}>• {warning}</Caption>
              </View>
            ))}
          </View>
        )}

        {/* Confirmation Input */}
        {requireConfirmation && (
          <View style={styles.confirmationContainer}>
            <SmallText color={COLORS.textSecondary} style={styles.confirmationLabel}>
              Type <BodyText style={styles.confirmationCode}>{confirmationText}</BodyText> to confirm:
            </SmallText>
            <Input
              value={confirmInput}
              onChangeText={(text) => {
                setConfirmInput(text);
                setError('');
              }}
              placeholder={confirmationText}
              error={error}
              autoCapitalize="characters"
            />
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleClose}
            disabled={loading}
            style={styles.button}
          />
          <Button
            title="Delete"
            variant="primary"
            onPress={handleConfirm}
            loading={loading}
            disabled={isConfirmDisabled}
            style={[styles.button, styles.deleteButton]}
            leftIcon={!loading && <Ionicons name="trash-outline" size={18} color="#fff" />}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  itemCard: {
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  itemName: {
    fontWeight: '600',
    marginTop: SPACING.xs,
    color: COLORS.error,
  },
  message: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  detailValue: {
    fontWeight: '600',
  },
  warningsContainer: {
    width: '100%',
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.lg,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  warningTitle: {
    fontWeight: '600',
  },
  warningItem: {
    paddingLeft: SPACING.md,
    paddingVertical: 2,
  },
  confirmationContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  confirmationLabel: {
    marginBottom: SPACING.sm,
  },
  confirmationCode: {
    fontWeight: '700',
    color: COLORS.error,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
});

export default DeleteFormModal;
