import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

const localUser = {
  id: 'local',
  name: 'Local trader',
  role: 'owner',
};

/**
 * This copy runs as a personal app on one computer. There is no Base44 login.
 * A later shared build can replace this provider without changing the pages.
 */
export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{
    user: localUser,
    isAuthenticated: true,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: { id: 'local' },
    authChecked: true,
    logout: () => {},
    navigateToLogin: () => {},
    checkUserAuth: async () => {},
    checkAppState: async () => {},
  }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
