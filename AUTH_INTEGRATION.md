# Authentication Integration

## Overview

The application now supports two authentication approaches:

1. **AuthManager** (Primary) - A comprehensive authentication manager with session management
2. **AuthService** (Fallback) - A service-based approach for API calls

## AuthManager Features

### ✅ **Session Management**

- Automatic token validation on app startup
- Persistent login sessions
- Automatic logout on token expiration

### ✅ **User State Management**

- Global user state accessible via `window.app.authManager.currentUser`
- Automatic UI updates based on authentication state
- Navigation state management

### ✅ **Security**

- Token-based authentication
- Automatic header injection for API calls
- Secure logout with cleanup

### ✅ **Integration**

- Works with existing services (ProductsService, StoresService)
- Compatible with router navigation
- Supports both login and registration flows

## Usage

### Initialization

The AuthManager is automatically initialized in `src/main.js`:

```javascript
// Available globally
window.app.authManager;
window.app.router;
```

### Login Flow

```javascript
// In login.js
const result = await window.app.authManager.login(email, password);
if (result.success) {
  // User is automatically logged in and redirected
}
```

### Registration Flow

```javascript
// In register.js
const result = await window.app.authManager.register(storeData);
if (result.success) {
  // User is automatically logged in and redirected
}
```

### Logout

```javascript
// Anywhere in the app
window.app.authManager.logout();
// Automatically redirects to home and cleans up
```

### Check Authentication

```javascript
if (window.app.authManager.isAuthenticated()) {
  // User is logged in
}
```

### Get Current User

```javascript
const user = window.app.authManager.currentUser;
// Access user properties: user.nit_store, user.store_name, etc.
```

## API Integration

### Services Compatibility

All services automatically use the AuthManager's authentication:

```javascript
// ProductsService and StoresService automatically include auth headers
const productsService = new ProductsService();
const storesService = new StoresService();
```

### Manual API Calls

```javascript
// Get authenticated headers
const headers = window.app.authManager.getAuthHeaders();

// Make API call
const response = await fetch(url, {
  headers: headers,
});
```

## Configuration

### Environment Variables

```bash
VITE_API_URL=http://localhost:3000/api
```

### API Endpoints

All endpoints are configured in `src/config/api.js` and support both naming conventions:

- `API_CONFIG.endpoints.*` (for services)
- `API_CONFIG.ENDPOINTS.*` (for AuthManager)

## Fallback Support

If AuthManager is not available, the application falls back to AuthService:

```javascript
// Automatic fallback in login/register
if (window.app && window.app.authManager) {
  result = await window.app.authManager.login(email, password);
} else {
  result = await this.authService.loginStore(email, password);
}
```

## Benefits

1. **Centralized Authentication** - Single source of truth for auth state
2. **Automatic Session Management** - No manual token handling needed
3. **UI Integration** - Automatic navigation updates
4. **Security** - Proper token validation and cleanup
5. **Flexibility** - Works with existing services and new features
6. **Maintainability** - Clean separation of concerns

## Migration Notes

- ✅ All existing functionality preserved
- ✅ Backward compatibility maintained
- ✅ No breaking changes to existing code
- ✅ Enhanced security and user experience
