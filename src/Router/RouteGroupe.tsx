import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootNavigationProps} from './RootNavigation';
import {Home} from '../Screens/Home/Home';
import {ScannerHomeTechnical} from '../Screens/ScannerTechnicalPassport/ScannerHomeTechnical';
import {CameraScreenTechnical} from '../Screens/ScannerTechnicalPassport/CameraScreenTechnical';
import {DataAuto} from '../Screens/Data/DataAuto/DataAuto';
import {Profile} from '../Screens/Profile/Profile';
import {Payments} from '../Screens/Payments/Payments';
import {Trips} from '../Screens/Trips/Trips';

const Stack = createNativeStackNavigator<RootNavigationProps>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Profile'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen
        name="ScannerHomeTechnical"
        component={ScannerHomeTechnical}
      />
      <Stack.Screen
        name="CameraScreenTechnical"
        component={CameraScreenTechnical}
      />
      <Stack.Screen name="DataAuto" component={DataAuto} />
    </Stack.Navigator>
  );
};
export const TripsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Trips'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Trips" component={Trips} />
    </Stack.Navigator>
  );
};
export const PaymentsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Trips'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Payments" component={Payments} />
    </Stack.Navigator>
  );
};
