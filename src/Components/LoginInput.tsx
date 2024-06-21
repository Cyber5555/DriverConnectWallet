/* eslint-disable react-native/no-inline-styles */
import React, {memo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../Includes/Colors';
import MaskInput from 'react-native-mask-input';
import {RegularText} from '../Includes/RegularText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  clearError,
  updatePhoneRequest,
} from '../Screens/Profile/updatePhoneSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../store/store';
import {useAuth, useAuthHandler} from '../Context/AuthContext';

type LoginInputProps = {
  label: string;
  containerStyle?: ViewStyle;
  placeholder: string;
  phone: string;
  setPhone: (text: string) => void;
  setUnmaskedPhone: (text: string) => void;
  error?: boolean;
  page?: 'profile' | 'login';
  setIsOpenModalPhone: (bool: boolean) => void;
  authUserPhone?: string;
};

type EditStatus = 'edit' | 'save';

const LoginInputComponent = ({
  label,
  containerStyle,
  placeholder,
  phone,
  setPhone,
  setUnmaskedPhone,
  error,
  page,
  setIsOpenModalPhone,
  authUserPhone,
}: LoginInputProps) => {
  const {authUser} = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [editStatus, setEditStatus] = useState<EditStatus>('edit');
  const [editable, setEditable] = useState(page === 'login' ? true : false);
  const {handleUnauthenticated} = useAuthHandler();
  const focusRef = useRef<TextInput | null>(null);

  const toggleEditable = async () => {
    if (page === 'profile') {
      if (editStatus === 'edit') {
        await setEditable(true);
        await setEditStatus('save');
        focusRef.current?.focus();
      } else if (editStatus === 'save') {
        setEditable(false);
        setEditStatus('edit');
        if (phone !== authUserPhone) {
          dispatch(updatePhoneRequest({phone, token: authUser?.token}))
            .unwrap()
            .then(res => {
              if (res.status) {
                setIsOpenModalPhone(true);
              }
            })
            .catch((err: any) => {
              if (err.message === 'Unauthenticated.') {
                handleUnauthenticated();
              }
            });
        }
      } else {
        setEditable(false);
      }
    }
  };

  return (
    <View style={{...styles.container, ...containerStyle}}>
      <RegularText style={styles.label}>{label}</RegularText>
      <MaskInput
        editable={editable}
        value={phone}
        autoFocus={true}
        ref={focusRef}
        style={[
          styles.input,
          {
            borderWidth: error ? 1 : 0,
            borderColor: error ? Colors.lightRed : 'transparent',
          },
        ]}
        onChangeText={(masked, unmasked) => {
          setPhone(masked);
          setUnmaskedPhone(unmasked);
          dispatch(clearError());
        }}
        placeholder={placeholder}
        placeholderTextColor={Colors.darkGray}
        keyboardType={'phone-pad'}
        mask={[
          '+',
          '7',
          ' ',
          '(',
          /\d/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
        ]}
      />

      {page === 'profile' ? (
        <TouchableOpacity style={styles.edit} onPress={toggleEditable}>
          {editStatus === 'edit' ? (
            <AntDesign
              name={'edit'}
              color={Colors.lightBlue}
              size={24}
              onPress={toggleEditable}
            />
          ) : editStatus === 'save' ? (
            <AntDesign
              name={'save'}
              color={Colors.lightBlue}
              size={24}
              onPress={toggleEditable}
            />
          ) : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.darker,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray,
    color: Colors.dark,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 20,
  },
  edit: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const LoginInput = memo(LoginInputComponent);
