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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {getCarMarksRequest} from './getCarMarksSlice';
import {useAuth} from '../../../Context/AuthContext';
import {getCarModelRequest} from './getCarModelSlice';
import {carColorRequest} from './carColorSlice';
import {createNewCarRequest} from './createNewCarSlice';
import {authUserInfoRequest} from '../../Home/authUserInfoSlice';

type DataAutoProps = {};

const DataAutoComponent = ({}: DataAutoProps) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const {token, registerData} = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const {technical_data} = useSelector(
    (state: RootState) => state.sendTechnicalPassportSlice,
  );
  const {car_marks, loadingMarks} = useSelector(
    (state: RootState) => state.getCarMarksSlice,
  );
  const {car_color, loadingColors} = useSelector(
    (state: RootState) => state.carColorSlice,
  );
  const {car_model, loadingModels} = useSelector(
    (state: RootState) => state.getCarModelSlice,
  );
  const [carMarks, setCarMarks] = useState<DataType>({name: '', id: ''});
  const [carModels, setCarModels] = useState<DataType>({name: '', id: ''});
  const [colors, setColors] = useState<DataType>({name: '', id: ''});
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [inputData, setInputData] = useState({
    gnAuto: '',
    year: '',
    ctc: '',
    vin: '',
  });

  const handleTextChange = useCallback(
    (text: string | {}, fieldName: string) => {
      setInputData({...inputData, [fieldName]: text});
    },
    [inputData],
  );

  const initializeData = useCallback(() => {
    setInputData({
      gnAuto: technical_data.callsign,
      ctc: technical_data.licence_plate_number,
      year: technical_data.year,
      vin: technical_data.vin,
    });
  }, [technical_data]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const getModel = useCallback(
    (markItem: any) => {
      dispatch(getCarModelRequest({token, mark_id: markItem.id})).then(
        (resultModes: any) => {
          if (resultModes.payload.status) {
            const model = resultModes.payload.data;
            const modelItem: any = Object.values(model).find(
              (item: any) =>
                item?.name.toLowerCase() ===
                technical_data.model_name.toLowerCase(),
            );
            setCarModels(modelItem);
            dispatch(carColorRequest({token})).then((resultColor: any) => {
              if (resultColor.payload.status) {
                const color = resultColor.payload.data;
                const colorItem: any = Object.values(color).find(
                  (item: any) =>
                    item?.name.toLowerCase() ===
                    technical_data.color_name.toLowerCase(),
                );

                setColors(colorItem || {name: 'White', id: ''});
              }
            });
          }
        },
      );
    },
    [dispatch, technical_data.color_name, technical_data.model_name, token],
  );

  useEffect(() => {
    dispatch(getCarMarksRequest({token})).then((resultMarks: any) => {
      if (resultMarks.payload.status) {
        const mark = resultMarks.payload.data;

        const markItem: any = Object.values(mark).find(
          (item: any) =>
            item?.name.toLowerCase() === technical_data.mark_name.toLowerCase(),
        );

        if (markItem) {
          setCarMarks(markItem);
          getModel(markItem);
        }
      }
    });
  }, [dispatch, getModel, technical_data.mark_name, token]);

  useEffect(() => {
    if (token) {
      dispatch(getCarMarksRequest({token}));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (carMarks && technical_data) {
      getModel(carMarks);
    }
  }, [carMarks, getModel, technical_data]);

  useEffect(() => {
    const allValuesNotEmpty = Object.values({
      callsign: inputData.gnAuto,
      licence_plate_number: inputData.ctc,
      mark_name: carMarks.name,
      model_name: carModels.name,
      year: inputData.year,
      vin: inputData.vin,
      color_name: colors.name,
    }).every(item => item !== undefined && item !== null && item !== '');

    setDisableButton(!allValuesNotEmpty);
  }, [carMarks, carModels, colors, inputData, technical_data]);

  const createNewCar = useCallback(() => {
    const carData = {
      token,
      callsign: inputData.gnAuto,
      licence_plate_number: inputData.ctc,
      mark_name: carMarks.name,
      model_name: carModels.name,
      year: Number(inputData.year),
      vin: technical_data.vin,
      color_name: colors.name,
      car_license_front_photo: registerData?.car_license_front_photo,
      car_license_back_photo: registerData?.car_license_back_photo,
    };

    dispatch(createNewCarRequest(carData)).then((result: any) => {
      if (result.payload.status) {
        dispatch(authUserInfoRequest({token})).then((res: any) => {
          if (res.payload.status) {
            navigation.navigate('Home');
          }
        });
      }
    });
  }, [
    token,
    inputData.gnAuto,
    inputData.ctc,
    inputData.year,
    carMarks.name,
    carModels.name,
    technical_data.vin,
    colors.name,
    registerData?.car_license_front_photo,
    registerData?.car_license_back_photo,
    dispatch,
    navigation,
  ]);

  const buttonContainerStyle = disableButton
    ? {backgroundColor: '#319240aa'}
    : {backgroundColor: Colors.green};

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
          Регистрация в агрегаторе: Данные авто
        </Text>
        <DefaultInput
          onChangeText={text => handleTextChange(text, 'gnAuto')}
          placeholder={'ГН авто'}
          value={inputData?.gnAuto}
        />
        <AccordionInput
          label={'Марка'}
          placeholder={'Не указан'}
          data={car_marks}
          value={carMarks}
          setValue={text => setCarMarks(text)}
        />
        <AccordionInput
          label={'Модель'}
          placeholder={'Не указан'}
          data={car_model}
          value={carModels}
          setValue={text => setCarModels(text)}
        />
        <DefaultInput
          onChangeText={text => handleTextChange(text, 'year')}
          placeholder={'Год выпуска'}
          value={inputData?.year}
        />
        <AccordionInput
          label={'Цвет'}
          placeholder={'Не указан'}
          data={car_color}
          value={colors}
          setValue={text => setColors(text)}
        />
        <DefaultInput
          onChangeText={text => handleTextChange(text, 'ctc')}
          placeholder={'Номер СТС'}
          value={inputData?.ctc}
        />
        <DefaultInput
          onChangeText={text => handleTextChange(text, 'vin')}
          placeholder={'Номер VIN'}
          value={inputData?.vin}
        />
        <AdaptiveButton
          disabled={disableButton}
          loading={loadingMarks || loadingModels || loadingColors}
          containerStyle={{
            marginTop: 20,
            ...buttonContainerStyle,
          }}
          onPress={createNewCar}>
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

export const DataAuto = memo(DataAutoComponent);
