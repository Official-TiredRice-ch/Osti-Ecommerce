# Network Connection Fix for Built APK

## Problem
The built APK couldn't connect to the backend server even though it works in Expo Go.

## Root Cause
Android blocks HTTP (non-HTTPS) connections by default for security. The app.json had `"usesCleartextTraffic": false`.

## Solution Applied

### 1. Enable Cleartext Traffic
Changed in `app.json`:
```json
"usesCleartextTraffic": true
```

### 2. Network Security Config
Created `android-network-security-config.xml` to explicitly allow HTTP traffic to local network IPs:
- 192.168.1.30 (your backend)
- 192.168.0.0/24 (common home network)
- 192.168.1.0/24 (common home network)
- 10.0.0.0/8 (common private network)
- localhost

### 3. Reference Config in app.json
```json
"networkSecurityConfig": "./android-network-security-config.xml"
```

## Next Steps

### Build New APK
```bash
cd frontend/eco-app
eas build --platform android --profile preview
```

### Test Checklist
1. ✅ Backend server is running on 192.168.1.30:24365
2. ✅ Phone and PC are on the same WiFi network
3. ✅ Install the new APK
4. ✅ Open the app and check if it connects

### If Still Not Working

#### Option 1: Check Backend IP
Make sure your backend IP hasn't changed:
```bash
# On your PC, run:
ipconfig  # Windows
ifconfig  # Mac/Linux
```

If IP changed, update `frontend/eco-app/services/api.ts`:
```typescript
const MANUAL_BACKEND_IP: string | null = 'YOUR_NEW_IP';
```

#### Option 2: Test Backend Accessibility
From your phone's browser, try to access:
```
http://192.168.1.30:24365/health
```

If this doesn't work, the issue is network/firewall, not the app.

#### Option 3: Firewall Settings
Make sure Windows Firewall allows Node.js:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find Node.js and check both Private and Public networks

#### Option 4: Use Different Port
If port 24365 is blocked, change backend port in `backend/server.js`:
```javascript
const PORT = process.env.PORT || 8080; // Try 8080 or 3000
```

Then update `frontend/eco-app/services/api.ts`:
```typescript
const BACKEND_PORT = 8080; // Match backend port
```

## Version Tracking
- Version before fix: 1.0.3
- Version after fix: 1.0.4 (increment before building)

## Build Count
You have 13 builds left. This fix should work, so you'll have 12 builds remaining after testing.
