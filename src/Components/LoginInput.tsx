/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Colors from '../Includes/Colors';
import MaskInput from 'react-native-mask-input';

type LoginInputProps = {
  label: string;
  containerStyle?: ViewStyle;
  placeholder: string;
  phone: string;
  setPhone: (text: string) => void;
  setUnmaskedPhone: (text: string) => void;
  error?: boolean;
};

const LoginInputComponent = ({
  label,
  containerStyle,
  placeholder,
  phone,
  setPhone,
  setUnmaskedPhone,
  error,
}: LoginInputProps) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <Text style={styles.label}>{label}</Text>
      <MaskInput
        value={phone}
        style={[
          styles.input,
          {
            borderWidth: error ? 1 : 0,
            borderColor: error ? Colors.red : 'transparent',
          },
        ]}
        onChangeText={(masked, unmasked) => {
          setPhone(masked);
          setUnmaskedPhone(unmasked);
        }}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark}
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
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 20,
  },
});

export const LoginInput = memo(LoginInputComponent);
