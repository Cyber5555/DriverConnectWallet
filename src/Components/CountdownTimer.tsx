import React, {memo, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type CountdownTimerProps = {
  duration: number;
  onResend: () => void;
};

const CountdownTimerComponent = ({duration, onResend}: CountdownTimerProps) => {
  const [timer, setTimer] = useState<number>(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          clearInterval(interval);
        }
        return prevTimer === 0 ? 0 : prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const handleResend = () => {
    // Call the resend function when the timer reaches zero
    if (timer === 0) {
      onResend();
      setTimer(duration); // Reset the timer after resending
    }
  };

  return (
    <View style={styles.resendCodeContainer}>
      <TouchableOpacity
        onPress={handleResend}
        disabled={timer !== 0}
        style={styles.resendCodeLeft}>
        <Feather name={'message-square'} size={24} />
        <Text style={styles.resendCode} role={'button'}>
          Отправить код повторно
        </Text>
      </TouchableOpacity>
      <Text style={styles.timerText}>{`00:${
        timer < 10 ? `0${timer}` : timer
      }`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  resendCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  resendCodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resendCode: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export const CountdownTimer = memo(CountdownTimerComponent);
