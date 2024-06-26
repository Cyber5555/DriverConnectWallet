import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from '../Screens/Auth/Login/Login';
import {LoginOTP} from '../Screens/Auth/LoginOTP/LoginOTP';
import {Register} from '../Screens/Auth/Register/Register';
import {ScannerHomeTechnical} from '../Screens/ScannerTechnicalPassport/ScannerHomeTechnical';
import {CameraScreenTechnical} from '../Screens/ScannerTechnicalPassport/CameraScreenTechnical';
import {DataAuto} from '../Screens/Data/DataAuto/DataAuto';
import {ScannerHomeDriver} from '../Screens/ScannerDriverLicense/ScannerHomeDriver';
import {CameraScreenDriver} from '../Screens/ScannerDriverLicense/CameraScreenDriver';
import {DataDriverLicense} from '../Screens/Data/DataDriverLicense/DataDriverLicense';
import {useAuth} from '../Context/AuthContext';
import {TabBar} from './TabBar';

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
  Profile: undefined;
  TabBar: undefined;
  Trips: undefined;
  Payments: undefined;
};

const RootNavigation = () => {
  const {isAuthenticated, hasTokenNotAuth, notCar} = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={
        isAuthenticated
          ? 'Home'
          : hasTokenNotAuth
          ? 'Register'
          : notCar
          ? 'ScannerHomeTechnical'
          : 'Login'
      }
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {!isAuthenticated ? (
        <Stack.Group>
          {hasTokenNotAuth ? (
            <Stack.Group>
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen
                name="ScannerHomeDriver"
                component={ScannerHomeDriver}
              />
              <Stack.Screen
                name="CameraScreenDriver"
                component={CameraScreenDriver}
              />
              <Stack.Screen
                name="DataDriverLicense"
                component={DataDriverLicense}
              />
            </Stack.Group>
          ) : notCar ? (
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
          ) : (
            <Stack.Group>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="LoginOTP" component={LoginOTP} />
            </Stack.Group>
          )}
        </Stack.Group>
      ) : (
        <Stack.Screen name="TabBar" component={TabBar} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
