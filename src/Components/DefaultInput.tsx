/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import Colors from '../Includes/Colors';
import {RegularText} from '../Includes/RegularText';

type DefaultInputProps = {
  containerStyle?: ViewStyle;
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  error: boolean;
};

const DefaultInputComponent = ({
  containerStyle,
  placeholder,
  onChangeText,
  value,
  keyboardType = 'default',
  label,
  error,
}: DefaultInputProps) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <RegularText style={styles.label}>{label}</RegularText>
      <TextInput
        value={value}
        style={[
          styles.input,
          {
            borderColor: error ? Colors.red : 'transparent',
          },
        ]}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.darkGray}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 20,
    color: Colors.dark,
    height: 55,
    borderWidth: 1,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.darker,
  },
});

export const DefaultInput = memo(DefaultInputComponent);
