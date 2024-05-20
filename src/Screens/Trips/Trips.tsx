import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Charter} from '../../Components/Charter';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type TripsProps = {};

const TripsComponent = ({}: TripsProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Text>Поездки is coming son</Text>
      <Charter />
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

export const Trips = memo(TripsComponent);
