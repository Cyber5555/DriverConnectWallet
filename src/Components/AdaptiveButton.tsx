import React, {memo} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Colors from '../Includes/Colors';
import LoaderKit from 'react-native-loader-kit';

type AdaptiveButtonProps = {
  children: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const AdaptiveButtonComponent = ({
  children,
  containerStyle,
  textStyle,
  onPress,
  disabled,
  loading,
}: AdaptiveButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      touchSoundDisabled={true}
      style={{
        ...styles.container,
        ...containerStyle,
      }}
      onPress={onPress}>
      {loading ? (
        <LoaderKit
          style={styles.load}
          name={'BallSpinFadeLoader'}
          color={Colors.white}
        />
      ) : (
        <Text style={{...styles.text, ...textStyle}}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.green,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  load: {
    width: 35,
    height: 35,
  },
});

export const AdaptiveButton = memo(AdaptiveButtonComponent);
