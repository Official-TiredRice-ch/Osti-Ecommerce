import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/login/Card';
import { UserManagement } from '../components/usermanagement';
import { Heading2, BodyText, SmallText } from '../components/dashboard/Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../constants/dashboard/theme';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('overview'); // 'overview' or 'users'

  return (
    <ProtectedRoute>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <DashboardLayout
        header={
          <Header 
            title={activeView === 'overview' ? 'Dashboard' : 'User Management'} 
            subtitle={activeView === 'overview' ? 'Welcome back, Admin' : 'Manage system users'}
          />
        }
        sidebar={<Sidebar activeRoute={activeView} onNavigate={setActiveView} />}
      >
        {activeView === 'overview' ? (
          <>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Products"
                value="1,234"
                icon="cube-outline"
                trend="up"
                trendValue="+12%"
                iconBg={COLORS.primary}
              />
              <StatCard
                title="Total Users"
                value="5,678"
                icon="people-outline"
                trend="up"
                trendValue="+8%"
                iconBg={COLORS.secondary}
              />
              <StatCard
                title="Orders Today"
                value="89"
                icon="cart-outline"
                trend="down"
                trendValue="-3%"
                iconBg={COLORS.warning}
              />
              <StatCard
                title="Revenue"
                value="$12,345"
                icon="trending-up-outline"
                trend="up"
                trendValue="+23%"
                gradient
              />
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Heading2 style={styles.sectionTitle}>Recent Activity</Heading2>
              <Card shadow padding="lg">
                <View style={styles.activityItem}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityContent}>
                    <BodyText>New order received</BodyText>
                    <SmallText>Order #12345 - $234.50</SmallText>
                  </View>
                  <SmallText>2m ago</SmallText>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: COLORS.secondary }]} />
                  <View style={styles.activityContent}>
                    <BodyText>New user registered</BodyText>
                    <SmallText>user@example.com</SmallText>
                  </View>
                  <SmallText>15m ago</SmallText>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: COLORS.success }]} />
                  <View style={styles.activityContent}>
                    <BodyText>Product updated</BodyText>
                    <SmallText>Wireless Headphones</SmallText>
                  </View>
                  <SmallText>1h ago</SmallText>
                </View>
              </Card>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Heading2 style={styles.sectionTitle}>Quick Actions</Heading2>
              <View style={styles.actionsGrid}>
                <TouchableOpacity onPress={() => setActiveView('users')}>
                  <Card shadow padding="lg" style={styles.actionCard}>
                    <BodyText style={styles.actionText}>Manage Users</BodyText>
                  </Card>
                </TouchableOpacity>
                <Card shadow padding="lg" style={styles.actionCard}>
                  <BodyText style={styles.actionText}>Add Product</BodyText>
                </Card>
                <Card shadow padding="lg" style={styles.actionCard}>
                  <BodyText style={styles.actionText}>View Orders</BodyText>
                </Card>
              </View>
            </View>
          </>
        ) : (
          <UserManagement />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionText: {
    fontWeight: '600',
  },
});
