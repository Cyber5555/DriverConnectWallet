/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {RootNavigationProps} from '../../../Router/RootNavigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../../Includes/Colors';
import {AccordionInput, DataType} from '../../../Components/AccordionInput';
import {DefaultInput} from '../../../Components/DefaultInput';
import {AdaptiveButton} from '../../../Components/AdaptiveButton';
import {DateInput} from '../../../Components/DateInput';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {User, useAuth} from '../../../Context/AuthContext';
import {driverLicenseCountryRequest} from '../../ScannerDriverLicense/driverLicenseCountrySlice';
import {createAccountRequest} from './createAccountSlice';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {BoldText} from '../../../Includes/BoldText';

const currentYear = new Date().getFullYear();
const yearsCount = 70;

const dataYear: DataType[] = Array.from({length: yearsCount}, (_, index) => {
  const year = currentYear - index;
  return {name: String(year), id: String(Math.random() * 10)};
});

const DataDriverLicenseComponent = () => {
  const {authUser, login, loadUserData} = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const {driverLicenseCountryData} = useSelector(
    (state: RootState) => state.driverLicenseCountrySlice,
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const [dateFirst, setDateFirst] = useState<Date | undefined>();
  const [dateSecond, setDateSecond] = useState<Date | undefined>();
  const [region, setRegion] = useState<DataType>();
  const [year, setYear] = useState<DataType>({name: '', id: ''});
  const [licenseNumber, setLicenseNumber] = useState<string | any>('');
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [errorData, setErrorData] = useState({
    dateFirst: false,
    dateSecond: false,
    region: false,
    year: false,
    licenseNumber: false,
  });

  const {
    driver_license_issue_date,
    driver_license_expiry_date,
    driver_license_number,
    scanning_person_full_name_first_name,
    scanning_person_full_name_last_name,
    scanning_person_full_name_middle_name,
    loading,
  } = useSelector((state: RootState) => state.sendDriverLicenseSlice);

  useEffect(() => {
    dispatch(driverLicenseCountryRequest({authUser}));
  }, [authUser, dispatch]);

  useEffect(() => {
    // Convert date strings to Date objects
    setDateSecond(
      typeof driver_license_expiry_date === 'string'
        ? moment(driver_license_expiry_date, 'YYYY-MM-DD').toDate()
        : driver_license_expiry_date,
    );

    setDateFirst(
      typeof driver_license_issue_date === 'string'
        ? moment(driver_license_issue_date, 'YYYY-MM-DD').toDate()
        : driver_license_issue_date,
    );

    setLicenseNumber(driver_license_number);
  }, [
    driver_license_expiry_date,
    driver_license_issue_date,
    driver_license_number,
  ]);

  useEffect(() => {
    const distractValues = {
      dateFirst,
      dateSecond,
      region,
      year: year.name,
      licenseNumber,
    };
    const allValuesNotEmpty = Object.values(distractValues).every(
      item => item !== undefined && item !== null && item !== '',
    );

    if (allValuesNotEmpty) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [dateFirst, dateSecond, region, year, licenseNumber]);

  const sendData = useCallback(() => {
    const formattedBirthDate = authUser?.birth_date
      ? moment(authUser.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD')
      : null;

    setErrorData({
      dateFirst: !dateFirst,
      dateSecond: !dateSecond,
      region: !region?.name,
      year: year.name === '',
      licenseNumber: licenseNumber === '',
    });

    if (!disableButton) {
      dispatch(
        createAccountRequest({
          authUser,
          birth_date: formattedBirthDate?.toString(),
          country_id: region?.id,
          driver_license_experience_total_since_date: Number(year.name),
          driver_license_expiry_date: moment(dateFirst).format('YYYY-MM-DD'),
          driver_license_issue_date: moment(dateFirst).format('YYYY-MM-DD'),
          driver_license_number: licenseNumber,
          job_category_id: authUser?.job_category_id,
          person_full_name_first_name: authUser?.person_full_name_first_name,
          person_full_name_last_name: authUser?.person_full_name_last_name,
          person_full_name_middle_name: authUser?.person_full_name_middle_name,
          region_id: authUser?.region_id,
          scanning_person_full_name_first_name,
          scanning_person_full_name_last_name,
          scanning_person_full_name_middle_name,
        }),
      )
        .then((result: any) => {
          if (result.payload.status) {
            const userData: User = {
              country_id: region?.id,
              create_account_status: '1',
              add_car_status: '0',
            };
            login(userData);
            loadUserData(false);
          } else {
            showMessage({
              message: result.payload?.yandex_error?.message,
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
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [
    authUser,
    dateFirst,
    dateSecond,
    region?.name,
    region?.id,
    year.name,
    licenseNumber,
    disableButton,
    dispatch,
    scanning_person_full_name_first_name,
    scanning_person_full_name_last_name,
    scanning_person_full_name_middle_name,
    login,
    loadUserData,
    insets.top,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView
        style={styles.scrollView}
        needsOffscreenAlphaCompositing={false}
        showsVerticalScrollIndicator={false}>
        <AntDesign
          name={'arrowleft'}
          color={Colors.black}
          size={24}
          style={{marginTop: 20}}
          onPress={() => navigation.goBack()}
        />
        <BoldText style={styles.pageTitle}>
          Регистрация в агрегаторе: Данные водительского удостоверения
        </BoldText>
        <DefaultInput
          onChangeText={text => {
            setLicenseNumber(text);
            setErrorData({...errorData, licenseNumber: false});
          }}
          placeholder={'6636747474774'}
          value={licenseNumber}
          label={'Номер Докемента'}
          error={errorData.licenseNumber}
        />
        <DateInput
          label={'Дата выдачи ВУ'}
          placeholder={'19.03.2015'}
          date={dateFirst}
          error={errorData.dateFirst}
          setDate={val => {
            setDateFirst(val);
            setErrorData({...errorData, dateFirst: false});
          }}
          maximumDate={new Date(Date.now())}
          minimumDate={new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000)}
        />
        <DateInput
          label={'ВУ действительны до'}
          placeholder={'19.03.2025'}
          date={dateSecond}
          error={errorData.dateSecond}
          setDate={val => {
            setDateSecond(val);
            setErrorData({...errorData, dateSecond: false});
          }}
          minimumDate={new Date(Date.now())}
          maximumDate={new Date(Date.now() + 15 * 365 * 24 * 60 * 60 * 1000)}
        />

        <AccordionInput
          label={'Страна выдачи ВУ'}
          placeholder={'Не указан'}
          data={driverLicenseCountryData}
          setValue={text => {
            setRegion(text);
            setErrorData({...errorData, region: false});
          }}
          value={region || {name: '', id: ''}}
          error={errorData.region}
        />
        <AccordionInput
          placeholder={'2024'}
          data={dataYear}
          setValue={text => {
            setYear(text);
            setErrorData({...errorData, year: false});
          }}
          value={year || {name: '', id: ''}}
          label={'Стаж с'}
          error={errorData.year}
        />

        <AdaptiveButton
          loading={loading}
          containerStyle={{
            marginVertical: 20,
            backgroundColor: disableButton ? '#319240aa' : Colors.green,
          }}
          onPress={sendData}>
          ДАЛЕЕ
        </AdaptiveButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 17,
    marginTop: 10,
    marginBottom: 20,
  },
});

export const DataDriverLicense = memo(DataDriverLicenseComponent);
