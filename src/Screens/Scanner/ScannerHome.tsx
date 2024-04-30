/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {View, Text, StyleSheet, Platform, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {AdaptiveButton} from '../../Components/AdaptiveButton';
import {RootNavigationProps} from '../../Router/RootNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ScannerHomeComponent = () => {
  const insets = useSafeAreaInsets();

  // const [device, setDevice] = useState(undefined as CameraDevice | undefined);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationProps>>();
  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'ios' ? insets.top : 20},
      ]}>
      <AntDesign
        name={'arrowleft'}
        color={Colors.white}
        style={{marginTop: 20}}
        size={24}
        onPress={() => navigation.goBack()}
      />

      <Text style={styles.pageTitle}>
        Подготовьте водительское удостоверение
      </Text>
      <Text style={styles.textInfo}>
        Следующим шагом нужно будет сфотографировать водительское удостоверение,
        мы распознаем данные вашего документа, для создания вашего профиля в
        агрегаторе.
      </Text>
      <Text style={styles.importantSendSTS}>
        Подготовьте водительское удостоверение
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
          // onPress={() => navigation.navigate('CameraScreen')}>
          onPress={() => navigation.navigate('CameraScreen')}>
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

export const ScannerHome = memo(ScannerHomeComponent);
