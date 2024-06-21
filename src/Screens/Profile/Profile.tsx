import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {useAuth} from '../../Context/AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Http} from '../../../http';
import Colors from '../../Includes/Colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RegularText} from '../../Includes/RegularText';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {LoginInput} from '../../Components/LoginInput';
import {AdaptiveButton} from '../../Components/AdaptiveButton';
import RenderHTML from 'react-native-render-html';
import {getFAQRequest} from './getFAQSlice';
import {
  DataTypeMultipleSelect,
  MultipleSelect,
} from '../../Components/MultipleSelect';
import {ChooseTariff} from '../../Components/ChooseTariff';
import {DataType} from '../../Components/AccordionInput';
import {getTariffAndOptionRequest} from './getTariffAndOptionSlice';
import {updateTariffAndOptionsRequest} from './updateTariffAndOptionsSlice';
import {ChangePhoneNumber} from '../../Components/ChangePhoneNumber';
import {showMessage} from 'react-native-flash-message';

type ProfileProps = {};

const ProfileComponent = ({}: ProfileProps) => {
  const {logout, authUser} = useAuth();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const {width} = useWindowDimensions();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalPhone, setIsOpenModalPhone] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [closeMultipleSelect, setCloseMultipleSelect] = useState<boolean>(true);
  const {get_faq} = useSelector((state: RootState) => state.getFAQSlice);
  const {errorMessage} = useSelector(
    (state: RootState) => state.updatePhoneSlice,
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checked, setChecked] = useState<DataType[]>([]);
  const [selectedItems, setSelectedItems] = useState<DataTypeMultipleSelect[]>(
    [],
  );
  const {auth_user_info, auth_user_car_info} = useSelector(
    (state: RootState) => state.authUserInfoSlice,
  );
  const {get_options, get_this_user_options, get_this_user_tariffs} =
    useSelector((state: RootState) => state.getTariffAndOptionSlice);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  const logoutFunc = async () => {
    const response: {data: {status: boolean}} = await Http.get(
      `${process.env.API_URL}logout`,
      {
        Authorization: `Bearer ${authUser?.token}`,
      },
    );
    if (response.data.status) {
      logout();
    }
  };

  const deleteAccount = async () => {
    const response: {data: {status: boolean}} = await Http.post(
      `${process.env.API_URL}add_user_in_archive`,
      {
        Authorization: `Bearer ${authUser?.token}`,
      },
      {
        user_id: authUser?.user_id,
      },
    );
    if (response.data.status) {
      logout();
    }
  };

  const deleteAccountAsq = async () => {
    Alert.alert('Вы действительно хотите удалить свою учетную запись?', '', [
      {text: 'Да', onPress: deleteAccount, style: 'destructive'},
      {text: 'Отменить', style: 'cancel'},
    ]);
  };

  useEffect(() => {
    if (authUser?.token) {
      dispatch(getTariffAndOptionRequest({token: authUser.token}));
    }
  }, [authUser?.token, dispatch]);

  useEffect(() => {
    dispatch(getFAQRequest({token: authUser?.token}));
    setPhoneNumber(auth_user_info?.phone);
    setChecked(get_this_user_tariffs.map(el => el));
    setSelectedItems(get_this_user_options.map(el => el));
  }, [
    authUser?.token,
    auth_user_info,
    dispatch,
    get_this_user_options,
    get_this_user_tariffs,
  ]);

  const toggleExpand = (id: number) => {
    setExpandedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id],
    );
  };

  const updateTariffAndOptions = useCallback(() => {
    const tariffs = checked.map(el => el.id);
    const options = selectedItems.map(el => el.id);
    setCloseMultipleSelect(false);
    dispatch(
      updateTariffAndOptionsRequest({
        token: authUser?.token,
        updated: {options: options, tariffs: tariffs},
      }),
    )
      .unwrap()
      .then(res => {
        showMessage({
          message: res.message,
          animated: true,
          type: 'success',
          duration: 5000,
          icon: {
            icon: 'success',
            position: 'left',
            props: {},
          },
          style: {
            height: insets.top + 50,
            paddingTop: Platform.OS === 'android' ? insets.top + 10 : 10,
          },
        });
      })
      .catch(err => {
        showMessage({
          message: err.message,
          animated: true,
          type: 'danger',
          duration: 5000,
          icon: {
            icon: 'danger',
            position: 'left',
            props: {},
          },
          style: {
            height: insets.top + 50,
            paddingTop: Platform.OS === 'android' ? insets.top + 10 : 10,
          },
        });
      });
  }, [authUser?.token, checked, dispatch, insets.top, selectedItems]);

  return (
    <View
      style={{
        ...styles.container,
        ...{paddingTop: insets.top},
      }}>
      {authUser?.job_category_id === '3' ? null : (
        <ChooseTariff
          visible={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          checked={checked}
          setChecked={setChecked}
        />
      )}
      <ChangePhoneNumber
        visible={isOpenModalPhone}
        setIsOpenModalPhone={setIsOpenModalPhone}
        unmaskedPhone={phoneNumber}
      />
      <View style={styles.headerWrapper}>
        <AntDesign
          name={'edit'}
          color={Colors.black}
          size={28}
          onPress={() => navigation.navigate('ScannerHomeTechnical')}
        />
        <RegularText style={styles.name_surname}>
          {auth_user_info?.name} {auth_user_info?.surname}
        </RegularText>

        <AntDesign
          name={'logout'}
          color={Colors.black}
          size={28}
          onPress={logoutFunc}
        />
      </View>
      <ScrollView style={styles.faqAccordionContainer}>
        <View style={styles.wrapper}>
          {auth_user_car_info?.mark?.name ? (
            <RegularText style={styles.carData}>
              {auth_user_car_info?.color} {auth_user_car_info?.mark?.name}{' '}
              {auth_user_car_info?.model?.name}
            </RegularText>
          ) : null}

          {auth_user_car_info?.callsign ? (
            <RegularText style={styles.carNumber}>
              {auth_user_car_info?.callsign}
            </RegularText>
          ) : null}

          <LoginInput
            label={'Изменить номер телефона'}
            setUnmaskedPhone={text => setPhoneNumber(text)}
            setPhone={text => setPhoneNumber(text)}
            placeholder={'+x (xxx) xxx-xx-xx'}
            phone={phoneNumber}
            error={errorMessage === 'Этот номер телефона уже существует.'}
            containerStyle={styles.input}
            page={'profile'}
            setIsOpenModalPhone={setIsOpenModalPhone}
            authUserPhone={auth_user_info?.phone}
          />
          {errorMessage[0] !== '' && (
            <RegularText style={styles.error}>{errorMessage}</RegularText>
          )}
          {authUser?.job_category_id === '3' ? null : (
            <AdaptiveButton
              onPress={() => {
                setIsOpenModal(true);
              }}
              containerStyle={styles.buttons}>
              Выбирать тариф
            </AdaptiveButton>
          )}
          {authUser?.job_category_id === '3' ? null : (
            <>
              <MultipleSelect
                data={get_options}
                placeholder={'Выбрать'}
                error={false}
                label={'Добавьте опцию'}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                leave={isFocused}
                close={closeMultipleSelect}
              />
              <AdaptiveButton
                containerStyle={styles.button}
                onPress={updateTariffAndOptions}>
                Сохранить тарифы и опции
              </AdaptiveButton>
            </>
          )}
          {get_faq.map(item => (
            <View key={item.id} style={styles.accordionItem}>
              <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                style={styles.accordionHeader}>
                <RegularText style={styles.accordionHeaderText}>
                  {item.faq}
                </RegularText>
                <Entypo
                  name={'chevron-down'}
                  size={24}
                  style={{
                    transform: [
                      {
                        rotateZ: expandedItems.includes(item.id)
                          ? '180deg'
                          : '0deg',
                      },
                    ],
                  }}
                />
              </TouchableOpacity>
              {expandedItems.includes(item.id) && (
                <View style={styles.accordionContent}>
                  <RenderHTML
                    contentWidth={width}
                    source={{html: item.replay}}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        <AdaptiveButton
          onPress={deleteAccountAsq}
          containerStyle={styles.deleteAccount}>
          Удалить аккаунт
        </AdaptiveButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    backfaceVisibility: 'visible',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  name_surname: {
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 20,
  },
  carData: {
    color: Colors.dark,
    marginTop: 20,
    fontSize: 20,
  },
  carNumber: {
    color: Colors.dark,
    fontSize: 20,
  },
  input: {
    marginTop: 20,
  },
  deleteAccount: {
    width: '50%',
    height: 40,
    backgroundColor: Colors.lightRed,
    borderRadius: 20,
    marginBottom: 40,
  },
  accordionItem: {
    marginBottom: 10,
    marginTop: 20,
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    paddingHorizontal: 15,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    marginTop: 10,
  },
  faqAccordionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  wrapper: {
    minHeight: '90%',
  },
  buttons: {
    marginTop: 20,
  },
  error: {
    color: Colors.lightRed,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
});

export const Profile = memo(ProfileComponent);
