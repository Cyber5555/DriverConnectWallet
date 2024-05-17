import React, {memo, useCallback, useEffect} from 'react';
import {View, StyleSheet, StatusBar, FlatList, Linking} from 'react-native';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MoneyButton} from '../../Components/MoneyButton';
import {WhatsAppIcon} from '../../Includes/configIcons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {BoldText} from '../../Includes/BoldText';
import {RegularText} from '../../Includes/RegularText';
import {MediumText} from '../../Includes/MediumText';
import {socialDataRequest} from '../Auth/Login/socialDataSlice';

type DataType = {
  process: string;
  message: string;
  price: string;
  date: string;
  id: string;
};

const data: DataType[] = [
  {
    process: 'Вывод средств',
    message: 'ждет подтвоождения парком',
    price: '-1500',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Бани, переводит деньги',
    price: '-1000',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Отправлено в бани получато',
    price: '15000',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'ждет подтвоождения парком',
    price: '22300',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Бани, переводит деньги',
    price: '1400',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Отправлено в бани получато',
    price: '-3000',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Бани, переводит деньги',
    price: '1400',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Отправлено в бани получато',
    price: '-3000',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Бани, переводит деньги',
    price: '1400',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
  {
    process: 'Вывод средств',
    message: 'Отправлено в бани получато',
    price: '-3000',
    date: '13.05.2024',
    id: String(Math.random() * 10),
  },
];

const RenderItem = ({item}: {item: DataType}) => {
  return (
    <View style={styles.renderItem}>
      <View style={styles.renderItemWrapper}>
        <RegularText style={styles.renderItemTitle}>{item.process}</RegularText>
        <MediumText style={styles.renderItemPrice}>{item.price} ₽</MediumText>
      </View>
      <View style={styles.renderItemWrapper}>
        <RegularText style={styles.renderItemMessage} numberOfLines={1}>
          {item.message}
        </RegularText>
        <RegularText style={styles.renderItemDate}>{item.date}</RegularText>
      </View>
    </View>
  );
};

const HomeComponent = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const {balance} = useSelector((state: RootState) => state.authUserInfoSlice);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const {telegram, whatsApp} = useSelector(
    (state: RootState) => state.socialDataSlice,
  );
  const linkToTelegram = useCallback(() => {
    Linking.openURL(telegram);
  }, [telegram]);

  const linkToWhatsApp = useCallback(() => {
    Linking.openURL(whatsApp);
  }, [whatsApp]);

  useEffect(() => {
    dispatch(socialDataRequest());
  }, [dispatch]);

  return (
    <View
      style={{
        ...styles.container,
        ...{paddingTop: insets.top},
      }}>
      <StatusBar animated={true} translucent={true} barStyle={'dark-content'} />

      <View style={styles.headerBar}>
        <AntDesign
          name={'user'}
          color={Colors.black}
          size={28}
          onPress={() => navigation.navigate('User')}
        />
        <BoldText style={styles.parkName}>Парк Grot</BoldText>
        <View style={styles.wrapperIcon}>
          <FontAwesome
            name={'telegram'}
            color={Colors.lightBlue}
            size={40}
            onPress={linkToTelegram}
          />
          <WhatsAppIcon width={50} height={50} onPress={linkToWhatsApp} />
        </View>
      </View>
      <RegularText style={styles.price}>
        {balance !== undefined ? balance.toFixed(0) + ' ₽' : 0 + ' ₽'}
      </RegularText>

      <View style={styles.buttons}>
        <MoneyButton iconType={'Input'} />
        <MoneyButton iconType={'OutPut'} />
      </View>
      <View
        style={{...styles.flatListContainer, ...{marginBottom: insets.bottom}}}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) => {
            return <RenderItem item={item} />;
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  parkName: {
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 30,
  },
  wrapperIcon: {
    alignItems: 'center',
  },
  price: {
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 25,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  flatListContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
  },
  renderItem: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    padding: 10,
    rowGap: 10,
  },
  renderItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  renderItemTitle: {
    color: Colors.dark,
    fontSize: 20,
  },
  renderItemPrice: {
    color: Colors.dark,
    fontSize: 18,
  },
  renderItemMessage: {
    fontSize: 13,
    color: Colors.darkGray,
    maxWidth: '70%',
  },
  renderItemDate: {
    fontSize: 13,
    color: Colors.darkGray,
  },
});

export const Home = memo(HomeComponent);
