import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Linking,
  RefreshControl,
} from 'react-native';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {MoneyButton} from '../../Components/MoneyButton';
import {WhatsAppIcon} from '../../Includes/configIcons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {BoldText} from '../../Includes/BoldText';
import {RegularText} from '../../Includes/RegularText';
import {MediumText} from '../../Includes/MediumText';
import {socialDataRequest} from '../Auth/Login/socialDataSlice';
import {
  clearData,
  getBalanceHistoryRequest,
  incrementCurrentPage,
} from './getBalanceHistorySlice';
import {useAuth} from '../../Context/AuthContext';
import moment from 'moment';
import LoaderKit from 'react-native-loader-kit';

type DataType = {
  title: string;
  payment_method: string;
  price: string;
  date: string;
  color: string;
};

const RenderItem = ({item}: {item: DataType}) => {
  return (
    <View style={styles.renderItem}>
      <View style={styles.renderItemWrapperFirst}>
        <RegularText style={styles.renderItemTitle}>{item.title}</RegularText>
      </View>
      <View style={styles.renderItemWrapperSecond}>
        <MediumText style={{...styles.renderItemPrice, ...{color: item.color}}}>
          {item.price} ₽
        </MediumText>
        <RegularText style={styles.renderItemDate}>
          {moment(new Date(item.date)).format('DD.MM.YYYY')}
        </RegularText>
      </View>
    </View>
  );
};

const HomeComponent = () => {
  const insets = useSafeAreaInsets();
  const {authUser} = useAuth();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {balance} = useSelector((state: RootState) => state.authUserInfoSlice);
  const {telegram, whatsApp} = useSelector(
    (state: RootState) => state.socialDataSlice,
  );
  const {get_balance_history, current_page, next_page_url, loading} =
    useSelector((state: RootState) => state.getBalanceHistorySlice);

  const linkToTelegram = useCallback(() => {
    Linking.openURL(telegram);
  }, [telegram]);

  const linkToWhatsApp = useCallback(() => {
    Linking.openURL(whatsApp);
  }, [whatsApp]);

  const getBalanceHistoryFirst = useCallback(() => {
    dispatch(
      getBalanceHistoryRequest({token: authUser?.token, current_page: 1}),
    );
  }, [authUser?.token, dispatch]);

  useEffect(() => {
    dispatch(socialDataRequest());
    getBalanceHistoryFirst();
  }, [dispatch, getBalanceHistoryFirst]);

  const handlePagination = useCallback(() => {
    if (next_page_url) {
      dispatch(incrementCurrentPage());
      dispatch(
        getBalanceHistoryRequest({
          token: authUser?.token,
          current_page: current_page + 1,
        }),
      );
    }
  }, [authUser?.token, current_page, dispatch, next_page_url]);

  const loaderPagination = () => {
    return loading && !refreshing ? (
      <View style={styles.loaderPagination}>
        <LoaderKit
          style={styles.load}
          name={'BallSpinFadeLoader'}
          color={Colors.black}
        />
      </View>
    ) : null;
  };

  const handleRefresh = () => {
    dispatch(clearData());
    setRefreshing(true);
    getBalanceHistoryFirst();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{...styles.container, paddingTop: insets.top}}>
      <StatusBar animated={true} translucent={true} barStyle={'dark-content'} />

      <View style={styles.headerBar}>
        <View style={styles.empty} />
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
        {balance !== undefined ? balance.toFixed(0) + ' ₽' : '0 ₽'}
      </RegularText>

      <View style={styles.buttons}>
        <MoneyButton iconType={'Input'} />
        <MoneyButton iconType={'OutPut'} />
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={get_balance_history}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) => <RenderItem item={item} />}
          ListFooterComponent={loaderPagination}
          onEndReached={handlePagination}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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
  empty: {
    width: 50,
  },
  flatListContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  renderItemWrapperFirst: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '65%',
  },
  renderItemWrapperSecond: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '35%',
  },
  renderItemTitle: {
    color: Colors.dark,
    fontSize: 18,
  },
  renderItemPrice: {
    color: Colors.dark,
    fontSize: 18,
  },
  renderItemDate: {
    fontSize: 13,
    color: Colors.darkGray,
  },
  load: {
    width: 35,
    height: 35,
  },
  loaderPagination: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
});

export const Home = memo(HomeComponent);
