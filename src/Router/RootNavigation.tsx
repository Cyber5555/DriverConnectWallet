import React from 'react';
import {useAuth} from '../Context/AuthContext';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Colors from '../Includes/Colors';
import {NavigationContainer} from '@react-navigation/native';
import {AuthStack} from './AuthStack';
import {NotAuthStack} from './NotAuthStack';

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
  const {token} = useAuth();

  // const authenticated =
  //   (token?.token &&
  //     auth_user_info?.create_account_status === '1' &&
  //     auth_user_info?.job_category_id === '3') ||
  //   (token?.token &&
  //     auth_user_info?.create_account_status === '1' &&
  //     auth_user_info?.add_car_status === '1');

  const {width} = useWindowDimensions();
  const {isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Image
          source={require('../Assets/images/logo.png')}
          style={[styles.logo, {width: width * 0.6, height: width * 0.7}]}
        />
        <ActivityIndicator color={Colors.black} size={100} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      {token?.token ? <AuthStack /> : <NotAuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    aspectRatio: 3,
    marginTop: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default RootNavigation;
