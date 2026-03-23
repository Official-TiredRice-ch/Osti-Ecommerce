import React from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { DASHBOARD_COLORS as COLORS, DASHBOARD_SPACING as SPACING } from '../../constants/dashboard/theme';

const DashboardLayout = ({ 
  header, 
  sidebar, 
  children,
  scrollable = true 
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;
  
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {/* Sidebar Slot */}
        {sidebar && (
          <View style={styles.sidebar}>
            {sidebar}
          </View>
        )}
        
        {/* Content Area with Header */}
        <View style={styles.contentArea}>
          {/* Header Slot */}
          {header && (
            <View style={styles.header}>
              {header}
            </View>
          )}
          
          {/* Main Content Slot */}
          <ContentWrapper 
            style={styles.content}
            contentContainerStyle={scrollable && styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ContentWrapper>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.contentBg,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SPACING.sidebarWidth,
    backgroundColor: COLORS.sidebar,
    ...Platform.select({
      web: {
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  contentArea: {
    flex: 1,
    backgroundColor: COLORS.contentBg,
  },
  header: {
    height: SPACING.headerHeight,
    backgroundColor: COLORS.headerBg,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
    zIndex: 10,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.contentBg,
  },
  contentContainer: {
    padding: SPACING.contentPadding,
  },
});

export default DashboardLayout;
