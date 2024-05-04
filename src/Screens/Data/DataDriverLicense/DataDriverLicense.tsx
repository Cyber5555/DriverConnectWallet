/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Text,
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
import {authUserInfoRequest} from '../../Home/authUserInfoSlice';

const currentYear = new Date().getFullYear();
const yearsCount = 70;

const dataYear: DataType[] = Array.from({length: yearsCount}, (_, index) => {
  const year = currentYear - index;
  return {name: String(year), id: String(Math.random() * 10)};
});

const DataDriverLicenseComponent = () => {
  const {token, registerData, addRegisterData} = useAuth();
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
    dispatch(driverLicenseCountryRequest({token}));
  }, [dispatch, token]);

  useEffect(() => {
    // Convert date strings to Date objects
    setDateFirst(
      typeof driver_license_expiry_date === 'string'
        ? moment(driver_license_expiry_date, 'YYYY-MM-DD').toDate()
        : driver_license_expiry_date,
    );

    setDateSecond(
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
      year,
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
    if (!disableButton) {
      const formattedBirthDate = registerData?.birth_date
        ? moment(registerData.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD')
        : null;

      dispatch(
        createAccountRequest({
          token,
          birth_date: formattedBirthDate?.toString(),
          country_id: region?.id,
          driver_license_experience_total_since_date: Number(year.name),
          driver_license_expiry_date: moment(dateFirst).format('YYYY-MM-DD'),
          driver_license_issue_date: moment(dateFirst).format('YYYY-MM-DD'),
          driver_license_number: licenseNumber,
          job_category_id: registerData?.job_category_id,
          person_full_name_first_name:
            registerData?.person_full_name_first_name,
          person_full_name_last_name: registerData?.person_full_name_last_name,
          person_full_name_middle_name:
            registerData?.person_full_name_middle_name,
          region_id: registerData?.region_id,
          scanning_person_full_name_first_name,
          scanning_person_full_name_last_name,
          scanning_person_full_name_middle_name,
        }),
      ).then((result: any) => {
        if (result.payload.status) {
          dispatch(authUserInfoRequest({token})).then((res: any) => {
            if (res.payload.status) {
              navigation.navigate('ScannerHomeTechnical');
            }
          });
        }
      });
    }
  }, [
    dateFirst,
    disableButton,
    dispatch,
    licenseNumber,
    navigation,
    region?.id,
    registerData?.birth_date,
    registerData?.job_category_id,
    registerData?.person_full_name_first_name,
    registerData?.person_full_name_last_name,
    registerData?.person_full_name_middle_name,
    registerData?.region_id,
    scanning_person_full_name_first_name,
    scanning_person_full_name_last_name,
    scanning_person_full_name_middle_name,
    token,
    year.name,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'ios' ? insets.top : 20},
      ]}>
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
        <Text style={styles.pageTitle}>
          Регистрация в агрегаторе: Данные водительского удостоверения
        </Text>
        <DefaultInput
          onChangeText={text => setLicenseNumber(text)}
          placeholder={'6636747474774'}
          value={licenseNumber}
          keyboardType={'number-pad'}
        />
        <DateInput
          label={'Дата выдачи ВУ'}
          placeholder={'19.03.2015'}
          date={dateFirst}
          setDate={setDateFirst}
        />
        <DateInput
          label={'ВУ действительны до'}
          placeholder={'19.03.2025'}
          date={dateSecond}
          setDate={setDateSecond}
        />

        <AccordionInput
          label={'Страна выдачи ВУ'}
          placeholder={'Не указан'}
          data={driverLicenseCountryData}
          setValue={text => {
            setRegion(text);
            const userData: User = {
              country_id: region?.id,
            };
            addRegisterData(userData);
          }}
          value={region || {name: '', id: ''}}
        />
        <AccordionInput
          placeholder={'2024'}
          data={dataYear}
          setValue={text => setYear(text)}
          value={year || {name: '', id: ''}}
          label={'Стаж с'}
        />

        <AdaptiveButton
          disabled={disableButton}
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
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 20,
  },
});

export const DataDriverLicense = memo(DataDriverLicenseComponent);
