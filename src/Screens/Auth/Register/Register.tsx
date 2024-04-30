/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DefaultInput} from '../../../Components/DefaultInput';
import {DateInput} from '../../../Components/DateInput';
import {AccordionInput} from '../../../Components/AccordionInput';
import {CheckList} from '../../../Components/CheckList';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '../../../Router/RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Colors from '../../../Includes/Colors';
import {AdaptiveButton} from '../../../Components/AdaptiveButton';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {getJobCategoryRequest} from './getJobCategorySlice';
import {User, useAuth} from '../../../Context/AuthContext';
import {regionRequest} from './regionSlice';

const RegisterComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const {token, addRegisterData} = useAuth();
  const {jobData} = useSelector(
    (state: RootState) => state.getJobCategorySlice,
  );
  const {regionData} = useSelector((state: RootState) => state.regionSlice);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [inputData, setInputData] = useState({
    name: '',
    surName: '',
    fatherName: '',
    region: '',
  });

  const handleTextChange = (text: string, fieldName: string) => {
    setInputData({...inputData, [fieldName]: text});
  };

  useEffect(() => {
    dispatch(getJobCategoryRequest({token}));
    dispatch(regionRequest({token}));
  }, [dispatch, token]);

  useEffect(() => {
    const distractValues = {
      name: inputData.name,
      surname: inputData.surName,
      fatherName: inputData.fatherName,
      region: inputData.region,
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
  }, [inputData, selectedItem, date]);

  const onSaveData = useCallback(() => {
    const distractValues = {
      name: inputData.name,
      surname: inputData.surName,
      fatherName: inputData.fatherName,
      region: inputData.region,
      jobType: selectedItem,
      date: date,
    };

    const registerValue: User = {registerData: distractValues};
    addRegisterData(registerValue);
    navigation.navigate('ScannerHome');
  }, [
    addRegisterData,
    date,
    inputData.fatherName,
    inputData.name,
    inputData.region,
    inputData.surName,
    navigation,
    selectedItem,
  ]);

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'ios' ? insets.top : 20},
      ]}>
      <AntDesign
        name={'arrowleft'}
        color={Colors.black}
        size={24}
        style={{marginTop: 20}}
        onPress={() => navigation.goBack()}
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
            placeholder={'Москва и Московская область'}
            data={regionData}
            setValue={text => handleTextChange(text, 'region')}
            value={inputData.region}
          />
          <CheckList
            jobData={jobData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <AdaptiveButton
            onPress={onSaveData}
            disabled={disableButton}
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
    marginTop: 10,
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
