import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../modals';
import Button from '../login/Button';
import Card from '../login/Card';
import { SmallText, BodyText, Caption } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING, BORDER_RADIUS } from '../../constants/dashboard/theme';

/**
 * ViewFormModal - Reusable modal for viewing item details (read-only)
 * 
 * @param {boolean} visible - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {function} onEdit - Optional edit handler
 * @param {function} onDelete - Optional delete handler
 * @param {string} title - Modal title (e.g., "Product Details")
 * @param {array} fields - Array of field configurations
 * @param {object} data - Data to display
 * 
 * Field configuration:
 * {
 *   name: 'fieldName',
 *   label: 'Field Label',
 *   icon: 'icon-name',
 *   type: 'text' | 'badge' | 'date' | 'currency',
 *   format: (value) => formatted value (optional)
 * }
 */
const ViewFormModal = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  title = 'View Details',
  fields = [],
  data = {},
  size = 'medium',
}) => {
  const formatValue = (field, value) => {
    if (!value && value !== 0) return 'N/A';
    
    if (field.format) {
      return field.format(value);
    }
    
    switch (field.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;
      case 'badge':
        return value;
      default:
        return value.toString();
    }
  };

  const renderField = (field) => {
    const value = data[field.name];
    const formattedValue = formatValue(field, value);
    const isBadge = field.type === 'badge';

    return (
      <View key={field.name} style={styles.fieldRow}>
        <View style={styles.fieldLabel}>
          {field.icon && (
            <Ionicons 
              name={field.icon} 
              size={18} 
              color={COLORS.textSecondary} 
              style={styles.fieldIcon}
            />
          )}
          <SmallText color={COLORS.textSecondary}>{field.label}</SmallText>
        </View>
        
        <View style={styles.fieldValue}>
          {isBadge ? (
            <View style={[styles.badge, { backgroundColor: field.badgeColor || COLORS.primary + '20' }]}>
              <Caption color={field.badgeColor || COLORS.primary}>
                {formattedValue}
              </Caption>
            </View>
          ) : (
            <BodyText>{formattedValue}</BodyText>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size={size}
    >
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card shadow={false} padding="md" style={styles.detailsCard}>
          {fields.map(renderField)}
        </Card>
      </ScrollView>
      
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onDelete && (
            <Button
              title="Delete"
              variant="outline"
              onPress={onDelete}
              leftIcon={<Ionicons name="trash-outline" size={18} color={COLORS.error} />}
              style={[styles.button, styles.deleteButton]}
              textStyle={{ color: COLORS.error }}
            />
          )}
          {onEdit && (
            <Button
              title="Edit"
              variant="primary"
              onPress={onEdit}
              leftIcon={<Ionicons name="create-outline" size={18} color="#fff" />}
              style={styles.button}
            />
          )}
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    maxHeight: 500,
  },
  detailsCard: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  fieldRow: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  fieldIcon: {
    marginRight: SPACING.xs,
  },
  fieldValue: {
    paddingLeft: SPACING.lg + SPACING.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
});

export default ViewFormModal;
