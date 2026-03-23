import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

/**
 * useAuth - Custom hook for authentication state management
 * 
 * @returns {object} - { user, isLoading, isAuthenticated, logout, refreshAuth }
 */
export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      
      if (!userJson) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(userJson);
      
      // Validate user data
      if (
        (userData.role === 'admin' || userData.role === 'staff') &&
        userData.status === 'active'
      ) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Invalid user data, clear storage
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshAuth,
  };
}
