import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  token?: string | null;
  registerData?: {} | null;
}

interface AuthContextType {
  token: User | null;
  registerData?: User | null;
  isLoading: boolean;
  login: (userToken: User) => void;
  logout: () => void;
  addRegisterData: (registerValue: User) => void;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({children}: any) => {
  const [token, setToken] = useState<User | null>(null);
  const [registerData, setRegisterData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check AsyncStorage for token data on app startup
    AsyncStorage.getItem('userToken').then(userToken => {
      if (userToken) {
        setToken(JSON.parse(userToken));
      }
      setIsLoading(false);
    });
    AsyncStorage.getItem('registerData').then(userData => {
      if (userData) {
        setRegisterData(JSON.parse(userData));
      }
      setIsLoading(false);
    });
  }, []);

  const login = (userToken: User) => {
    AsyncStorage.setItem('userToken', JSON.stringify(userToken));
    setToken(userToken);
  };

  const logout = () => {
    AsyncStorage.removeItem('userToken');
    setToken(null);
  };

  const addRegisterData = (registerValue: User) => {
    AsyncStorage.setItem('registerData', JSON.stringify(registerValue));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        registerData,
        addRegisterData,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => React.useContext(AuthContext);
