import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored auth on app load
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load auth info from storage:', e);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (foundUser) {
        // Remove password before storing
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (e) {
      setError('Login failed. Please try again.');
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const userExists = mockUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        setError('Email already in use');
        return false;
      }

      // For demonstration, we'll "pretend" to register
      // In a real app, you'd make an API call here
      const newUser = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        avatar: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? 'men' : 'women'
        }/${Math.floor(Math.random() * 60) + 1}.jpg`,
      };

      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (e) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
