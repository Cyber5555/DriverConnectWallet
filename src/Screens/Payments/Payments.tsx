import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RegularText} from '../../Includes/RegularText';

type PaymentsProps = {};

const PaymentsComponent = ({}: PaymentsProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <RegularText>Page is coming son</RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const Payments = memo(PaymentsComponent);
