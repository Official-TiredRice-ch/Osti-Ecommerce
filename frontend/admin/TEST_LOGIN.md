# Testing Login

## Prerequisites

1. **Backend must be running**
   ```bash
   cd backend
   npm start
   ```
   Should show: `Server running on port 24365`

2. **Create admin user** (if not already created)
   ```bash
   cd backend
   node create-admin.js
   ```

3. **Frontend must be running**
   ```bash
   cd frontend/admin
   npm start
   ```

## Test Credentials

**Admin Account:**
- Email: `admin@osti.com`
- Password: `admin123`
- Role: admin
- Status: active

## Testing Steps

1. Open the admin app (should show login page)
2. Enter the test credentials above
3. Click "Sign In"
4. Should see loading spinner
5. Should navigate to dashboard automatically

## Troubleshooting

### "Cannot connect to server"
- Check if backend is running on port 24365
- Verify IP address in `frontend/admin/utils/api.js` matches your machine
- Current IP: `192.168.1.4`
- Try accessing: `http://192.168.1.4:24365/health` in browser

### "Invalid credentials"
- Make sure admin user was created (run create-admin.js)
- Check email/password are correct
- Email is case-insensitive

### "Access denied"
- User must have role 'admin' or 'staff'
- User status must be 'active'

### "Dashboard redirects to login"
- Check browser console for errors
- Verify AsyncStorage is working
- Try clearing app data and logging in again

## API Endpoints

Test these in browser or Postman:

- Health check: `http://192.168.1.4:24365/health`
- Discovery: `http://192.168.1.4:24365/api/discovery`
- Login: `POST http://192.168.1.4:24365/api/users/login`
  ```json
  {
    "email": "admin@osti.com",
    "password": "admin123"
  }
  ```

## Network Configuration

Current API URL: `http://192.168.1.4:24365/api`

If your IP changes, update it in:
- `frontend/admin/utils/api.js` (line 5)

To find your IP:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`
