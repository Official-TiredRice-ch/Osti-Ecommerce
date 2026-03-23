import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormModal } from '../modals';
import Input from '../login/Input';
import { SmallText } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

/**
 * AddFormModal - Reusable modal for adding new items
 * 
 * @param {boolean} visible - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {function} onSubmit - Submit handler (receives formData)
 * @param {string} title - Modal title (e.g., "Add Product")
 * @param {array} fields - Array of field configurations
 * @param {boolean} loading - Loading state
 * 
 * Field configuration:
 * {
 *   name: 'fieldName',
 *   label: 'Field Label',
 *   type: 'text' | 'email' | 'number' | 'password' | 'textarea',
 *   placeholder: 'Placeholder text',
 *   required: true | false,
 *   icon: 'icon-name',
 *   validation: (value) => error message or null
 * }
 */
const AddFormModal = ({
  visible,
  onClose,
  onSubmit,
  title = 'Add New Item',
  fields = [],
  loading = false,
  submitText = 'Create',
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    onClose();
  };

  const renderField = (field) => {
    const isTextarea = field.type === 'textarea';
    const keyboardType = field.type === 'email' ? 'email-address' 
      : field.type === 'number' ? 'numeric' 
      : 'default';

    return (
      <View key={field.name} style={styles.fieldContainer}>
        <Input
          label={field.label + (field.required ? ' *' : '')}
          value={formData[field.name] || ''}
          onChangeText={(value) => handleFieldChange(field.name, value)}
          placeholder={field.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={field.type === 'password'}
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          error={errors[field.name]}
          leftIcon={field.icon && (
            <Ionicons name={field.icon} size={20} color={COLORS.textSecondary} />
          )}
        />
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
      size="medium"
    >
      <SmallText color={COLORS.textSecondary} style={styles.hint}>
        Fields marked with * are required
      </SmallText>
      
      {fields.map(renderField)}
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
});

export default AddFormModal;
