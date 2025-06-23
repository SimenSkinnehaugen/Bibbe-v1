// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setAuthToken(token);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    localStorage.setItem('token', response.token);
    api.setAuthToken(response.token);
    setUser(response.user);
    return response;
  };

  const register = async (email, password, companyName) => {
    const response = await api.register(email, password, companyName);
    localStorage.setItem('token', response.token);
    api.setAuthToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
