import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {memo} from 'react';
import {RootNavigationProps} from './RootNavigation';
import {Home} from '../Screens/Home/Home';

type AuthStackProps = {};

const Stack = createNativeStackNavigator<RootNavigationProps>();

const AuthStackComponent = ({}: AuthStackProps) => {
  // const hasTokenNotAuthenticated =
  //   token?.token &&
  //   auth_user_info?.add_car_status === '0' &&
  //   auth_user_info?.create_account_status === '0';

  // const registeredButNotCar =
  //   token?.token &&
  //   auth_user_info?.add_car_status === '0' &&
  //   auth_user_info?.create_account_status === '1';

  // if (hasTokenNotAuthenticated) {
  //   return (
  //     <Stack.Navigator
  //       initialRouteName={'Register'}
  //       screenOptions={{
  //         headerShown: false,
  //         animation: 'slide_from_right',
  //       }}>
  //       <Stack.Screen name="Register" component={Register} />
  //       <Stack.Screen name="ScannerHomeDriver" component={ScannerHomeDriver} />
  //       <Stack.Screen
  //         name="CameraScreenDriver"
  //         component={CameraScreenDriver}
  //       />
  //       <Stack.Screen name="DataDriverLicense" component={DataDriverLicense} />
  //     </Stack.Navigator>
  //   );
  // } else if (registeredButNotCar) {
  //   return (
  //     <Stack.Navigator
  //       initialRouteName={'ScannerHomeTechnical'}
  //       screenOptions={{
  //         headerShown: false,
  //         animation: 'slide_from_right',
  //       }}>
  //       <Stack.Screen
  //         name="ScannerHomeTechnical"
  //         component={ScannerHomeTechnical}
  //       />
  //       <Stack.Screen
  //         name="CameraScreenTechnical"
  //         component={CameraScreenTechnical}
  //       />
  //       <Stack.Screen name="DataAuto" component={DataAuto} />
  //     </Stack.Navigator>
  //   );
  // }

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export const AuthStack = memo(AuthStackComponent);
