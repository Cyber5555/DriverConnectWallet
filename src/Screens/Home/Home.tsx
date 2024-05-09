import React, {memo} from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList} from 'react-native';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MoneyButton} from '../../Components/MoneyButton';
import {WhatsAppIcon} from '../../Includes/configIcons';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';

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
        <Text style={styles.renderItemTitle}>{item.process}</Text>
        <Text style={styles.renderItemPrice}>{item.price} ₽</Text>
      </View>
      <View style={styles.renderItemWrapper}>
        <Text style={styles.renderItemMessage} numberOfLines={1}>
          {item.message}
        </Text>
        <Text style={styles.renderItemDate}>{item.date}</Text>
      </View>
    </View>
  );
};

const HomeComponent = () => {
  const insets = useSafeAreaInsets();
  const {auth_user_info, auth_user_car_info, balance} = useSelector(
    (state: RootState) => state.authUserInfoSlice,
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  return (
    <View
      style={{
        ...styles.container,
        ...{paddingTop: insets.top},
      }}>
      <StatusBar
        animated={true}
        translucent={true}
        barStyle={'light-content'}
      />
      <AntDesign
        name={'edit'}
        color={Colors.white}
        size={28}
        style={{...styles.edit, ...{top: insets.top + 25}}}
        onPress={() => navigation.navigate('ScannerHomeTechnical')}
      />
      <Text style={styles.parkName}>Парк Grot</Text>
      <Text style={styles.name_surname}>
        {auth_user_info?.name} {auth_user_info?.surname}
      </Text>
      {auth_user_car_info?.mark?.name ? (
        <Text style={styles.carData}>
          {auth_user_car_info?.color} {auth_user_car_info?.mark?.name}{' '}
          {auth_user_car_info?.model?.name} {auth_user_car_info?.callsign}
        </Text>
      ) : null}

      <Text style={styles.price}>
        {balance !== undefined ? balance.toFixed(0) + ' ₽' : 0 + ' ₽'}
      </Text>

      <View>
        <View style={styles.wrapperIcons}>
          <FontAwesome
            name={'telegram'}
            color={Colors.lightBlue}
            size={50}
            // onPress={linkToTelegram}
          />
          <WhatsAppIcon
            width={50}
            height={50}
            // onPress={linkToWhatsApp}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <MoneyButton iconType={'Input'} />
        <MoneyButton iconType={'OutPut'} />
      </View>
      <View
        style={{
          ...styles.flatListContainer,
          ...{marginBottom: insets.bottom},
        }}>
        <FlatList
          data={data}
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
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  parkName: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 30,
  },
  name_surname: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
  carData: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
  price: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 25,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  wrapperIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 30,
    marginTop: 20,
  },
  flatListContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  renderItem: {
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBlockColor: Colors.gray,
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
    fontWeight: '500',
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
  edit: {
    position: 'absolute',
    right: 10,
  },
});

export const Home = memo(HomeComponent);
