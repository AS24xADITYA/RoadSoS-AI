import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber, otp) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        phone_number: phoneNumber,
        otp: otp
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.response?.data?.detail || 'Login failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getProfile = async () => {
    if (!user) return null;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${user.user_id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile', error);
      return null;
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return null;
    try {
      const response = await axios.put(`${API_BASE_URL}/api/profile/${user.user_id}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Update failed';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
