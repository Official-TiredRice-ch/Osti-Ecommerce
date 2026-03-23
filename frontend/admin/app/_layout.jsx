import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen 
        name="dashboard" 
        options={{
          title: 'Dashboard',
        }}
      />
    </Stack>
  );
}
