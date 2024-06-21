import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import Colors from './Colors';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: TextStyle;
  numberOfLines?: number;
}

export const RegularText = ({
  style,
  children,
  onPress,
  numberOfLines,
}: Props) => {
  return (
    <Text
      style={{...styles.text, ...style}}
      onPress={onPress}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
  },
});
