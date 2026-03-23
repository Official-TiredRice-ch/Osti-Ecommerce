import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../login/Card';
import { Heading2, SmallText, Caption } from './Typography';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING, BORDER_RADIUS } from '../../constants/dashboard/theme';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  gradient = false,
  iconBg = COLORS.primary 
}) => {
  const CardWrapper = gradient ? LinearGradient : View;
  const cardProps = gradient 
    ? { colors: COLORS.gradient.primary, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
    : { style: { backgroundColor: COLORS.background } };

  return (
    <Card shadow padding="lg" style={styles.card}>
      <CardWrapper {...cardProps} style={styles.cardContent}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : iconBg + '20' }]}>
            <Ionicons 
              name={icon} 
              size={24} 
              color={gradient ? '#fff' : iconBg} 
            />
          </View>
          {trend && (
            <View style={[styles.trend, trend === 'up' ? styles.trendUp : styles.trendDown]}>
              <Ionicons 
                name={trend === 'up' ? 'trending-up' : 'trending-down'} 
                size={14} 
                color={trend === 'up' ? COLORS.success : COLORS.error} 
              />
              <Caption color={trend === 'up' ? COLORS.success : COLORS.error}>
                {trendValue}
              </Caption>
            </View>
          )}
        </View>
        
        <Heading2 color={gradient ? '#fff' : COLORS.text} style={styles.value}>
          {value}
        </Heading2>
        <SmallText color={gradient ? 'rgba(255,255,255,0.9)' : COLORS.textSecondary}>
          {title}
        </SmallText>
      </CardWrapper>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 200,
  },
  cardContent: {
    borderRadius: BORDER_RADIUS.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  trendUp: {
    backgroundColor: COLORS.success + '20',
  },
  trendDown: {
    backgroundColor: COLORS.error + '20',
  },
  value: {
    marginBottom: SPACING.xs,
  },
});

export default StatCard;
