import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

type PaymentsProps = {};

const PaymentsComponent = ({}: PaymentsProps) => {
  return (
    <View style={styles.container}>
      <Text>Выплаты is coning son</Text>
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
