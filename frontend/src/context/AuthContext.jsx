import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('fixnear_token') : null;
  const initialToken = storedToken && storedToken !== 'null' && storedToken !== 'undefined' ? storedToken : null;
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('fixnear_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data && res.data.token) {
      localStorage.setItem('fixnear_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('fixnear_token');
    setToken(null);
    setUser(null);
  };

  // Quick Demo Login helper for college presentation
  const demoLogin = async (role = 'customer') => {
    const credentials =
      role === 'repairer'
        ? { email: 'repairer@fixnear.com', password: 'password123' }
        : { email: 'customer@fixnear.com', password: 'password123' };
    return await login(credentials.email, credentials.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'customer',
        isRepairer: user?.role === 'repairer',
        login,
        register,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
