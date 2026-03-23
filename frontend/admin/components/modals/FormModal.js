import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Modal from './Modal';
import Button from '../login/Button';
import { DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

const FormModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
  size = 'medium',
  submitDisabled = false,
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size={size}
      closeOnBackdrop={!loading}
      showCloseButton={!loading}
    >
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      
      <View style={styles.actions}>
        <Button
          title={cancelText}
          variant="outline"
          onPress={onClose}
          disabled={loading}
          style={styles.button}
        />
        <Button
          title={submitText}
          variant="primary"
          onPress={onSubmit}
          loading={loading}
          disabled={submitDisabled}
          style={styles.button}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    maxHeight: 500,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  button: {
    flex: 1,
  },
});

export default FormModal;
