/* eslint-disable react-native/no-inline-styles */
import React, {Dispatch, SetStateAction, memo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Colors from '../Includes/Colors';

type DataType = {
  name: string;
  id: number;
};

type CheckLIstProps = {
  jobData: DataType[];
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>> | (() => void);
  error: boolean;
};

const CheckLIstComponent = ({
  jobData,
  selectedItem,
  setSelectedItem,
  error,
}: CheckLIstProps) => {
  const {width} = useWindowDimensions();
  const itemWidth = width / 2 - 25;

  const selectItem = useCallback(
    (id: string) => {
      setSelectedItem((prevSelected: string) =>
        prevSelected === id ? '' : id,
      );
    },
    [setSelectedItem],
  );

  const renderItem = ({item}: {item: DataType}) => {
    return (
      <Pressable
        onPress={() => selectItem(item.id.toString())}
        style={[
          styles.renderItem,
          {
            width: itemWidth,
            backgroundColor:
              item.id.toString() === selectedItem
                ? Colors.lightBlue
                : Colors.gray,
            borderColor: error ? Colors.red : 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.renderItemText,
            {
              color:
                item.id.toString() === selectedItem
                  ? Colors.white
                  : Colors.black,
            },
          ]}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.checkListTitle}>Кем хотите стать?</Text>
      <View style={styles.checkListContainer}>
        {jobData.map(item => (
          <View key={item.id}>{renderItem({item})}</View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  checkListTitle: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.darker,
  },
  checkListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 5,
  },
  renderItem: {
    height: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  renderItemText: {
    textAlign: 'center',
    fontSize: 13,
  },
});
export const CheckList = memo(CheckLIstComponent);
