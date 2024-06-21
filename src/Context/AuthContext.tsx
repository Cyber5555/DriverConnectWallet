import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authUserInfoRequest} from '../Screens/Home/authUserInfoSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../store/store';
import {Image, StyleSheet, View, useWindowDimensions} from 'react-native';
import Colors from '../Includes/Colors';
import LoaderKit from 'react-native-loader-kit';

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
  user_id?: string;
}

interface AuthContextType {
  authUser: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasTokenNotAuth: boolean;
  notCar: boolean;
  loadUserData: (bool: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasTokenNotAuth, setHasTokenNotAuth] = useState<boolean>(false);
  const [notCar, setNotCar] = useState<boolean>(false);
  const {width} = useWindowDimensions();

  const login = useCallback(
    async (userData: User) => {
      try {
        const updateAuthData: User = {...authUser, ...userData};
        if (JSON.stringify(updateAuthData) !== JSON.stringify(authUser)) {
          await AsyncStorage.setItem(
            'authUser',
            JSON.stringify(updateAuthData),
          );
          setAuthUser(updateAuthData);
        } else {
          console.log('No changes detected, skipping update.');
        }
      } catch (error) {
        console.error('Error adding register data:', error);
      }
    },
    [authUser],
  );

  const loadUserData = useCallback(
    async (load: boolean) => {
      if (load) {
        setIsLoading(true);
      }

      const authData = await AsyncStorage.getItem('authUser');
      if (authData) {
        const userData: User = JSON.parse(authData);
        setAuthUser(userData);
        dispatch(authUserInfoRequest({token: userData.token}))
          .then(async (result: {payload: any}) => {
            const {user, status, message} = result.payload;

            if (status) {
              const authUserRequestData: User = {
                ...userData,
                add_car_status: user?.add_car_status,
                create_account_status: user?.create_account_status,
                token: userData.token,
                user_id: user.id,
              };
              await AsyncStorage.setItem(
                'authUser',
                JSON.stringify(authUserRequestData),
              );
              setIsAuthenticated(authentication(authUserRequestData));
              setHasTokenNotAuth(hasTokenNotAuthenticated(authUserRequestData));
              setNotCar(registeredButNotCar(authUserRequestData));
            } else if (message === 'Unauthenticated.') {
              await AsyncStorage.removeItem('authUser');
              setAuthUser(null);
              setIsAuthenticated(false);
              setHasTokenNotAuth(false);
              setNotCar(false);
            }
          })
          .catch(async error => {
            await AsyncStorage.removeItem('authUser');
            setAuthUser(null);
            setIsAuthenticated(false);
            setHasTokenNotAuth(false);
            setNotCar(false);

            console.log('Error dispatching authUserInfoRequest:', error);
          });
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authUser');
      setAuthUser(null);
      setIsAuthenticated(false);
      setHasTokenNotAuth(false);
      setNotCar(false);
      loadUserData(true);
    } catch (error) {
      console.error('Error clearing authUser data:', error);
    }
  }, [loadUserData]);

  useEffect(() => {
    loadUserData(true);
  }, [dispatch, loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        isLoading,
        logout,
        isAuthenticated,
        hasTokenNotAuth,
        notCar,
        loadUserData,
      }}>
      {isLoading ? (
        <View style={styles.loader}>
          <Image
            source={require('../Assets/images/logo.png')}
            style={[styles.logo, {width: width * 0.6, height: width * 0.7}]}
          />
          <LoaderKit
            style={styles.load}
            name={'BallSpinFadeLoader'}
            color={Colors.dark}
          />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => React.useContext(AuthContext);

export const useAuthHandler = () => {
  const {loadUserData, logout} = useAuth();

  const handleUnauthenticated = useCallback(() => {
    logout();
    loadUserData(true);
  }, [logout, loadUserData]);

  return {handleUnauthenticated};
};

const authentication = (authUser: User | null): boolean => {
  if (!authUser) {
    return false;
  }

  const hasAccount = authUser.create_account_status === '1';
  const isDriver = authUser.job_category_id === '3';
  const hasCar = authUser.add_car_status === '1';

  return (hasAccount && isDriver) || (hasAccount && hasCar);
};

const hasTokenNotAuthenticated = (authUser: User | null): boolean => {
  if (!authUser) {
    return false;
  }

  const hasAccount = authUser.token !== null;
  const isDriver = authUser.create_account_status !== '1';
  const hasCar = authUser.add_car_status !== '1';

  return hasAccount && isDriver && hasCar;
};

const registeredButNotCar = (authUser: User | null): boolean => {
  if (!authUser) {
    return false;
  }

  const hasAccount = authUser.token !== null;
  const isDriver = authUser.create_account_status === '1';
  const hasCar = authUser.add_car_status !== '1';

  return hasAccount && isDriver && hasCar;
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logo: {
    aspectRatio: 3,
    marginTop: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  load: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 30,
  },
});
