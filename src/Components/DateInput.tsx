import React, {Dispatch, SetStateAction, memo, useState} from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Colors from '../Includes/Colors';
import MaskInput from 'react-native-mask-input';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

type DateInputProps = {
  label: string;
  containerStyle?: ViewStyle;
  placeholder: string;
  date: string | Date | undefined; // Updated type definition
  setDate: Dispatch<SetStateAction<Date | undefined>>; // Updated type definition
};

const DateInputComponent = ({
  label,
  containerStyle,
  placeholder,
  date,
  setDate,
}: DateInputProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpen(false);
    }
  };

  return (
    <View style={{...styles.container, ...containerStyle}}>
      <Text style={styles.label}>{label}</Text>
      <MaskInput
        value={date ? moment(date).format('DD.MM.YYYY') : ''}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark}
        keyboardType={'phone-pad'}
        editable={false}
        mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
      />
      <Fontisto
        name={'date'}
        size={24}
        style={styles.dateIcon}
        color={Colors.black}
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        mode={'date'}
        open={open}
        date={date ? new Date(date) : new Date()} // Convert to Date object if not already
        onConfirm={handleDateChange}
        onCancel={() => setOpen(false)}
        maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
        minimumDate={new Date(Date.now() - 80 * 365 * 24 * 60 * 60 * 1000)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    position: 'relative',
    marginBottom: 10,
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
  },
  dateIcon: {
    position: 'absolute',
    bottom: 17,
    right: 10,
  },
});

export const DateInput = memo(DateInputComponent);
