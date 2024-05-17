import React, {memo, useEffect} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {AdaptiveButton} from '../../Components/AdaptiveButton';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAuth} from '../../Context/AuthContext';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {showMessage} from 'react-native-flash-message';
import {BoldText} from '../../Includes/BoldText';
import {RegularText} from '../../Includes/RegularText';

const ScannerHomeTechnicalComponent = () => {
  const insets = useSafeAreaInsets();
  const {isAuthenticated} = useAuth();
  const {error_message} = useSelector(
    (state: RootState) => state.sendTechnicalPassportSlice,
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
      {isAuthenticated && (
        <AntDesign
          name={'arrowleft'}
          color={Colors.black}
          style={{marginTop: insets.top + 10}}
          size={24}
          onPress={() => navigation.goBack()}
        />
      )}
      <BoldText style={styles.pageTitle}>Подготовьте СТС</BoldText>
      <RegularText style={styles.textInfo}>
        Следующим шагом нужно будет сфотографировать свидетельство о регистрации
        транспортного средства, мы распознаем данные автомобиля, для добавления
        в агрегаторе.
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
          onPress={() => navigation.navigate('CameraScreenTechnical')}>
          Продолжить
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

export const ScannerHomeTechnical = memo(ScannerHomeTechnicalComponent);
