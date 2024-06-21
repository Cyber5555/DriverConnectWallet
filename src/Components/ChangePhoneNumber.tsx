/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  useWindowDimensions,
  ScrollView,
  Keyboard,
  Vibration,
} from 'react-native';
import Colors from '../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AdaptiveButton} from './AdaptiveButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BoldText} from '../Includes/BoldText';
import {RegularText} from '../Includes/RegularText';
import {CountdownTimer} from './CountdownTimer';
import OTPTextInput from 'react-native-otp-textinput';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {clearError, updateOTPRequest} from '../Screens/Profile/updateOTPSlice';
import {useAuth, useAuthHandler} from '../Context/AuthContext';
import {updatePhoneRequest} from '../Screens/Profile/updatePhoneSlice';
import {authUserInfoRequest} from '../Screens/Home/authUserInfoSlice';

type ChangePhoneNumberProps = {
  visible: boolean;
  setIsOpenModalPhone: (bool: boolean) => void;
  unmaskedPhone: string;
};

const ChangePhoneNumberComponent = ({
  visible,
  setIsOpenModalPhone,
  unmaskedPhone,
}: ChangePhoneNumberProps) => {
  const {authUser, loadUserData} = useAuth();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const {handleUnauthenticated} = useAuthHandler();
  const {height} = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const otpInputRef = useRef<OTPTextInput>(null);
  const [inputValue, setInputValue] = useState('');
  const {code} = useSelector((state: RootState) => state.updatePhoneSlice);
  const {successCode, error, loading} = useSelector(
    (state: RootState) => state.updateOTPSlice,
  );

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

  const sendCode = useCallback(() => {
    if (unmaskedPhone && code !== '') {
      dispatch(
        updateOTPRequest({
          phone: unmaskedPhone,
          code: inputValue,
          token: authUser?.token,
        }),
      )
        .unwrap()
        .then(res => {
          if (res.status) {
            setIsOpenModalPhone(false);
          }
        })
        .catch((err: any) => {
          if (err.message === 'Unauthenticated.') {
            handleUnauthenticated();
          }
        });
    }
  }, [
    authUser?.token,
    code,
    dispatch,
    handleUnauthenticated,
    inputValue,
    setIsOpenModalPhone,
    unmaskedPhone,
  ]);

  useEffect(() => {
    if (!successCode) {
      Vibration.vibrate();
    } else if (successCode) {
      dispatch(clearError());
    }
  }, [dispatch, error.status, loadUserData, successCode]);

  const handleResendOTP = () => {
    if (unmaskedPhone.length === 10) {
      dispatch(
        updatePhoneRequest({phone: unmaskedPhone, token: authUser?.token}),
      )
        .unwrap()
        .catch((err: any) => {
          if (err.message === 'Unauthenticated.') {
            handleUnauthenticated();
          }
        });
    }
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={{...styles.container, paddingTop: insets.top}}>
        <View style={{...styles.modalBlock, ...{height: height / 2.2}}}>
          <View style={styles.topBar}>
            <View style={styles.empty} />
            <BoldText style={styles.pageTitle}>
              Подтвердить номер телефона
            </BoldText>
            <AntDesign
              name={'close'}
              size={30}
              color={Colors.dark}
              onPress={() => {
                setIsOpenModalPhone(false);
                dispatch(authUserInfoRequest({token: authUser?.token}));
              }}
            />
          </View>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {code && (
              <RegularText
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                Код подтверждения номера телефона
              </RegularText>
            )}
            <RegularText
              style={{
                textAlign: 'center',
                fontSize: 16,
                marginTop: 10,
              }}>
              {code}
            </RegularText>
            <View style={styles.bottomContainer}>
              <RegularText style={styles.textInfo}>
                SMS с кодом авторизации отправлено на указанный номер телефона.
              </RegularText>

              <OTPTextInput
                containerStyle={styles.inputContainerStyle}
                textInputStyle={styles.textInputStyle}
                autoFocus={true}
                inputCount={6}
                handleTextChange={text => {
                  setInputValue(text);
                  dispatch(clearError());
                }}
                tintColor={error.status ? Colors.lightRed : Colors.green}
                offTintColor={error.status ? Colors.lightRed : 'transparent'}
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
                  Подтвердить
                </AdaptiveButton>
              )}

              <CountdownTimer duration={60} onResend={handleResendOTP} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBlock: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  pageTitle: {
    fontSize: 20,
  },

  empty: {
    width: 30,
  },

  textInfo: {
    fontSize: 15,
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
});

export const ChangePhoneNumber = memo(ChangePhoneNumberComponent);
