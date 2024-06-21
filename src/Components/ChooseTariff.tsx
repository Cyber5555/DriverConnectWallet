import React, {SetStateAction, memo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../Includes/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CheckBox from '@react-native-community/checkbox';
import {RegularText} from '../Includes/RegularText';
import {DataType} from './AccordionInput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BoldText} from '../Includes/BoldText';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';

type ChooseTariffProps = {
  visible: boolean;
  setIsOpenModal: (bool: boolean) => void;
  setChecked: (item: SetStateAction<DataType[]>) => void;
  checked: DataType[];
};

const ChooseTariffComponent = ({
  visible,
  setIsOpenModal,
  setChecked,
  checked,
}: ChooseTariffProps) => {
  const insets = useSafeAreaInsets();
  const {get_tariffs} = useSelector(
    (state: RootState) => state.getTariffAndOptionSlice,
  );

  const toggleCheck = useCallback(
    (item: DataType) => {
      setChecked(prevState =>
        prevState.some(selected => selected.id === item.id)
          ? prevState.filter(selected => selected.id !== item.id)
          : [...prevState, item],
      );
    },
    [setChecked],
  );

  return (
    <Modal visible={visible} transparent={true}>
      <View
        style={{
          ...styles.container,
          paddingTop: insets.top,
        }}>
        <View style={styles.topBar}>
          <View style={styles.empty} />
          <BoldText style={styles.pageTitle}>Выбирать тариф</BoldText>
          <AntDesign
            name={'close'}
            size={30}
            color={Colors.dark}
            onPress={() => setIsOpenModal(false)}
          />
        </View>
        <ScrollView style={styles.scrollView}>
          {get_tariffs.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={{
                ...styles.checklist,
                ...{
                  marginBottom:
                    get_tariffs.length - 1 === index ? insets.bottom : 10,
                },
              }}
              onPress={() => toggleCheck(item)}
              accessible={true}
              accessibilityLabel={item.show_name}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: checked.some(el => el.id === item.id),
              }}>
              <CheckBox value={checked.some(el => el.id === item.id)} />
              <RegularText style={styles.label}>{item.show_name}</RegularText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pageTitle: {
    fontSize: 20,
  },

  scrollView: {
    flex: 1,
    borderRadius: 20,
  },
  checklist: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: Colors.black,
    shadowOffset: {height: 0, width: 0},
    shadowRadius: 5,
    shadowOpacity: 0.25,
    elevation: 5,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  empty: {
    width: 30,
  },
  label: {
    fontSize: 20,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export const ChooseTariff = memo(ChooseTariffComponent);
