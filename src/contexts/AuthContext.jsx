import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, verifyUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const userData = JSON.parse(stored);
          const result = await verifyUser(userData.id);
          if (result.success) {
            const updatedUser = {
              id: result.user.id,
              username: result.user.username,
              fullname: result.user.fullname,
              role: result.user.role,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          } else {
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch {
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password, rememberMe = false) => {
    try {
      setLoading(true);
      const result = await loginUser(username, password);
      if (!result.success) return { success: false, error: result.error };

      const userData = {
        id: result.user.id,
        username: result.user.username,
        fullname: result.user.fullname,
        role: result.user.role,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const checkPermission = (requiredRole) => {
    if (!user) return false;
    if (user.role === 'dev') return true;
    if (requiredRole === 'admin' && user.role === 'admin') return true;
    if (requiredRole === 'admin' && user.role === 'user') return false;
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
