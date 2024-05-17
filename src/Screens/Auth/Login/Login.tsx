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
  Linking,
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
import {socialDataRequest} from './socialDataSlice';
import {BoldText} from '../../../Includes/BoldText';
import {RegularText} from '../../../Includes/RegularText';

const LoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error} = useSelector((state: RootState) => state.loginSlice);
  const {telegram, whatsApp} = useSelector(
    (state: RootState) => state.socialDataSlice,
  );
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

  useEffect(() => {
    dispatch(socialDataRequest());
  }, [dispatch]);

  const sendData = useCallback(() => {
    if (unmaskedPhone.length === 10) {
      dispatch(loginRequest({phone: unmaskedPhone})).then(result => {
        const {code, status} = result.payload as LoginPayload;
        if (status) {
          if (unmaskedPhone.length === 10) {
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

  const linkToTelegram = useCallback(() => {
    Linking.openURL(telegram);
  }, [telegram]);

  const linkToWhatsApp = useCallback(() => {
    Linking.openURL(whatsApp);
  }, [whatsApp]);

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
          <BoldText style={styles.textWelcome}>
            Подключение к Яндекс Такси
          </BoldText>
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
          <RegularText style={styles.haveAQuestions}>
            «Есть вопросы? Напишите нам!»
          </RegularText>
          <View style={styles.wrapperIcons}>
            <FontAwesome
              name={'telegram'}
              color={Colors.lightBlue}
              size={50}
              onPress={linkToTelegram}
            />
            <WhatsAppIcon width={60} height={60} onPress={linkToWhatsApp} />
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
