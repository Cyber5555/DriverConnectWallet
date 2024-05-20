/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  HomeStack,
  PaymentsStack,
  ProfileStack,
  TripsStack,
} from './RouteGroupe';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../Includes/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RegularText} from '../Includes/RegularText';

const Tab = createBottomTabNavigator();

type TabNavigatorProps = {
  HomeStack: undefined;
  ProfileStack: undefined;
  TripsStack: undefined;
  PaymentsStack: undefined;
};

type CustomIconProps = {
  name: string;
  size?: number;
  color?: string;
  library?: 'Entypo' | 'AntDesign' | 'MaterialIcons';
};

type TabScreenListType = {
  name: keyof TabNavigatorProps;
  component: React.ComponentType<any>;
  icon: CustomIconProps;
  label: string;
};

const TabScreenList: TabScreenListType[] = [
  {
    name: 'HomeStack',
    component: HomeStack,
    icon: {name: 'home', library: 'Entypo'},
    label: 'главная',
  },
  {
    name: 'TripsStack',
    component: TripsStack,
    icon: {name: 'mode-of-travel', library: 'MaterialIcons'},
    label: 'поездки',
  },
  {
    name: 'PaymentsStack',
    component: PaymentsStack,
    icon: {name: 'payments', library: 'MaterialIcons'},
    label: 'выплаты',
  },
  {
    name: 'ProfileStack',
    component: ProfileStack,
    icon: {name: 'user', library: 'AntDesign'},
    label: 'профиль',
  },
];

const IconComponent = ({library, name, color, size}: CustomIconProps) => {
  const IconMap = {
    Entypo: Entypo,
    AntDesign: AntDesign,
    MaterialIcons: MaterialIcons,
  };

  const Icon = IconMap[library || 'Entypo'];
  return <Icon name={name} color={color} size={size} />;
};

const TabBarButton = ({item, onPress, accessibilityState}: any) => {
  const animatedRotate = useSharedValue('0deg');
  const animatedScale = useSharedValue(1);
  const focused = accessibilityState.selected;

  useEffect(() => {
    animatedRotate.value = withTiming(focused ? '395deg' : '0deg');
    animatedScale.value = withTiming(focused ? 1.3 : 1);
  }, [animatedRotate, animatedScale, focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: animatedRotate.value}, {scale: animatedScale.value}],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animated.View style={animatedStyle}>
        <IconComponent
          library={item.icon.library}
          name={item.icon.name}
          color={focused ? Colors.lightBlue : Colors.dark}
          size={24}
        />
      </Animated.View>
      <RegularText
        style={{
          ...styles.label,
          ...{color: focused ? Colors.lightBlue : Colors.dark},
        }}>
        {item.label}
      </RegularText>
    </TouchableOpacity>
  );
};

const TabBar = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarHideOnKeyboard: true,
    }}>
    {TabScreenList.map((item, index) => (
      <Tab.Screen
        name={item.name}
        component={item.component}
        key={index}
        options={{
          tabBarButton: props => <TabBarButton {...props} item={item} />,
        }}
      />
    ))}
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.white,
    height: 75,
    borderTopWidth: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: Colors.dark,
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    gap: 3,
  },
  label: {
    textTransform: 'capitalize',
  },
});

export {TabBar};
