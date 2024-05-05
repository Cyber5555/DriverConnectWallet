/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DefaultInput} from '../../../Components/DefaultInput';
import {DateInput} from '../../../Components/DateInput';
import {AccordionInput, DataType} from '../../../Components/AccordionInput';
import {CheckList} from '../../../Components/CheckList';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '../../../Router/RootNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Colors from '../../../Includes/Colors';
import {AdaptiveButton} from '../../../Components/AdaptiveButton';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {getJobCategoryRequest} from './getJobCategorySlice';
import {User, useAuth} from '../../../Context/AuthContext';
import {regionRequest} from './regionSlice';
import {createAccountRequest} from '../../Data/DataDriverLicense/createAccountSlice';
import moment from 'moment';
import {SuccessAuthModal} from '../../../Components/SuccessAuthModal';

const RegisterComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const {authUser, login} = useAuth();
  const {jobData} = useSelector(
    (state: RootState) => state.getJobCategorySlice,
  );
  const {regionData} = useSelector((state: RootState) => state.regionSlice);
  const {loading} = useSelector((state: RootState) => state.createAccountSlice);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>();
  const [region, setRegion] = useState<DataType>({name: '', id: ''});
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [inputData, setInputData] = useState({
    name: '',
    surName: '',
    fatherName: '',
  });

  const handleTextChange = (text: string | {}, fieldName: string) => {
    setInputData({...inputData, [fieldName]: text});
  };

  useEffect(() => {
    dispatch(getJobCategoryRequest({authUser}));
    dispatch(regionRequest({authUser}));
  }, [authUser, dispatch]);

  useEffect(() => {
    const distractValues = {
      name: inputData.name,
      surname: inputData.surName,
      fatherName: inputData.fatherName,
      region: region,
      jobType: selectedItem,
      date: date,
    };
    const allValuesNotEmpty = Object.values(distractValues).every(
      item => item !== undefined && item !== null && item !== '',
    );

    if (allValuesNotEmpty) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [inputData, selectedItem, date, region]);

  const onSaveData = useCallback(() => {
    const userData: User = {
      birth_date: date,
      region_id: region?.id,
      job_category_id: selectedItem,
      person_full_name_first_name: inputData.name,
      person_full_name_last_name: inputData.surName,
      person_full_name_middle_name: inputData.fatherName,
    };
    login(userData);

    const formattedBirthDate = date
      ? moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
      : null;
    if (selectedItem === '3') {
      dispatch(
        createAccountRequest({
          authUser,
          birth_date: formattedBirthDate?.toString(),
          region_id: region?.id,
          job_category_id: selectedItem,
          person_full_name_first_name: inputData.name,
          person_full_name_last_name: inputData.surName,
          person_full_name_middle_name: inputData.fatherName,
        }),
      ).then((result: {payload: any}) => {
        if (result.payload.status) {
          setSuccessModal(true);
        }
      });
    } else {
      setTimeout(() => {
        navigation.navigate('ScannerHomeDriver');
      }, 1000);
    }
  }, [
    date,
    region?.id,
    selectedItem,
    inputData.name,
    inputData.surName,
    inputData.fatherName,
    login,
    dispatch,
    authUser,
    navigation,
  ]);

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'ios' ? insets.top : 20},
      ]}>
      {/* <AntDesign
        name={'arrowleft'}
        color={Colors.black}
        size={24}
        style={{marginTop: 20}}
        onPress={() => navigation.goBack()}
      /> */}
      <SuccessAuthModal
        visible={successModal}
        onPress={() => {
          setSuccessModal(false);
          navigation.navigate('Home');
        }}
      />
      <Text style={styles.pageTitle}>
        Регистрация в агрегаторе: Личные данные
      </Text>

      <ScrollView
        style={styles.scrollView}
        needsOffscreenAlphaCompositing={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <DefaultInput
            onChangeText={text => handleTextChange(text, 'name')}
            placeholder={'Имя'}
            value={inputData.name}
          />
          <DefaultInput
            onChangeText={text => handleTextChange(text, 'surName')}
            placeholder={'Фамилия'}
            value={inputData.surName}
          />
          <DefaultInput
            onChangeText={text => handleTextChange(text, 'fatherName')}
            placeholder={'Отчество'}
            value={inputData.fatherName}
          />
          <DateInput
            placeholder={'19.02.1999'}
            label={'Дата рождения'}
            date={date}
            setDate={setDate}
          />
          <AccordionInput
            label={'Регион'}
            placeholder={'Не указан'}
            data={regionData}
            setValue={text => setRegion(text)}
            value={region || {name: '', id: ''}}
          />
          <CheckList
            jobData={jobData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <AdaptiveButton
            onPress={onSaveData}
            loading={loading}
            disabled={disableButton || loading}
            containerStyle={{
              backgroundColor: disableButton ? '#319240aa' : Colors.green,
            }}>
            ДАЛЕЕ
          </AdaptiveButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontWeight: '400',
    fontSize: 19,
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
});

export const Register = memo(RegisterComponent);
