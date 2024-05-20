import React, {memo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const CharterComponent = () => {
  return (
    <View>
      <BarChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#fbfbfb',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          backgroundGradientFromOpacity: 1,
          backgroundGradientToOpacity: 1,
          propsForBackgroundLines: {},
          style: {
            borderRadius: 16,
          },
          // propsForHorizontalLabels: {
          //   strokeWidth: '2',
          //   stroke: '#ffffff',
          // },
          // propsForDots: {
          //   r: '6',
          //   strokeWidth: '2',
          //   stroke: '#ffffff',
          // },
        }}
        // bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    flex: 1,
  },
});

export const Charter = memo(CharterComponent);
