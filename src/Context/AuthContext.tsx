import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  token?: string | null;
  birth_date?: Date | null;
  country_id?: string;
  job_category_id?: string;
  person_full_name_first_name?: string;
  person_full_name_last_name?: string;
  person_full_name_middle_name?: string;
  scanning_person_full_name_last_name?: string;
  region_id?: string;
  driver_license_front_photo?: string;
  driver_license_back_photo?: string;
  car_license_back_photo?: string;
  car_license_front_photo?: string;
  create_account_status?: string;
  add_car_status?: string;
}

interface AuthContextType {
  authUser: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(
    async (userData: User) => {
      try {
        const updatedUserData = {...authUser, ...userData};

        await AsyncStorage.setItem('authUser', JSON.stringify(updatedUserData));
        setAuthUser(updatedUserData);
      } catch (error) {
        console.error('Error adding register data:', error);
      }
    },
    [authUser],
  );

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setAuthUser(null);
    } catch (error) {
      console.error('Error clearing authUser data:', error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authUser');
        if (token) {
          const userData: User = JSON.parse(token);
          setAuthUser(userData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        isLoading,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => React.useContext(AuthContext);
