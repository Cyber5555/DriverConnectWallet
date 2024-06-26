/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Image,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Keyboard,
  Alert,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../Includes/Colors';
import {AdaptiveButton} from '../../../Components/AdaptiveButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../../Router/RootNavigation';
import OTPTextInput from 'react-native-otp-textinput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {clearError, loginOTPRequest} from './loginOTPSlice';
import {AppDispatch, RootState} from '../../../store/store';
import {User, useAuth} from '../../../Context/AuthContext';
import {useIsFocused} from '@react-navigation/native';
import {CountdownTimer} from '../../../Components/CountdownTimer';
import {loginRequest} from '../Login/loginSlice';
import {BoldText} from '../../../Includes/BoldText';
import {RegularText} from '../../../Includes/RegularText';

type RouteParams = {
  key: string;
  name: string;
  params: {
    unmaskedPhone: string;
    code: string;
  };
};

const LoginOTPComponent = () => {
  const isFocusedPage = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const {params} = useRoute<RouteParams>();
  const [inputValue, setInputValue] = useState('');
  const {code} = useSelector((state: RootState) => state.loginSlice);
  const {loading, error, successCode, token, user} = useSelector(
    (state: RootState) => state.loginOTPSlice,
  );

  const {login, loadUserData} = useAuth();
  const {width} = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const otpInputRef = useRef<OTPTextInput>(null);
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollViewRef.current?.scrollTo({y: 100, animated: true});
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocusedPage) {
      if (code !== '' && code !== undefined) {
        Alert.alert('Your Code', `Code: ${code}`, [
          {
            text: 'ДАЛЕЕ',
          },
        ]);
      }
    }
  }, [params, code]);

  const sendCode = useCallback(() => {
    if (params.unmaskedPhone && code !== '') {
      dispatch(
        loginOTPRequest({phone: params.unmaskedPhone, code: inputValue}),
      );
    }
  }, [dispatch, inputValue, params]);

  useEffect(() => {
    if (error.message === 'Неверный код потверждения') {
      Vibration.vibrate();
    } else if (successCode) {
      const userToken: User = {
        token: token,
        job_category_id: user?.job_category_id,
        create_account_status: user?.create_account_status,
        add_car_status: user?.add_car_status,
      };

      login(userToken);
      loadUserData(false);
      dispatch(clearError());
    }
  }, [error.message, successCode, token]);

  const handleResendOTP = () => {
    if (params.unmaskedPhone.length === 10) {
      dispatch(loginRequest({phone: params.unmaskedPhone}));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <AntDesign
        name={'arrowleft'}
        color={Colors.black}
        style={[styles.goBack, {top: insets.top + 10}]}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Image
          source={require('../../../Assets/images/logo.png')}
          style={[styles.logo, {width: width * 0.6, height: width * 0.7}]}
        />
        <View style={styles.bottomContainer}>
          <BoldText style={styles.textWelcome}>Вход</BoldText>
          <RegularText style={styles.textInfo}>
            SMS с кодом авторизации отправлено на указанный номер телефона. Для
            входа в аккаунт введите его в поле ниже.
          </RegularText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <RegularText style={styles.falseNumber}>
              Неверный номер?
            </RegularText>
          </TouchableOpacity>
          <OTPTextInput
            containerStyle={styles.inputContainerStyle}
            textInputStyle={styles.textInputStyle}
            autoFocus={true}
            inputCount={6}
            handleTextChange={text => {
              setInputValue(text);
              dispatch(clearError());
            }}
            tintColor={
              error.message === 'Неверный код потверждения'
                ? Colors.lightRed
                : Colors.green
            }
            offTintColor={
              error.message === 'Неверный код потверждения'
                ? Colors.lightRed
                : 'transparent'
            }
            ref={otpInputRef}
          />
          {inputValue.length === 6 && (
            <AdaptiveButton
              disabled={inputValue.length < 6 ? true : false}
              loading={loading}
              containerStyle={{
                marginBottom: 10,
                backgroundColor:
                  inputValue.length < 6 ? '#319240aa' : Colors.green,
              }}
              onPress={sendCode}>
              ДАЛЕЕ
            </AdaptiveButton>
          )}

          <CountdownTimer duration={60} onResend={handleResendOTP} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  goBack: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  logo: {
    aspectRatio: 3,
    marginTop: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textWelcome: {
    fontSize: 25,
    color: Colors.darker,
    marginBottom: 40,
  },
  textInfo: {
    fontSize: 15,
  },
  falseNumber: {
    fontSize: 16,
    color: Colors.lightBlue,
    marginTop: 10,
  },
  inputContainerStyle: {
    fontSize: 20,
    marginVertical: 20,
    gap: 5,
    justifyContent: 'center',
  },
  textInputStyle: {
    borderRadius: 8,
    backgroundColor: Colors.gray,
    color: Colors.dark,
    borderWidth: 1,
    margin: 0,
  },
  bottomContainer: {
    flex: 1,
    paddingTop: 40,
  },
  wrapperIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 30,
    marginTop: 20,
  },
});

export const LoginOTP = memo(LoginOTPComponent);
