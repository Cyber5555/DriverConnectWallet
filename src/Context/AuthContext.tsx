import React, {createContext, useState, useEffect} from 'react';
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
}

interface AuthContextType {
  token: User | null;
  registerData: User | null;
  isLoading: boolean;
  login: (userToken: User) => void;
  logout: () => void;
  addRegisterData: (registerValue: User) => void;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [token, setToken] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registerData, setRegisterData] = useState<User | null>({
    birth_date: null,
    country_id: '',
    job_category_id: '',
    person_full_name_first_name: '',
    person_full_name_last_name: '',
    person_full_name_middle_name: '',
    scanning_person_full_name_last_name: '',
    region_id: '',
    driver_license_front_photo: '',
    driver_license_back_photo: '',
    car_license_back_photo: '',
    car_license_front_photo: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [userToken, userData] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('registerData'),
        ]);
        if (userToken) {
          setToken(JSON.parse(userToken));
        }
        if (userData) {
          setRegisterData(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = (userToken: User) => {
    AsyncStorage.setItem('userToken', JSON.stringify(userToken));
    setToken(userToken);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('registerData');
      setToken(null);
      setRegisterData(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const addRegisterData = async (registerValue: User) => {
    try {
      const updatedRegisterData = {...registerData, ...registerValue};
      await AsyncStorage.setItem(
        'registerData',
        JSON.stringify(updatedRegisterData),
      );
      setRegisterData(updatedRegisterData);
    } catch (error) {
      console.error('Error adding register data:', error);
    }
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
