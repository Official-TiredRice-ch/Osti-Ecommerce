# Authentication Components

## ProtectedRoute

Wrapper component that protects routes from unauthorized access.

### Features
- Checks if user is logged in
- Validates user role (admin/staff only)
- Validates account status (active only)
- Shows loading spinner during auth check
- Automatically redirects to login if unauthorized
- Clears invalid user data from storage

### Usage

```jsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      {/* Your protected content here */}
    </ProtectedRoute>
  );
}
```

### How it works

1. Component mounts and checks AsyncStorage for user data
2. If no user data found → redirect to login
3. If user data found:
   - Validates role (must be 'admin' or 'staff')
   - Validates status (must be 'active')
   - If invalid → clear storage and redirect to login
   - If valid → render children
4. Shows loading spinner during validation

### Security

- User data is stored in AsyncStorage after successful login
- Data includes: id, username, email, role, status
- Protected routes check this data on every mount
- Invalid or missing data triggers automatic logout
- No way to bypass without valid credentials

## useAuth Hook

Custom hook for managing authentication state across the app.

### Usage

```jsx
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, isLoading, isAuthenticated, logout, refreshAuth } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Login />;
  
  return (
    <View>
      <Text>Welcome, {user.username}!</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
}
```

### Returns

- `user` - Current user object or null
- `isLoading` - Boolean indicating auth check in progress
- `isAuthenticated` - Boolean indicating if user is authenticated
- `logout` - Function to logout and clear storage
- `refreshAuth` - Function to re-check authentication status
