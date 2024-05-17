import React, {Dispatch, SetStateAction, memo, useState} from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import Colors from '../Includes/Colors';
import MaskInput from 'react-native-mask-input';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {RegularText} from '../Includes/RegularText';

type DateInputProps = {
  label: string;
  containerStyle?: ViewStyle;
  placeholder: string;
  date: string | Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  maximumDate: Date | undefined;
  minimumDate: Date | undefined;
  error: boolean;
};

const DateInputComponent = ({
  label,
  containerStyle,
  placeholder,
  date,
  setDate,
  maximumDate,
  minimumDate,
  error,
}: DateInputProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpen(false);
    }
  };

  return (
    <View>
      <RegularText style={styles.label}>{label}</RegularText>
      <TouchableOpacity
        style={{
          ...styles.container,
          ...containerStyle,
          ...{
            borderColor: error ? Colors.red : 'transparent',
          },
        }}
        onPress={() => setOpen(true)}>
        <MaskInput
          value={date ? moment(date).format('DD.MM.YYYY') : ''}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.darkGray}
          keyboardType={'phone-pad'}
          editable={false}
          mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
        />
        <Fontisto
          name={'date'}
          size={24}
          style={styles.dateIcon}
          color={Colors.black}
        />
        <DatePicker
          modal
          mode={'date'}
          open={open}
          date={date ? new Date(date) : new Date(Date.now())}
          onConfirm={handleDateChange}
          onCancel={() => setOpen(false)}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    position: 'relative',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: Colors.darker,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 20,
    color: Colors.dark,
    pointerEvents: 'none',
  },
  dateIcon: {
    position: 'absolute',
    bottom: 17,
    right: 10,
  },
});

export const DateInput = memo(DateInputComponent);
