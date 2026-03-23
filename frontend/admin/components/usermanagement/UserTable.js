import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../login/Card';
import { BodyText, SmallText, Caption } from '../dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING, BORDER_RADIUS } from '../../constants/dashboard/theme';
import { ROLE_LABELS, ROLE_COLORS, STATUS_LABELS, STATUS_COLORS } from '../../constants/usermanagement';

const UserTable = ({ users = [], onView, onEdit, onDelete, loading = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderBadge = (text, color) => (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Caption color={color} style={styles.badgeText}>{text}</Caption>
    </View>
  );

  if (loading) {
    return (
      <Card shadow padding="lg">
        <BodyText style={styles.emptyText}>Loading users...</BodyText>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card shadow padding="lg">
        <BodyText style={styles.emptyText}>No users found</BodyText>
      </Card>
    );
  }

  return (
    <Card shadow padding="none">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.cell, styles.idCell]}>
              <SmallText style={styles.headerText}>ID</SmallText>
            </View>
            <View style={[styles.cell, styles.usernameCell]}>
              <SmallText style={styles.headerText}>Username</SmallText>
            </View>
            <View style={[styles.cell, styles.emailCell]}>
              <SmallText style={styles.headerText}>Email</SmallText>
            </View>
            <View style={[styles.cell, styles.roleCell]}>
              <SmallText style={styles.headerText}>Role</SmallText>
            </View>
            <View style={[styles.cell, styles.statusCell]}>
              <SmallText style={styles.headerText}>Status</SmallText>
            </View>
            <View style={[styles.cell, styles.dateCell]}>
              <SmallText style={styles.headerText}>Created</SmallText>
            </View>
            <View style={[styles.cell, styles.actionsCell]}>
              <SmallText style={styles.headerText}>Actions</SmallText>
            </View>
          </View>

          {/* Rows */}
          {users.map((user, index) => (
            <View 
              key={user.id} 
              style={[
                styles.row, 
                index % 2 === 0 && styles.evenRow
              ]}
            >
              <View style={[styles.cell, styles.idCell]}>
                <SmallText>{user.id}</SmallText>
              </View>
              <View style={[styles.cell, styles.usernameCell]}>
                <BodyText>{user.username}</BodyText>
              </View>
              <View style={[styles.cell, styles.emailCell]}>
                <SmallText>{user.email}</SmallText>
              </View>
              <View style={[styles.cell, styles.roleCell]}>
                {renderBadge(ROLE_LABELS[user.role], ROLE_COLORS[user.role])}
              </View>
              <View style={[styles.cell, styles.statusCell]}>
                {renderBadge(STATUS_LABELS[user.status], STATUS_COLORS[user.status])}
              </View>
              <View style={[styles.cell, styles.dateCell]}>
                <SmallText>{formatDate(user.created_at)}</SmallText>
              </View>
              <View style={[styles.cell, styles.actionsCell]}>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    onPress={() => onView(user)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onEdit(user)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="create-outline" size={18} color={COLORS.warning} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onDelete(user)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  table: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  evenRow: {
    backgroundColor: COLORS.backgroundSecondary + '50',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  idCell: { width: 60 },
  usernameCell: { width: 150 },
  emailCell: { width: 220 },
  roleCell: { width: 100 },
  statusCell: { width: 100 },
  dateCell: { width: 120 },
  actionsCell: { width: 120 },
  headerText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
});

export default UserTable;
