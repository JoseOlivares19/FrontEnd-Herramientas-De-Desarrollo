import { useState, useEffect, useCallback } from 'react';
import {
  getAuthToken,
  getCurrentUser,
  logoutUser,
  TOKEN_STORAGE_KEY,
} from './authService';

/**
 * Custom Hook para gestionar y sincronizar el estado de autenticación reactivamente con LocalStorage.
 * @returns {{
 *   token: string|null,
 *   user: Object|null,
 *   isAuth: boolean,
 *   checkAuth: () => boolean,
 *   logout: (callback?: () => void) => void
 * }}
 */
export function useAuth() {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => getCurrentUser());

  const checkAuth = useCallback(() => {
    const currentToken = getAuthToken();
    const currentUser = getCurrentUser();
    setToken(currentToken);
    setUser(currentUser);
    return Boolean(currentToken);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      // Sincronizar si cambia la clave de token o si es un evento local
      if (!e.key || e.key === TOKEN_STORAGE_KEY) {
        checkAuth();
      }
    };

    const handleAuthEvent = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleAuthEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleAuthEvent);
    };
  }, [checkAuth]);

  const logout = useCallback((callback) => {
    logoutUser(callback);
    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    isAuth: Boolean(token),
    checkAuth,
    logout,
  };
}

export default useAuth;
