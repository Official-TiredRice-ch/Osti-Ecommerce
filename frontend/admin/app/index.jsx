import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/login/Input";
import Button from "../components/login/Button";
import Card from "../components/login/Card";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from "../constants/login/theme";

const { width, height } = Dimensions.get("window");

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Login successful", { email, password });
      // Navigate to dashboard or handle successful login
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
    // Navigate to forgot password screen
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={COLORS.gradient.primary}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Image 
                  source={require("../assets/images/bombom.png")} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>Osti Admin</Text>
              <Text style={styles.tagline}>Manage your e-commerce App</Text>
            </View>

            {/* Login Card */}
            <View style={styles.cardContainer}>
              <Card padding="lg" style={styles.loginCard}>
                <View style={styles.header}>
                  <Text style={styles.title}>Welcome Back, Admin!</Text>
                  <Text style={styles.subtitle}>Sign in to continue to your dashboard</Text>
                </View>

                {errors.general && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                    <Text style={styles.errorText}>{errors.general}</Text>
                  </View>
                )}

                <Input
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textLight} />}
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  error={errors.password}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />}
                  rightIcon={
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={COLORS.textLight} 
                      />
                    </TouchableOpacity>
                  }
                />

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  size="medium"
                  style={styles.loginButton}
                />

                <View style={styles.footer}>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Forgot your password?</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    minHeight: '100vh',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    minHeight: '100vh',
    paddingBottom: Platform.OS === 'web' ? SPACING.xl : SPACING.xxxl,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  logoImage: {  
    width: 400,
    height: 400,
    borderRadius: BORDER_RADIUS.full,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  tagline: {
    ...TYPOGRAPHY.body2,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  cardContainer: {
    marginBottom: SPACING.xl,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: Platform.OS === 'web' ? 
      '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)' : 
      undefined,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  loginButton: {
    marginTop: SPACING.md,
    boxShadow: Platform.OS === 'web' ? '0 4px 14px rgba(99, 102, 241, 0.4)' : undefined,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  forgotPassword: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
});