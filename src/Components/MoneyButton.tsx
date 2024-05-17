import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {InputMoney, OutputMoney} from '../Includes/configIcons';
import Colors from '../Includes/Colors';
import {RegularText} from '../Includes/RegularText';

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
            <RegularText style={styles.text}>Пополнить</RegularText>
            <RegularText style={styles.text}>баланс</RegularText>
          </View>
        </>
      ) : (
        <>
          <OutputMoney color={Colors.white} width={50} height={50} />
          <View>
            <RegularText style={styles.text}>Вывести</RegularText>
            <RegularText style={styles.text}>деньги</RegularText>
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
