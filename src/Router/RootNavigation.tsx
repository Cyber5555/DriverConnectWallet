import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Login} from '../Screens/Auth/Login/Login';
import {ScannerHome} from '../Screens/Scanner/ScannerHome';
import {Register} from '../Screens/Auth/Register/Register';
import {CameraScreen} from '../Screens/Scanner/CameraScreen';
import {LoginOTP} from '../Screens/Auth/LoginOTP/LoginOTP';
import {DataAuto} from '../Screens/Data/DataAuto/DataAuto';
import {DataDriverLicense} from '../Screens/Data/DataDriverLicense/DataDriverLicense';

export type RootNavigationProps = {
  Login: undefined;
  LoginOTP: {code: string; unmaskedPhone: string};
  ScannerHome: undefined;
  Register: undefined;
  CameraScreen: undefined;
  DataDriverLicense: undefined;
  DataAuto: undefined;
};

const Stack = createNativeStackNavigator<RootNavigationProps>();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {/* <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen name={'LoginOTP'} component={LoginOTP} />
      <Stack.Screen name={'Register'} component={Register} />
      <Stack.Screen name={'ScannerHome'} component={ScannerHome} /> */}
      <Stack.Screen
        options={{animation: 'slide_from_bottom'}}
        name={'CameraScreen'}
        component={CameraScreen}
      />
      <Stack.Screen name={'DataDriverLicense'} component={DataDriverLicense} />
      <Stack.Screen name={'DataAuto'} component={DataAuto} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
