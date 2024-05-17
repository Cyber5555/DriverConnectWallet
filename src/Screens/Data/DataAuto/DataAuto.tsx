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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {getCarMarksRequest} from './getCarMarksSlice';
import {useAuth} from '../../../Context/AuthContext';
import {getCarModelRequest} from './getCarModelSlice';
import {carColorRequest} from './carColorSlice';
import {createNewCarRequest} from './createNewCarSlice';
import {SuccessAuthModal} from '../../../Components/SuccessAuthModal';
import {showMessage} from 'react-native-flash-message';
import {BoldText} from '../../../Includes/BoldText';

const currentYear = new Date().getFullYear();
const yearsCount = 30;

const dataYear: DataType[] = Array.from({length: yearsCount}, (_, index) => {
  const year = currentYear - index;
  return {name: String(year), id: String(Math.random() * 10)};
});

const DataAutoComponent = () => {
  const insets = useSafeAreaInsets();
  const {loadUserData, authUser} = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [successModal, setSuccessModal] = useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  const {technical_data, loading} = useSelector(
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
    year: {name: '', id: ''},
    ctc: '',
    vin: '',
  });
  const [errorData, setErrorData] = useState({
    gnAuto: false,
    year: false,
    ctc: false,
    vin: false,
    colors: false,
    carModels: false,
    carMarks: false,
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
      year: {name: technical_data.year, id: String(Math.random() * 10)},
      vin: technical_data.vin,
    });
  }, [technical_data]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const getModel = useCallback(
    (markItem: any) => {
      dispatch(getCarModelRequest({authUser, mark_id: markItem.id})).then(
        (resultModes: any) => {
          if (resultModes.payload.status) {
            const model = resultModes.payload.data;
            const modelItem: any = Object.values(model).find(
              (item: any) =>
                item?.name.toLowerCase() ===
                technical_data.model_name.toLowerCase(),
            );

            setCarModels(modelItem !== undefined && modelItem);
          }
          dispatch(carColorRequest({authUser})).then((resultColor: any) => {
            if (resultColor.payload.status) {
              const color = resultColor.payload.data;
              const colorItem: any = Object.values(color).find(
                (item: any) =>
                  item?.name.toLowerCase() ===
                  technical_data.color_name.toLowerCase(),
              );

              setColors(colorItem || {name: 'Белый', id: ''});
            }
          });
        },
      );
    },
    [authUser, dispatch, technical_data.color_name, technical_data.model_name],
  );

  useEffect(() => {
    dispatch(getCarMarksRequest({authUser})).then((resultMarks: any) => {
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
  }, [authUser, dispatch, getModel, technical_data.mark_name]);

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
  }, [carMarks, carModels, colors, inputData, insets.top, technical_data]);

  const createNewCar = useCallback(() => {
    setErrorData({
      carMarks: !carMarks.name,
      carModels: !carModels.name,
      colors: !colors.name,
      ctc: !inputData.ctc,
      gnAuto: !inputData.gnAuto,
      vin: !inputData.vin,
      year: !inputData.year,
    });

    if (!disableButton) {
      const carData = {
        authUser,
        callsign: inputData.gnAuto,
        licence_plate_number: inputData.ctc,
        mark_name: carMarks.name,
        model_name: carModels?.name,
        year: Number(inputData.year.name),
        vin: technical_data.vin,
        color_name: colors.name,
        car_license_front_photo: authUser?.car_license_front_photo,
        car_license_back_photo: authUser?.car_license_back_photo,
      };

      dispatch(createNewCarRequest(carData))
        .then((result: any) => {
          if (result.payload.status) {
            setSuccessModal(true);
          } else {
            console.log('📢 [DataAuto.tsx:191]', result.payload);
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
        .catch(error => {
          showMessage({
            message: error.response,
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
    }
  }, [
    carMarks.name,
    carModels.name,
    colors.name,
    inputData.ctc,
    inputData.gnAuto,
    inputData.vin,
    inputData.year,
    disableButton,
    authUser,
    technical_data.vin,
    dispatch,
    insets.top,
  ]);

  const buttonContainerStyle = disableButton
    ? {backgroundColor: '#319240aa'}
    : {backgroundColor: Colors.green};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {paddingTop: insets.top}]}>
      <SuccessAuthModal
        visible={successModal}
        onPress={() => {
          setSuccessModal(false);
          loadUserData(true);
        }}
      />

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
          Регистрация в агрегаторе: Данные авто
        </BoldText>
        <DefaultInput
          onChangeText={text => {
            handleTextChange(text, 'gnAuto');
            setErrorData({...errorData, gnAuto: false});
          }}
          placeholder={'ГН авто'}
          value={inputData?.gnAuto}
          label={'Гос.номер'}
          error={errorData.gnAuto}
        />
        <AccordionInput
          label={'Марка'}
          placeholder={'Не указан'}
          data={car_marks}
          value={carMarks}
          setValue={text => {
            setCarMarks(text);
            getModel(text);
            setErrorData({...errorData, carMarks: false});
          }}
          error={errorData.carMarks}
        />
        <AccordionInput
          label={'Модель'}
          placeholder={'Не указан'}
          data={car_model}
          value={carModels}
          setValue={text => {
            setCarModels(text);
            setErrorData({...errorData, carModels: false});
          }}
          error={errorData.carModels}
        />
        <AccordionInput
          placeholder={'Год выпуска'}
          data={dataYear}
          setValue={text => {
            handleTextChange(text, 'year');
            setErrorData({...errorData, year: false});
          }}
          value={inputData?.year || {name: '', id: ''}}
          label={'Год'}
          error={errorData.year}
        />

        <AccordionInput
          label={'Цвет'}
          placeholder={'Не указан'}
          data={car_color}
          value={colors}
          setValue={text => {
            setColors(text);
            setErrorData({...errorData, colors: false});
          }}
          error={errorData.colors}
        />
        <DefaultInput
          onChangeText={text => {
            handleTextChange(text, 'ctc');
            setErrorData({...errorData, ctc: false});
          }}
          placeholder={'Номер СТС'}
          value={inputData?.ctc}
          label={'Номер док.'}
          error={errorData.ctc}
        />
        <DefaultInput
          onChangeText={text => {
            handleTextChange(text, 'vin');
            setErrorData({...errorData, vin: false});
          }}
          placeholder={'Номер VIN'}
          value={inputData?.vin}
          label={'VIN'}
          error={errorData.vin}
        />
        <AdaptiveButton
          loading={loadingMarks || loadingModels || loadingColors || loading}
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
    fontSize: 17,
    marginTop: 10,
    marginBottom: 20,
  },
});

export const DataAuto = memo(DataAutoComponent);
