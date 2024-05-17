import React, {memo} from 'react';
import {StyleSheet, Modal, View} from 'react-native';
import {AdaptiveButton} from './AdaptiveButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoldText} from '../Includes/BoldText';
import {RegularText} from '../Includes/RegularText';

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
        <BoldText style={styles.title}>
          Мы зарегистрировали вас в Яндекс Go
        </BoldText>
        <View style={styles.wrapper}>
          <RegularText style={styles.infos}>
            1) Скачайте приложение «Яндекс Про»
          </RegularText>
          <RegularText style={styles.infos}>
            2) Войдите в него по вашему номеру телефона и выберете парк “Grot”
          </RegularText>
          <RegularText style={styles.infos}>
            3) Подтвердите документы указанные при регистрации{' '}
          </RegularText>
          <RegularText style={styles.infos}>
            4) Пройдите фотоконтроль автомобиля
          </RegularText>
          <RegularText style={styles.infos}>
            5) Приступайте к выполнению заказов.
          </RegularText>
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
