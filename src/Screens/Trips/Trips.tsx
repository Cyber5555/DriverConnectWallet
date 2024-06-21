import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RegularText} from '../../Includes/RegularText';
import {BoldText} from '../../Includes/BoldText';
import Colors from '../../Includes/Colors';
import {PaymentTypeButton} from '../../Components/PaymentTypeButton';
import {MediumText} from '../../Includes/MediumText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Charter} from '../../Components/Charter';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {
  clearData,
  getOrderHistoryRequest,
  incrementCurrentPage,
} from './getOrderHistorySlice';
import {useAuth} from '../../Context/AuthContext';
import LoaderKit from 'react-native-loader-kit';

type TripsDataType = {
  yandex_id: string;
  car_name_date: string;
  car_number: string;
  job_start_time: string;
  job_start_date: string;
  payment_type: string;
  payment_type_show_name: string;
  address: {
    id: string;
    address: string;
  }[];
  work_time: string;
  work_price_in_minute: string;
  work_km: string;
  price_in_km: string;
  work_price: string;
  work_fee: string;
  work_price_minus_fee: string;
  start_address: string | null;
};

const TripsComponent = () => {
  const {authUser} = useAuth();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const {current_page, get_order_history, next_page_url, loading} = useSelector(
    (state: RootState) => state.getOrderHistorySlice,
  );

  const getOrderHistoryFirst = useCallback(() => {
    dispatch(getOrderHistoryRequest({token: authUser?.token, current_page: 1}));
  }, [authUser?.token, dispatch]);

  const handlePagination = useCallback(() => {
    if (next_page_url) {
      dispatch(incrementCurrentPage());
      dispatch(
        getOrderHistoryRequest({
          token: authUser?.token,
          current_page: current_page + 1,
        }),
      );
    }
  }, [authUser?.token, current_page, dispatch, next_page_url]);

  useEffect(() => {
    getOrderHistoryFirst();
  }, [getOrderHistoryFirst]);

  const handleRefresh = () => {
    dispatch(clearData());
    setRefreshing(true);
    getOrderHistoryFirst();
    setTimeout(() => setRefreshing(false), 1000);
  };

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

  const toggleExpand = (yandex_id: string) => {
    setExpandedItems(prevState =>
      prevState.includes(yandex_id)
        ? prevState.filter(item => item !== yandex_id)
        : [...prevState, yandex_id],
    );
  };

  const renderItem = ({item}: {item: TripsDataType}) => {
    return (
      <View style={styles.renderContainer}>
        <TouchableOpacity
          style={styles.renderItemHeader}
          activeOpacity={0.5}
          onPress={() => toggleExpand(item.yandex_id)}>
          <View style={styles.leftWrapper}>
            <PaymentTypeButton>
              {item.payment_type === 'cashless' ? (
                <FontAwesome
                  name={'credit-card'}
                  color={Colors.lightGreen}
                  size={20}
                />
              ) : (
                <MaterialCommunityIcons
                  name={'cash-multiple'}
                  color={Colors.lightGreen}
                  size={20}
                />
              )}
              <MediumText style={styles.textButton}>
                {item.payment_type_show_name}
              </MediumText>
            </PaymentTypeButton>
            {item.start_address && (
              <View style={styles.headerLocation}>
                <PaymentTypeButton>
                  <Entypo
                    name={'location-pin'}
                    color={Colors.lightGreen}
                    size={20}
                  />
                </PaymentTypeButton>
                <RegularText style={styles.textAddress} numberOfLines={1}>
                  {item.start_address}
                </RegularText>
              </View>
            )}
          </View>
          <View style={styles.rightWrapper}>
            <View style={styles.dateContainer}>
              <RegularText>{item.job_start_time}</RegularText>
              <RegularText>{item.job_start_date}</RegularText>
            </View>
            <Entypo
              name={'chevron-down'}
              size={24}
              style={{
                transform: [
                  {
                    rotateZ: expandedItems.includes(item.yandex_id)
                      ? '180deg'
                      : '0deg',
                  },
                ],
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.middleContainer}>
          {expandedItems.includes(item.yandex_id) && (
            // <View style={styles.carDataContainer}>
            //   <BoldText>{item.car_name_date}</BoldText>
            //   <RegularText>{item.car_number}</RegularText>
            // </View>
            <>
              {item.address.map(element => (
                <View style={styles.locations} key={element.id}>
                  <PaymentTypeButton>
                    <Entypo
                      name={'location-pin'}
                      color={Colors.lightGreen}
                      size={20}
                    />
                  </PaymentTypeButton>
                  <RegularText>{element.address}</RegularText>
                </View>
              ))}
              <View style={styles.tripsInfo}>
                <View style={styles.tripsWrapper}>
                  <MediumText style={styles.tripsTimeTitle}>Время</MediumText>
                  <BoldText>{item.work_time}</BoldText>
                  <RegularText>{item.work_price_in_minute}</RegularText>
                </View>
                <View style={styles.tripsWrapper}>
                  <MediumText style={styles.tripsTimeTitle}>
                    Расстояние
                  </MediumText>
                  <BoldText>{item.work_km}</BoldText>
                  <RegularText>{item.price_in_km}</RegularText>
                </View>
              </View>
            </>
          )}

          <View style={styles.footer}>
            <View style={styles.footerItems}>
              <MediumText style={styles.tripsTimeTitle}>Сумма</MediumText>
              <BoldText>{item.work_price}</BoldText>
            </View>
            <View style={styles.footerItems}>
              <MediumText style={styles.tripsTimeTitle}>Комиссии</MediumText>
              <BoldText>{item.work_fee}</BoldText>
            </View>
            <View style={styles.footerItemsLast}>
              <MediumText style={styles.tripsTimeTitle}>Доход</MediumText>
              <BoldText style={styles.income}>
                {item.work_price_minus_fee}
              </BoldText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <FlatList
        data={get_order_history}
        renderItem={renderItem}
        ListHeaderComponent={Charter}
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponent={loaderPagination}
        onEndReached={handlePagination}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 5,
  },
  contentContainerStyle: {
    gap: 5,
    paddingHorizontal: 20,
  },
  renderContainer: {
    width: '100%',
    borderBottomWidth: 4,
    borderBottomColor: Colors.gray,
  },
  renderItemHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
  },
  carDataContainer: {
    justifyContent: 'center',
    gap: 5,
  },
  leftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '72%',
  },
  rightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateContainer: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.gray,
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  },
  middleContainer: {
    paddingVertical: 8,
  },
  textButton: {
    color: Colors.lightGreen,
    fontSize: 14,
  },
  textAddress: {
    width: '62%',
  },
  headerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locations: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripsInfo: {
    flexDirection: 'row',
    marginTop: 30,
  },
  tripsWrapper: {
    flex: 1,
    gap: 5,
  },
  tripsTimeTitle: {
    color: Colors.darkGray,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: Colors.gray,
    paddingVertical: 8,
    justifyContent: 'space-between',
    height: 70,
    marginTop: 10,
  },
  footerItems: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    gap: 5,
  },
  footerItemsLast: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    gap: 5,
  },
  income: {
    color: Colors.lightRed,
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

export const Trips = memo(TripsComponent);
