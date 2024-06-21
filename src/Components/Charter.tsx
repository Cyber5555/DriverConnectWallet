import React, {memo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import Colors from '../Includes/Colors';

const CharterComponent = () => {
  const {charter} = useSelector(
    (state: RootState) => state.getOrderHistorySlice,
  );

  const date = charter.map(item => item.date);
  const colors = charter.map(() => () => Colors.lightBlue);
  const sum = charter.map(item => (!isNaN(item.sum) ? item.sum : '0'));

  return (
    <View>
      <BarChart
        data={{
          labels: date,
          datasets: [
            {
              data: sum,
              colors: colors,
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
          // decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          backgroundGradientFromOpacity: 1,
          backgroundGradientToOpacity: 1,
          barRadius: 0,
          barPercentage: 1,
          style: {
            borderRadius: 16,
          },
        }}
        showValuesOnTopOfBars={true}
        showBarTops={false}
        style={styles.chart}
        withInnerLines={true}
        withCustomBarColorFromData={true}
        flatColor={true}
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
