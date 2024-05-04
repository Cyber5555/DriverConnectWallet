import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import Colors from '../Includes/Colors';

type DefaultInputProps = {
  containerStyle?: ViewStyle;
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  keyboardType?: KeyboardTypeOptions;
};

const DefaultInputComponent = ({
  containerStyle,
  placeholder,
  onChangeText,
  value,
  keyboardType = 'default',
}: DefaultInputProps) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <TextInput
        value={value}
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark}
        keyboardType={keyboardType}
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
    color: Colors.dark,
  },
});

export const DefaultInput = memo(DefaultInputComponent);
