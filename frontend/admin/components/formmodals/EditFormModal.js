import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormModal } from '../modals';
import Input from '../login/Input';
import { SmallText } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

/**
 * EditFormModal - Reusable modal for editing existing items
 * 
 * @param {boolean} visible - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {function} onSubmit - Submit handler (receives formData)
 * @param {string} title - Modal title (e.g., "Edit Product")
 * @param {array} fields - Array of field configurations (same as AddFormModal)
 * @param {object} initialData - Initial form data to populate fields
 * @param {boolean} loading - Loading state
 */
const EditFormModal = ({
  visible,
  onClose,
  onSubmit,
  title = 'Edit Item',
  fields = [],
  initialData = {},
  loading = false,
  submitText = 'Update',
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Populate form with initial data when modal opens
  useEffect(() => {
    if (visible && initialData) {
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [visible, initialData]);

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      const value = formData[field.name] || '';
      
      // Required validation
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
      
      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    setHasChanges(false);
    onClose();
  };

  const renderField = (field) => {
    const isTextarea = field.type === 'textarea';
    const keyboardType = field.type === 'email' ? 'email-address' 
      : field.type === 'number' ? 'numeric' 
      : 'default';
    const isDisabled = field.disabled || field.readOnly;

    return (
      <View key={field.name} style={styles.fieldContainer}>
        <Input
          label={field.label + (field.required ? ' *' : '')}
          value={formData[field.name]?.toString() || ''}
          onChangeText={(value) => handleFieldChange(field.name, value)}
          placeholder={field.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={field.type === 'password'}
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          error={errors[field.name]}
          editable={!isDisabled}
          leftIcon={field.icon && (
            <Ionicons 
              name={field.icon} 
              size={20} 
              color={isDisabled ? COLORS.textLight : COLORS.textSecondary} 
            />
          )}
          style={isDisabled && styles.disabledField}
        />
        {field.readOnly && (
          <SmallText color={COLORS.textLight} style={styles.readOnlyHint}>
            This field cannot be edited
          </SmallText>
        )}
      </View>
    );
  };

  return (
    <FormModal
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
      submitText={submitText}
      loading={loading}
      submitDisabled={!hasChanges}
      size="medium"
    >
      <SmallText color={COLORS.textSecondary} style={styles.hint}>
        Fields marked with * are required
      </SmallText>
      
      {fields.map(renderField)}
      
      {!hasChanges && (
        <SmallText color={COLORS.warning} style={styles.noChangesHint}>
          Make changes to enable the update button
        </SmallText>
      )}
    </FormModal>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  hint: {
    marginBottom: SPACING.lg,
  },
  disabledField: {
    opacity: 0.6,
  },
  readOnlyHint: {
    marginTop: SPACING.xs,
    fontSize: 11,
  },
  noChangesHint: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default EditFormModal;
