import React, {memo} from 'react';
import {Text, StyleSheet, Modal, View} from 'react-native';
import {AdaptiveButton} from './AdaptiveButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SuccessAuthModalProps = {
  visible: boolean;
  onPress: () => void;
};

const SuccessAuthModalComponent = ({
  visible,
  onPress,
}: SuccessAuthModalProps) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      style={styles.modal}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <View style={[styles.container, {paddingTop: insets.top + 20}]}>
        <Text style={styles.title}>Мы зарегистрировали вас в Яндекс Go</Text>
        <View style={styles.wrapper}>
          <Text style={styles.infos}>1) Скачайте приложение «Яндекс Про»</Text>
          <Text style={styles.infos}>
            2) Войдите в него по вашему номеру телефона и выберете парк “Grot”
          </Text>
          <Text style={styles.infos}>
            3) Подтвердите документы указанные при регистрации{' '}
          </Text>
          <Text style={styles.infos}>4) Пройдите фотоконтроль автомобиля</Text>
          <Text style={styles.infos}>5) Приступайте к выполнению заказов.</Text>
        </View>
        <AdaptiveButton onPress={onPress}>Далее</AdaptiveButton>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  infos: {
    fontSize: 16,
    marginBottom: 30,
  },
});

export const SuccessAuthModal = memo(SuccessAuthModalComponent);
