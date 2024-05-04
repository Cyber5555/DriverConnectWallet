import React, {memo} from 'react';
import {RootNavigationProps} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from '../Screens/Auth/Login/Login';
import {LoginOTP} from '../Screens/Auth/LoginOTP/LoginOTP';

type NotAuthStackProps = {};
const Stack = createNativeStackNavigator<RootNavigationProps>();

const NotAuthStackComponent = ({}: NotAuthStackProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginOTP" component={LoginOTP} />
    </Stack.Navigator>
  );
};

export const NotAuthStack = memo(NotAuthStackComponent);
