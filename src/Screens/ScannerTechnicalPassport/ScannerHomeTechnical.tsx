import React, {memo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {AdaptiveButton} from '../../Components/AdaptiveButton';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ScannerHomeTechnicalComponent = () => {
  const insets = useSafeAreaInsets();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Text style={styles.pageTitle}>Подготовьте СТС</Text>
      <Text style={styles.textInfo}>
        Следующим шагом нужно будет сфотографировать свидетельство о регистрации
        транспортного средства, мы распознаем данные автомобиля, для добавления
        в агрегаторе.
      </Text>
      <Text style={styles.importantSendSTS}>
        Изображение должно быть четким, без бликов и хорошо читаемым
      </Text>
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
    backgroundColor: Colors.black,
  },
  pageTitle: {
    color: Colors.white,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 50,
  },
  importantSendSTS: {
    color: Colors.white,
    fontSize: 22,
    marginTop: 20,
  },
  textInfo: {
    color: Colors.white,
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
