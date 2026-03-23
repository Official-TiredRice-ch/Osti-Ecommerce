import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Heading3, BodyText, SmallText } from './Typography';
import { ConfirmModal } from '../modals';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING, BORDER_RADIUS } from '../../constants/dashboard/theme';

const SidebarItem = ({ icon, label, active, onPress, badge }) => (
  <TouchableOpacity
    style={[styles.item, active && styles.itemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.itemContent}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={active ? COLORS.sidebarTextActive : COLORS.sidebarText} 
      />
      <BodyText 
        color={active ? COLORS.sidebarTextActive : COLORS.sidebarText}
        style={styles.itemLabel}
      >
        {label}
      </BodyText>
    </View>
    {badge && (
      <View style={styles.badge}>
        <SmallText color="#fff" style={styles.badgeText}>{badge}</SmallText>
      </View>
    )}
  </TouchableOpacity>
);

const Sidebar = ({ activeRoute = 'overview', onNavigate }) => {
  const router = useRouter();
  const [active, setActive] = useState(activeRoute);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: 'overview', icon: 'grid-outline', label: 'Overview' },
    { id: 'products', icon: 'cube-outline', label: 'Products', badge: '24' },
    { id: 'categories', icon: 'list-outline', label: 'Categories' },
    { id: 'users', icon: 'people-outline', label: 'Users' },
    { id: 'orders', icon: 'cart-outline', label: 'Orders', badge: '5' },
    { id: 'analytics', icon: 'bar-chart-outline', label: 'Analytics' },
    { id: 'settings', icon: 'settings-outline', label: 'Settings' },
  ];

  const handleMenuClick = (itemId) => {
    setActive(itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Clear stored user data
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('User logged out');
      
      // Navigate to login
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name="storefront" size={28} color={COLORS.primary} />
        <Heading3 color={COLORS.sidebarTextActive} style={styles.logoText}>
          Admin
        </Heading3>
      </View>

      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        <SmallText color={COLORS.textLight} style={styles.menuTitle}>
          MAIN MENU
        </SmallText>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={active === item.id}
            onPress={() => handleMenuClick(item.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <BodyText color={COLORS.error} style={styles.logoutText}>
            Logout
          </BodyText>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access the dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        loading={isLoggingOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sidebar,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sidebarActive,
  },
  logoText: {
    marginLeft: SPACING.xs,
  },
  menu: {
    flex: 1,
    padding: SPACING.md,
  },
  menuTitle: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  itemActive: {
    backgroundColor: COLORS.sidebarActive,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  itemLabel: {
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.sidebarActive,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  logoutText: {
    fontWeight: '500',
  },
});

export default Sidebar;
