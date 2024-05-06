import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authUserInfoRequest} from '../Screens/Home/authUserInfoSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../store/store';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Colors from '../Includes/Colors';

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
  isAuthenticated: boolean;
  hasTokenNotAuth: boolean;
  notCar: boolean;
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
          console.log('📢 [AuthContext.tsx:49]', updateAuthData);
        } else {
          console.log('No changes detected, skipping update.');
        }
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
      setIsAuthenticated(false);
      setHasTokenNotAuth(false);
      setNotCar(false);
    } catch (error) {
      console.error('Error clearing authUser data:', error);
    }
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
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
              };
              // login(authUserRequestData);
              await AsyncStorage.setItem(
                'authUser',
                JSON.stringify(authUserRequestData),
              );
              setIsAuthenticated(authentication(authUserRequestData));
              setHasTokenNotAuth(hasTokenNotAuthenticated(authUserRequestData));
              setNotCar(registeredButNotCar(authUserRequestData));
            } else if (message === 'Unauthenticated.') {
              await AsyncStorage.clear();
              setAuthUser(null);
              setIsAuthenticated(false);
              setHasTokenNotAuth(false);
              setNotCar(false);
            }
          })
          .catch(error => {
            console.error('Error dispatching authUserInfoRequest:', error);
          });
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    loadUserData();
  }, [dispatch]);

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
      }}>
      {isLoading ? (
        <View style={styles.loader}>
          <Image
            source={require('../Assets/images/logo.png')}
            style={[styles.logo, {width: width * 0.6, height: width * 0.7}]}
          />
          <ActivityIndicator size={100} color={Colors.dark} />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => React.useContext(AuthContext);

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
});
