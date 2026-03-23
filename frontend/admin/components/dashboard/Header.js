import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Heading3, SmallText } from './Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING } from '../../constants/dashboard/theme';

const Header = ({ title, subtitle, rightActions }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Heading3>{title}</Heading3>
        {subtitle && <SmallText style={styles.subtitle}>{subtitle}</SmallText>}
      </View>
      
      <View style={styles.rightSection}>
        {rightActions || (
          <>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color={COLORS.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DASHBOARD_SPACING.lg,
  },
  leftSection: {
    flex: 1,
  },
  subtitle: {
    marginTop: DASHBOARD_SPACING.xs,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DASHBOARD_SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  profileButton: {
    marginLeft: DASHBOARD_SPACING.sm,
  },
});

export default Header;
