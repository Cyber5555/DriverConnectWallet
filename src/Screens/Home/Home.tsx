import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

type HomeProps = {};

const HomeComponent = ({}: HomeProps) => {
  return (
    <View style={styles.container}>
      <Text>Personal data is coming son</Text>
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

export const Home = memo(HomeComponent);
