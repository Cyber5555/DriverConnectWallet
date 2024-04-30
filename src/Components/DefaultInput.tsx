import React, {memo} from 'react';
import {View, StyleSheet, ViewStyle, TextInput} from 'react-native';
import Colors from '../Includes/Colors';

type DefaultInputProps = {
  containerStyle?: ViewStyle;
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
};

const DefaultInputComponent = ({
  containerStyle,
  placeholder,
  onChangeText,
  value,
}: DefaultInputProps) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <TextInput
        value={value}
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark}
        keyboardType={'default'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 20,
  },
});

export const DefaultInput = memo(DefaultInputComponent);
