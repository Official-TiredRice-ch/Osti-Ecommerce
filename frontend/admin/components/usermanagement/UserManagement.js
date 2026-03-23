import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Heading2, SmallText } from '../dashboard/Typography';
import Button from '../login/Button';
import UserTable from './UserTable';
import { AddFormModal, EditFormModal, ViewFormModal, DeleteFormModal } from '../formmodals';
import { AlertModal } from '../modals';
import { userAPI } from '../../utils/api';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';
import { USER_FORM_FIELDS, ROLE_LABELS, ROLE_COLORS, STATUS_LABELS, STATUS_COLORS } from '../../constants/usermanagement';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', variant: 'info' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll({ limit: 100 });
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showAlert('Error', 'Failed to load users. Please try again.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showAlert = (title, message, variant = 'info') => {
    setAlertMessage({ title, message, variant });
    setShowAlertModal(true);
  };

  const handleAdd = async (formData) => {
    try {
      setActionLoading(true);
      await userAPI.create(formData);
      setShowAddModal(false);
      showAlert('Success', 'User created successfully!', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      const errorMsg = error.response?.data?.error || 'Failed to create user';
      showAlert('Error', errorMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setActionLoading(true);
      await userAPI.update(selectedUser.id, formData);
      setShowEditModal(false);
      showAlert('Success', 'User updated successfully!', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      const errorMsg = error.response?.data?.error || 'Failed to update user';
      showAlert('Error', errorMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await userAPI.delete(selectedUser.id);
      setShowDeleteModal(false);
      showAlert('Success', 'User deleted successfully!', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      const errorMsg = error.response?.data?.error || 'Failed to delete user';
      showAlert('Error', errorMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const viewFields = [
    { name: 'id', label: 'User ID', icon: 'key-outline' },
    { name: 'username', label: 'Username', icon: 'person-outline' },
    { name: 'email', label: 'Email', icon: 'mail-outline' },
    { name: 'role', label: 'Role', icon: 'shield-outline', type: 'badge', badgeColor: ROLE_COLORS[selectedUser?.role] },
    { name: 'status', label: 'Status', icon: 'toggle-outline', type: 'badge', badgeColor: STATUS_COLORS[selectedUser?.status] },
    { name: 'created_at', label: 'Created At', icon: 'calendar-outline', type: 'date' },
    { name: 'updated_at', label: 'Updated At', icon: 'time-outline', type: 'date' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Heading2>User Management</Heading2>
          <SmallText color={COLORS.textSecondary}>
            Manage admin, staff, and customer accounts
          </SmallText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={fetchUsers}
            style={styles.refreshButton}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          <Button
            title="Add User"
            onPress={() => setShowAddModal(true)}
            leftIcon={<Ionicons name="add-circle-outline" size={18} color="#fff" />}
            size="small"
          />
        </View>
      </View>

      {/* User Table */}
      <UserTable
        users={users}
        loading={loading}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Add Modal */}
      <AddFormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        title="Add New User"
        fields={USER_FORM_FIELDS.ADD}
        loading={actionLoading}
      />

      {/* Edit Modal */}
      {selectedUser && (
        <EditFormModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
          title="Edit User"
          fields={USER_FORM_FIELDS.EDIT}
          initialData={selectedUser}
          loading={actionLoading}
        />
      )}

      {/* View Modal */}
      {selectedUser && (
        <ViewFormModal
          visible={showViewModal}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            openEditModal(selectedUser);
          }}
          onDelete={() => {
            setShowViewModal(false);
            openDeleteModal(selectedUser);
          }}
          title="User Details"
          fields={viewFields}
          data={selectedUser}
        />
      )}

      {/* Delete Modal */}
      {selectedUser && (
        <DeleteFormModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete User"
          itemName={selectedUser.username}
          itemType="user"
          message="Are you sure you want to delete this user? This will permanently remove their account and all associated data."
          requireConfirmation={true}
          loading={actionLoading}
          warnings={[
            'All user data will be permanently deleted',
            'This action cannot be undone',
            selectedUser.role === 'admin' && 'You are deleting an admin account',
          ].filter(Boolean)}
          details={{
            'Email': selectedUser.email,
            'Role': ROLE_LABELS[selectedUser.role],
            'Status': STATUS_LABELS[selectedUser.status],
          }}
        />
      )}

      {/* Alert Modal */}
      <AlertModal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        variant={alertMessage.variant}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  refreshButton: {
    padding: SPACING.sm,
  },
});

export default UserManagement;
