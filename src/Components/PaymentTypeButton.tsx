import React, {ReactNode, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../Includes/Colors';

type PaymentTypeButtonProps = {
  children: ReactNode;
};

const PaymentTypeButtonComponent = ({children}: PaymentTypeButtonProps) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.wheat,
    height: 30,
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    gap: 5,
  },
});

export const PaymentTypeButton = memo(PaymentTypeButtonComponent);
