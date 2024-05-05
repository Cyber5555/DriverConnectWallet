import React, {useEffect} from 'react';
import {useAuth} from '../Context/AuthContext';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Colors from '../Includes/Colors';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Login} from '../Screens/Auth/Login/Login';
import {LoginOTP} from '../Screens/Auth/LoginOTP/LoginOTP';
import {Register} from '../Screens/Auth/Register/Register';
import {ScannerHomeTechnical} from '../Screens/ScannerTechnicalPassport/ScannerHomeTechnical';
import {CameraScreenTechnical} from '../Screens/ScannerTechnicalPassport/CameraScreenTechnical';
import {DataAuto} from '../Screens/Data/DataAuto/DataAuto';
import {ScannerHomeDriver} from '../Screens/ScannerDriverLicense/ScannerHomeDriver';
import {CameraScreenDriver} from '../Screens/ScannerDriverLicense/CameraScreenDriver';
import {DataDriverLicense} from '../Screens/Data/DataDriverLicense/DataDriverLicense';
import {useNavigation} from '@react-navigation/native';
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
  const {isLoading, authUser} = useAuth();
  const {width} = useWindowDimensions();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  const authentication = async (): Promise<boolean> => {
    if (!authUser) {
      return false;
    }

    const hasAccount = authUser.create_account_status === '1';
    const isDriver = authUser.job_category_id === '3';
    const hasCar = authUser.add_car_status === '1';

    return (hasAccount && isDriver) || (hasAccount && hasCar);
  };

  const hasTokenNotAuthenticated = async (): Promise<boolean> => {
    if (!authUser) {
      return false;
    }

    const hasAccount = authUser?.token !== null;
    const isDriver = authUser?.create_account_status === '0';
    const hasCar = authUser.add_car_status === '0';

    return hasAccount && isDriver && hasCar;
  };

  const registeredButNotCar = async (): Promise<boolean> => {
    if (!authUser) {
      return false;
    }

    const hasAccount = authUser?.token !== null;
    const isDriver = authUser?.create_account_status === '1';
    const hasCar = authUser.add_car_status === '0';

    return hasAccount && isDriver && hasCar;
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await authentication();
      const hasTokenNotAuth = await hasTokenNotAuthenticated();
      const notCar = await registeredButNotCar();

      console.log(
        '📢 [NotAuthStack.tsx:70]',
        isAuthenticated,
        'isAuthenticated',
      );
      console.log(
        '📢 [NotAuthStack.tsx:71]',
        hasTokenNotAuth,
        'hasTokenNotAuth',
      );
      console.log('📢 [NotAuthStack.tsx:80]', notCar, 'notCar');

      console.log('📢 [NotAuthStack.tsx:82]', authUser, 'authUser');

      if (isAuthenticated) {
        navigation.navigate('Home');
      } else if (hasTokenNotAuth) {
        navigation.navigate('Register');
      } else if (notCar) {
        navigation.navigate('ScannerHomeTechnical');
      } else {
        navigation.navigate('Login');
      }
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authentication, hasTokenNotAuthenticated, registeredButNotCar]);

  // if (isLoading) {
  //   return (
  //     <View style={styles.loader}>
  //       <Image
  //         source={require('../Assets/images/logo.png')}
  //         style={[styles.logo, {width: width * 0.6, height: width * 0.7}]}
  //       />
  //       <ActivityIndicator color={Colors.black} size={100} />
  //     </View>
  //   );
  // }

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

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     aspectRatio: 3,
//     marginTop: 60,
//     resizeMode: 'contain',
//     alignSelf: 'center',
//   },
// });

export default RootNavigation;
