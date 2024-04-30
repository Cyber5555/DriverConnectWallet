/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import Colors from '../../../Includes/Colors';
import {LoginInput} from '../../../Components/LoginInput';
import {AdaptiveButton} from '../../../Components/AdaptiveButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {WhatsAppIcon} from '../../../Includes/configIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../../Router/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {LoginPayload, loginRequest} from './loginSlice';
import {AppDispatch, RootState} from '../../../store/store';

const LoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error} = useSelector((state: RootState) => state.loginSlice);
  const [phone, setPhone] = useState<string>('');
  const [unmaskedPhone, setUnmaskedPhone] = useState<string>('');
  const [lengthError, setLengthError] = useState<boolean>(false);
  const {width} = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
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

  const sendData = useCallback(() => {
    if (unmaskedPhone.length === 10) {
      dispatch(loginRequest({phone: unmaskedPhone})).then(result => {
        const {code, status} = result.payload as LoginPayload;
        if (status) {
          if (code && unmaskedPhone.length === 10) {
            navigation.navigate('LoginOTP', {
              code,
              unmaskedPhone,
            });
            setUnmaskedPhone('');
            setPhone('');
          }
        }
      });
    } else {
      setLengthError(true);
    }
  }, [dispatch, navigation, unmaskedPhone]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
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
          <Text style={styles.textWelcome}>Подключение к Яндекс Такси</Text>
          <LoginInput
            label={'Введите номер телефона'}
            placeholder={'+x (xxx) xxx-xx-xx'}
            containerStyle={{marginBottom: 10}}
            error={error || lengthError}
            phone={phone}
            setPhone={text => {
              setPhone(text);
              setLengthError(false);
            }}
            setUnmaskedPhone={text => setUnmaskedPhone(text)}
          />
          <AdaptiveButton
            containerStyle={{marginBottom: 10}}
            loading={loading}
            onPress={sendData}>
            ВХОД ИЛИ РЕГИСТРАЦИЯ
          </AdaptiveButton>
          <Text style={styles.haveAQuestions}>
            «Есть вопросы? Напишите нам!»
          </Text>
          <View style={styles.wrapperIcons}>
            <FontAwesome name={'telegram'} color={Colors.lightBlue} size={50} />
            <WhatsAppIcon width={60} height={60} />
          </View>
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
  },
  logo: {
    aspectRatio: 3,
    marginTop: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textWelcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darker,
    marginBottom: 40,
    textAlign: 'center',
  },
  bottomContainer: {
    flex: 1,
    paddingTop: 50,
  },
  wrapperIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 30,
    marginTop: 20,
  },
  haveAQuestions: {
    textAlign: 'center',
    marginTop: 30,
  },
});

export const Login = memo(LoginComponent);