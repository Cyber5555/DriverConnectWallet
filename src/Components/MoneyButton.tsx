import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {InputMoney, OutputMoney} from '../Includes/configIcons';
import Colors from '../Includes/Colors';

type MoneyButtonProps = {
  iconType: 'Input' | 'OutPut';
};

const MoneyButtonComponent = ({iconType}: MoneyButtonProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      {iconType === 'Input' ? (
        <>
          <InputMoney color={Colors.white} width={50} height={50} />
          <View>
            <Text style={styles.text}>Пополнить</Text>
            <Text style={styles.text}>баланс</Text>
          </View>
        </>
      ) : (
        <>
          <OutputMoney color={Colors.white} width={50} height={50} />
          <View>
            <Text style={styles.text}>Вывести</Text>
            <Text style={styles.text}>деньги</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darker,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },
  text: {
    color: Colors.white,
  },
});

export const MoneyButton = memo(MoneyButtonComponent);
