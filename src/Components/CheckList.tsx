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
  selectedItem: number | null;
  setSelectedItem: Dispatch<SetStateAction<number | null>> | (() => void);
};

const CheckLIstComponent = ({
  jobData,
  selectedItem,
  setSelectedItem,
}: CheckLIstProps) => {
  const {width} = useWindowDimensions();
  const itemWidth = width / 2 - 25;

  const selectItem = useCallback(
    (index: number) => {
      setSelectedItem((prevSelected: number | null) =>
        prevSelected === index ? null : index,
      );
    },
    [setSelectedItem],
  );

  const renderItem = ({item, index}: {item: DataType; index: number}) => {
    return (
      <Pressable
        onPress={() => selectItem(index)}
        style={[
          styles.renderItem,
          {
            width: itemWidth,
            backgroundColor:
              index === selectedItem ? Colors.lightBlue : Colors.gray,
          },
        ]}>
        <Text
          style={[
            styles.renderItemText,
            {color: index === selectedItem ? Colors.white : Colors.black},
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
        {jobData.map((item, index) => (
          <View key={item.id}>{renderItem({item, index})}</View>
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
  },
  renderItemText: {
    textAlign: 'center',
    fontSize: 13,
  },
});
export const CheckList = memo(CheckLIstComponent);
