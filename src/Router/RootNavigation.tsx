import React, {useEffect, useState} from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../store/store';
import {authUserInfoRequest} from '../Screens/Home/authUserInfoSlice';
import {useAuth} from '../Context/AuthContext';
import {User} from '../Context/AuthContext';
import {Login} from '../Screens/Auth/Login/Login';
import {LoginOTP} from '../Screens/Auth/LoginOTP/LoginOTP';
import {Register} from '../Screens/Auth/Register/Register';
import {ScannerHomeTechnical} from '../Screens/ScannerTechnicalPassport/ScannerHomeTechnical';
import {CameraScreenTechnical} from '../Screens/ScannerTechnicalPassport/CameraScreenTechnical';
import {DataAuto} from '../Screens/Data/DataAuto/DataAuto';
import {ScannerHomeDriver} from '../Screens/ScannerDriverLicense/ScannerHomeDriver';
import {CameraScreenDriver} from '../Screens/ScannerDriverLicense/CameraScreenDriver';
import {DataDriverLicense} from '../Screens/Data/DataDriverLicense/DataDriverLicense';
import {Home} from '../Screens/Home/Home';

const Stack = createNativeStackNavigator<RootNavigationProps>();

export type RootNavigationProps = {
  Login: undefined;
  LoginOTP: {
    code: string;
    unmaskedPhone: string;
  };
  ScannerHomeDriver: undefined;
  Register: undefined;
  CameraScreenDriver: undefined;
  CameraScreenTechnical: undefined;
  DataDriverLicense: undefined;
  DataAuto: undefined;
  Home: undefined;
  ScannerHomeTechnical: undefined;
};

const RootNavigation = () => {
  const {authUser, login, logout} = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     if (!authUser) {
  //       navigation.navigate('Login');
  //       return;
  //     }

  //     const isAuthenticated = await authentication(authUser);
  //     const hasTokenNotAuth = await hasTokenNotAuthenticated(authUser);
  //     const notCar = await registeredButNotCar(authUser);

  //     if (isAuthenticated) {
  //       navigation.navigate('Home');
  //     } else if (hasTokenNotAuth) {
  //       navigation.navigate('Register');
  //     } else if (notCar) {
  //       navigation.navigate('ScannerHomeTechnical');
  //     } else {
  //       navigation.navigate('Login');
  //     }

  //     setAuthCheckComplete(true);
  //   };

  //   if (!authCheckComplete) {
  //     checkAuthentication();
  //   }
  // }, [authUser, authCheckComplete, navigation]);

  // useEffect(() => {
  //   if (authUser?.token && !authCheckComplete) {
  //     dispatch(authUserInfoRequest({token: authUser.token})).then(
  //       (result: {payload: any}) => {
  //         const {user, status, message} = result.payload;
  //         console.log('📢 [RootNavigation.tsx:82]', result.payload);
  //         if (status) {
  //           const authUserRequestData: User = {
  //             add_car_status: user?.add_car_status,
  //             create_account_status: user?.create_account_status,
  //           };
  //           login(authUserRequestData);
  //         } else if (message === 'Unauthenticated.') {
  //           logout();
  //         }
  //       },
  //     );
  //   }
  // }, [authUser, authCheckComplete, dispatch, login, logout]);

  const checkAuthentication = async () => {
    if (!authUser) {
      navigation.navigate('Login');
      return;
    }

    const isAuthenticated = await authentication(authUser);
    const hasTokenNotAuth = await hasTokenNotAuthenticated(authUser);
    const notCar = await registeredButNotCar(authUser);

    if (isAuthenticated) {
      navigation.navigate('Home');
    } else if (hasTokenNotAuth) {
      navigation.navigate('Register');
    } else if (notCar) {
      navigation.navigate('ScannerHomeTechnical');
    } else {
      navigation.navigate('Login');
    }

    setAuthCheckComplete(true);
  };

  useEffect(() => {
    if (authUser?.token && !authCheckComplete) {
      dispatch(authUserInfoRequest({token: authUser.token}))
        .then((result: {payload: any}) => {
          const {user, status, message} = result.payload;
          console.log('📢 [RootNavigation.tsx:82]', result.payload);
          if (status) {
            const authUserRequestData: User = {
              add_car_status: user?.add_car_status,
              create_account_status: user?.create_account_status,
            };
            login(authUserRequestData);
          } else if (message === 'Unauthenticated.') {
            logout();
          }
        })
        .then(() => {
          checkAuthentication();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCheckComplete, dispatch, login, logout]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Group>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginOTP" component={LoginOTP} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ScannerHomeDriver" component={ScannerHomeDriver} />
        <Stack.Screen
          name="CameraScreenDriver"
          component={CameraScreenDriver}
        />
        <Stack.Screen name="DataDriverLicense" component={DataDriverLicense} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="ScannerHomeTechnical"
          component={ScannerHomeTechnical}
        />
        <Stack.Screen
          name="CameraScreenTechnical"
          component={CameraScreenTechnical}
        />
        <Stack.Screen name="DataAuto" component={DataAuto} />
      </Stack.Group>

      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default RootNavigation;

const authentication = async (authUser: User | null): Promise<boolean> => {
  if (!authUser) {
    return false;
  }

  const hasAccount = authUser.create_account_status === '1';
  const isDriver = authUser.job_category_id === '3';
  const hasCar = authUser.add_car_status === '1';

  return (hasAccount && isDriver) || (hasAccount && hasCar);
};

const hasTokenNotAuthenticated = async (
  authUser: User | null,
): Promise<boolean> => {
  if (!authUser) {
    return false;
  }

  const hasAccount = authUser?.token !== null;
  const isDriver = authUser?.create_account_status !== '1';
  const hasCar = authUser.add_car_status !== '1';

  return hasAccount && isDriver && hasCar;
};

const registeredButNotCar = async (authUser: User | null): Promise<boolean> => {
  if (!authUser) {
    return false;
  }

  const hasAccount = authUser?.token !== null;
  const isDriver = authUser?.create_account_status === '1';
  const hasCar = authUser.add_car_status !== '1';

  return hasAccount && isDriver && hasCar;
};
