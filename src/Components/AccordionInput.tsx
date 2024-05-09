import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../Includes/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

export type DataType = {
  name: string;
  id: string;
};

type AccordionInputProps = {
  label?: string;
  placeholder: string;
  data: DataType[];
  value: DataType;
  setValue: (data: DataType) => void;
  error: boolean;
};

const RenderItem = ({
  item,
  onPress,
}: {
  item: DataType;
  index: number;
  onPress: (item: DataType) => void;
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.renderItem}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
};

const AccordionInputComponent = ({
  label,
  placeholder,
  data,
  value,
  setValue,
  error,
}: AccordionInputProps) => {
  const flatListHeight = useSharedValue(0);
  const flatListMargin = useSharedValue(0);
  const rotateAngle = useSharedValue('0deg');

  const onPress = (item: DataType) => {
    setValue(item);
    toggleHeight();
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

  const heightNumber = data.length > 4 ? 300 : 200;

  const toggleHeight = () => {
    flatListHeight.value = flatListHeight.value === 0 ? heightNumber : 0;
    flatListMargin.value = flatListMargin.value === 0 ? 10 : 0;
    toggleAngle();
  };

  const toggleAngle = () => {
    rotateAngle.value = rotateAngle.value === '0deg' ? '180deg' : '0deg';
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={{
          ...styles.touchableOpacity,
          ...{
            borderColor: error ? Colors.red : 'transparent',
          },
        }}
        onPress={toggleHeight}>
        <Text
          style={{
            ...styles.input,
            ...{
              color: value.name ? Colors.dark : Colors.darkGray,
            },
          }}>
          {value.name ? value.name : placeholder}
        </Text>
        <AnimatedFontAwesome
          name={'angle-down'}
          style={[styles.angleDown, angleStyle]}
          size={28}
        />
      </TouchableOpacity>
      <Animated.ScrollView
        style={[styles.dropDown, flatListHeightStyle]}
        nestedScrollEnabled={true}
        bounces={false}
        scrollEventThrottle={16}>
        {data.map((item, index) => {
          return (
            <RenderItem
              item={item}
              index={index}
              onPress={onPress}
              key={index}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.darker,
  },
  touchableOpacity: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: Colors.gray,
    borderRadius: 8,
    borderWidth: 1,
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 20,
  },
  angleDown: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  dropDown: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.gray,
  },
  renderItem: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
});

export const AccordionInput = memo(AccordionInputComponent);
