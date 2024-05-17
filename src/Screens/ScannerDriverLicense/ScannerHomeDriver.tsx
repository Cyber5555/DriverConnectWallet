/* eslint-disable react-native/no-inline-styles */
import React, {memo, useEffect} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {AdaptiveButton} from '../../Components/AdaptiveButton';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {showMessage} from 'react-native-flash-message';
import {BoldText} from '../../Includes/BoldText';
import {RegularText} from '../../Includes/RegularText';

const ScannerHomeDriverComponent = () => {
  const insets = useSafeAreaInsets();
  const {error_message} = useSelector(
    (state: RootState) => state.sendDriverLicenseSlice,
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  useEffect(() => {
    if (error_message !== '') {
      showMessage({
        message: error_message,
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
  }, [error_message, insets.top]);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <AntDesign
        name={'arrowleft'}
        color={Colors.black}
        style={{marginTop: 20}}
        size={24}
        onPress={() => navigation.goBack()}
      />

      <BoldText style={styles.pageTitle}>
        Подготовьте водительское удостоверение
      </BoldText>
      <RegularText style={styles.textInfo}>
        Следующим шагом нужно будет сфотографировать водительское удостоверение,
        мы распознаем данные вашего документа, для создания вашего профиля в
        агрегаторе.
      </RegularText>
      <RegularText style={styles.importantSendSTS}>
        Изображение должно быть четким, без бликов и хорошо читаемым
      </RegularText>
      <View
        style={[styles.imageButtonContainer, {marginBottom: insets.bottom}]}>
        <Image
          source={require('../../Assets/images/scanCardImg.png')}
          style={styles.image}
        />
        <AdaptiveButton
          containerStyle={{backgroundColor: Colors.lightYellow}}
          textStyle={{color: Colors.black}}
          onPress={() => navigation.navigate('CameraScreenDriver')}>
          Сделать фото
        </AdaptiveButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  pageTitle: {
    color: Colors.dark,
    fontSize: 25,
    marginTop: 50,
  },
  importantSendSTS: {
    color: Colors.dark,
    fontSize: 22,
    marginTop: 20,
  },
  textInfo: {
    color: Colors.dark,
    fontSize: 22,
    marginTop: 30,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageButtonContainer: {
    flex: 1,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
});

export const ScannerHomeDriver = memo(ScannerHomeDriverComponent);
