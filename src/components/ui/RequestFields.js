// src/components/ui/RequestFields.js
import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {TextInput, Checkbox} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import {useFormikContext} from 'formik';
import Toast from 'react-native-toast-message';

import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';

export default function RequestFields({minDate, maxDate}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormikContext();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: values.meetupTime || new Date(),
        onChange: onDateChange,
        mode: 'date',
        minimumDate: minDate,
        maximumDate: maxDate,
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      setTempDate(null);
    } else {
      setTempDate(selected);
      setShowDatePicker(false);
      if (Platform.OS === 'android') openTimePicker(selected);
      else setShowTimePicker(true);
    }
  };

  const openTimePicker = date => {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      onChange: (e, time) => onTimeChange(e, time, date),
      mode: 'time',
      is24Hour: true,
    });
  };

  const onTimeChange = (event, time, date) => {
    if (Platform.OS === 'ios') setShowTimePicker(false);
    if (event.type === 'dismissed') {
      setTempDate(null);
    } else {
      const chosen = new Date(time);
      const combined = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        chosen.getHours(),
        chosen.getMinutes(),
        chosen.getSeconds(),
      );
      if (combined >= minDate && combined <= maxDate) {
        setFieldValue('meetupTime', combined);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Time',
          text2: `Select between ${moment(minDate).format('LLL')} and ${moment(
            maxDate,
          ).format('LLL')}`,
        });
        setFieldValue('meetupTime', null);
      }
      setTempDate(null);
      handleBlur('meetupTime')({});
    }
  };

  return (
    <>
      {/* Your Request */}
      <TextInput
        label="Your Request"
        mode="outlined"
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundColor,
            fontFamily: fonts.regular,
            fontSize: fontSizes.medium,
            borderColor:
              errors.request && touched.request ? colors.error : colors.border,
          },
        ]}
        placeholder="e.g., Let's grab coffee..."
        value={values.request}
        onChangeText={handleChange('request')}
        onBlur={handleBlur('request')}
        activeOutlineColor={
          errors.request && touched.request ? colors.error : colors.primary
        }
      />
      {errors.request && touched.request && (
        <Text style={[styles.error, {color: colors.error}]}>
          {errors.request}
        </Text>
      )}

      {/* Meet‑up Area */}
      <TextInput
        label="Meet‑up Area / Place"
        mode="outlined"
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundColor,
            fontFamily: fonts.regular,
            fontSize: fontSizes.medium,
            borderColor:
              errors.meetupArea && touched.meetupArea
                ? colors.error
                : colors.border,
          },
        ]}
        placeholder="e.g., Central Park"
        value={values.meetupArea}
        onChangeText={handleChange('meetupArea')}
        onBlur={handleBlur('meetupArea')}
        activeOutlineColor={
          errors.meetupArea && touched.meetupArea
            ? colors.error
            : colors.primary
        }
      />
      {errors.meetupArea && touched.meetupArea && (
        <Text style={[styles.error, {color: colors.error}]}>
          {errors.meetupArea}
        </Text>
      )}

      {/* Date & Time Picker */}
      <TouchableOpacity onPress={openDatePicker} style={styles.pickerContainer}>
        <TextInput
          label="Meet‑up Date & Time"
          mode="outlined"
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundColor,
              fontFamily: fonts.regular,
              fontSize: fontSizes.medium,
              borderColor:
                errors.meetupTime && touched.meetupTime
                  ? colors.error
                  : colors.border,
            },
          ]}
          placeholder="Select Date & Time"
          value={
            values.meetupTime ? moment(values.meetupTime).format('LLL') : ''
          }
          editable={false}
          activeOutlineColor={
            errors.meetupTime && touched.meetupTime
              ? colors.error
              : colors.primary
          }
        />
        <Icon
          name="calendar-outline"
          size={24}
          color={!colors.text}
          style={styles.icon}
        />
      </TouchableOpacity>
      {errors.meetupTime && touched.meetupTime && (
        <Text style={[styles.error, {color: colors.error}]}>
          {errors.meetupTime}
        </Text>
      )}

      {Platform.OS === 'ios' && showDatePicker && (
        <DateTimePicker
          value={tempDate || values.meetupTime || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
      {Platform.OS === 'ios' && showTimePicker && tempDate && (
        <DateTimePicker
          value={values.meetupTime || tempDate}
          mode="time"
          display="default"
          onChange={(e, t) => onTimeChange(e, t, tempDate)}
        />
      )}

      {/* Terms & Conditions */}
      <View style={styles.termsRow}>
        <TouchableOpacity
          onPress={() => setFieldValue('termsAccepted', !values.termsAccepted)}
          style={styles.termsToggle}
          activeOpacity={0.7}>
          <Checkbox
            status={values.termsAccepted ? 'checked' : 'unchecked'}
            onPress={() =>
              setFieldValue('termsAccepted', !values.termsAccepted)
            }
            color={colors.primary}
          />
          <Text
            style={[
              styles.termsText,
              {color: colors.text, fontFamily: fonts.regular},
            ]}>
            I accept the{' '}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Toast.show({
              type: 'info',
              text1: 'Terms & Conditions',
              text2: 'Display your T&C here.',
            })
          }>
          <Text
            style={[
              styles.termsLink,
              {color: colors.primary, fontFamily: fonts.medium},
            ]}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
      {errors.termsAccepted && touched.termsAccepted && (
        <Text style={[styles.error, {color: colors.error}]}>
          {errors.termsAccepted}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: verticalScale(12),
  },
  pickerContainer: {
    marginBottom: verticalScale(12),
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: moderateScale(12),
    top: '50%',
    transform: [{translateY: -12}],
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  termsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    fontSize: moderateScale(14),
  },
  termsLink: {
    fontSize: moderateScale(14),
    textDecorationLine: 'underline',
  },
  error: {
    fontSize: moderateScale(12),
    marginTop: -verticalScale(8),
    marginBottom: verticalScale(8),
  },
});
