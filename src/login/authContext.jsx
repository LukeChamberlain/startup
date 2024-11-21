import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [email, setEmail] = useState('');

  const login = (email, token) => {
    setEmail(email);
    setAuthState('authenticated');
    localStorage.setItem('token', token); // Optional: store token in localStorage
  };

  const logout = () => {
    setEmail('');
    setAuthState('unauthenticated');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authState, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
