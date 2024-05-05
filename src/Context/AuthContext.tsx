import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {authUserInfoRequest} from '../Screens/Home/authUserInfoSlice';
import {AppDispatch} from '../store/store';

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
  const dispatch = useDispatch<AppDispatch>();
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

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setAuthUser(null);
    } catch (error) {
      console.error('Error clearing authUser data:', error);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    await AsyncStorage.getItem('authUser')
      .then(data => {
        if (data === null) {
          logout();
        } else {
          dispatch(authUserInfoRequest({authUser: JSON.parse(data)})).then(
            (result: {payload: any}) => {
              const {user, status, message} = result.payload;
              if (status) {
                const authUserRequestData: User = {
                  add_car_status: user.add_car_status,
                  create_account_status: user.create_account_status,
                };

                const updatedUserData = {...authUser, ...authUserRequestData};

                console.log('Updated UserData:', updatedUserData);

                AsyncStorage.setItem(
                  'authUser',
                  JSON.stringify(updatedUserData),
                )
                  .then(() => {
                    setAuthUser(updatedUserData);
                  })
                  .catch(error => {
                    console.error(
                      'Error saving authUser data to AsyncStorage:',
                      error,
                    );
                  });
              } else if (message === 'Unauthenticated.') {
                logout();
              }
            },
          );

          console.log('After dispatch - AuthUser:', authUser);
        }
      })
      .catch(err => {
        console.error('Error loading authUser data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
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
