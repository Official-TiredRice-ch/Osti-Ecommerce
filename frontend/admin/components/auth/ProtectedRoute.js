import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DASHBOARD_COLORS as COLORS } from '../../constants/dashboard/theme';

/**
 * ProtectedRoute - Wrapper component to protect routes from unauthorized access
 * Checks if user is logged in and has proper role (admin/staff)
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      
      if (!userJson) {
        // No user data, redirect to login
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/');
        return;
      }

      const user = JSON.parse(userJson);
      
      // Check if user has admin or staff role
      if (user.role !== 'admin' && user.role !== 'staff') {
        console.log('Access denied: Invalid role');
        await AsyncStorage.removeItem('user');
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/');
        return;
      }

      // Check if account is active
      if (user.status !== 'active') {
        console.log('Access denied: Account disabled');
        await AsyncStorage.removeItem('user');
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/');
        return;
      }

      // User is authenticated
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      router.replace('/');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return children;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
