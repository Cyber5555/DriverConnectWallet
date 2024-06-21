import React, {SetStateAction, memo} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Colors from '../Includes/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RegularText} from '../Includes/RegularText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

export type DataTypeMultipleSelect = {
  show_name: string;
  id: string;
};

type MultipleSelectProps = {
  label?: string;
  placeholder: string;
  data: DataTypeMultipleSelect[];
  error: boolean;
  selectedItems: DataTypeMultipleSelect[];
  setSelectedItems: (item: SetStateAction<DataTypeMultipleSelect[]>) => void;
  leave: boolean;
  close?: boolean;
};

const RenderItem = ({
  item,
  handleToggle,
}: {
  item: DataTypeMultipleSelect;
  index: number;
  handleToggle: (item: DataTypeMultipleSelect) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => handleToggle(item)}
      style={styles.renderItem}>
      <RegularText>{item.show_name}</RegularText>
    </TouchableOpacity>
  );
};

const MultipleSelectComponent = ({
  label,
  placeholder,
  data,
  error,
  selectedItems,
  setSelectedItems,
  leave,
  close,
}: MultipleSelectProps) => {
  const flatListHeight = useSharedValue(0);
  const flatListMargin = useSharedValue(0);
  const rotateAngle = useSharedValue('0deg');

  const handleToggle = (item: DataTypeMultipleSelect) => {
    setSelectedItems(prevState =>
      prevState.some(selected => selected.id === item.id)
        ? prevState.filter(selected => selected.id !== item.id)
        : [...prevState, item],
    );
  };

  const flatListHeightStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(flatListHeight.value),
      marginTop: withTiming(flatListMargin.value),
    };
  });

  const angleStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: withTiming(rotateAngle.value)}],
    };
  });

  const heightNumber = 103;

  const toggleHeight = () => {
    flatListHeight.value = flatListHeight.value === 0 ? heightNumber : 0;
    flatListMargin.value = flatListMargin.value === 0 ? 10 : 0;
    toggleAngle();
  };

  const toggleAngle = () => {
    rotateAngle.value = rotateAngle.value === '0deg' ? '180deg' : '0deg';
  };

  if (!leave || !close) {
    flatListHeight.value = 0;
    flatListMargin.value = 0;
    rotateAngle.value = '0deg';
  }

  return (
    <View style={styles.container}>
      {label && <RegularText style={styles.label}>{label}</RegularText>}
      <TouchableOpacity
        style={{
          ...styles.touchableOpacity,
          ...{
            borderColor: error ? Colors.lightRed : 'transparent',
          },
        }}
        onPress={toggleHeight}>
        {selectedItems.length ? (
          selectedItems.map(item => (
            <View style={styles.selectedItem} key={item.id}>
              <RegularText style={styles.input}>{item.show_name}</RegularText>
              <AntDesign
                name={'close'}
                size={18}
                color={Colors.white}
                onPress={() => handleToggle(item)}
              />
            </View>
          ))
        ) : (
          <RegularText>{placeholder}</RegularText>
        )}
        <AnimatedFontAwesome
          name={'angle-down'}
          style={[styles.angleDown, angleStyle]}
          size={28}
        />
      </TouchableOpacity>
      <Animated.View style={[styles.shadowContainer, flatListHeightStyle]}>
        <ScrollView
          nestedScrollEnabled={true}
          bounces={false}
          scrollEventThrottle={16}>
          {data.map((item, index) => {
            return (
              <RenderItem
                item={item}
                index={index}
                handleToggle={handleToggle}
                key={item.id}
              />
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.darker,
  },
  touchableOpacity: {
    minHeight: 50,
    position: 'relative',
    backgroundColor: Colors.gray,
    borderRadius: 8,
    borderWidth: 1,
    paddingRight: 40,
    paddingLeft: 10,
    paddingVertical: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 15,
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.white,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: Colors.lightBlue,
  },
  angleDown: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  shadowContainer: {
    borderRadius: 8,
    backgroundColor: Colors.white,
    shadowColor: Colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  renderItem: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
});

export const MultipleSelect = memo(MultipleSelectComponent);
