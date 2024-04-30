/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {memo, useState} from 'react';
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
import {AccordionInput} from '../../../Components/AccordionInput';
import {DefaultInput} from '../../../Components/DefaultInput';
import {AdaptiveButton} from '../../../Components/AdaptiveButton';
import {DateInput} from '../../../Components/DateInput';

type DataDriverLicenseProps = {};

const DataDriverLicenseComponent = ({}: DataDriverLicenseProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  const [inputData, setInputData] = useState({
    name: '',
    surName: '',
    fatherName: '',
  });

  const handleTextChange = (text: string, fieldName: string) => {
    setInputData({...inputData, [fieldName]: text});
  };

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
          onChangeText={text => handleTextChange(text, 'surName')}
          placeholder={'6636747474774'}
          value={inputData.surName}
        />
        <DateInput label={'Дата выдачи ВУ'} placeholder={'19.03.2015'} />
        <DateInput label={'ВУ действительны до'} placeholder={'19.03.2025'} />

        <AccordionInput label={'Страна выдачи ВУ'} placeholder={'Россия'} />
        <AccordionInput placeholder={'2024'} />

        <AdaptiveButton
          // disabled={inputValue.length < 6 ? true : false}
          containerStyle={{
            marginTop: 20,
            // backgroundColor:
            //   inputValue.length < 6 ? '#319240aa' : Colors.green,
          }}
          onPress={() => navigation.navigate('DataAuto')}>
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
