// src/screens/LoginScreen.js
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker';
import {TextInput} from 'react-native-paper';

import {moderateScale} from '../constants/metrics';
import {ThemeContext} from '../contexts/ThemeContext';
import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {Strings} from '../constants/strings';
import {storage} from '../contexts/storagesMMKV';
import {APIsGet, endPoints} from '../APIs/apiService';

export default function LoginScreen({navigation}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);

  const [selected, setSelected] = useState('+91');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = text => {
    if (text.length <= 10) setPhone(text);
  };

  const getOTP = async () => {
    if (!isConnected) {
      Toast.show({type: 'info', text1: Strings.noInternet});
      return;
    }
    if (phone.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid number',
        text2: 'Enter a 10-digit phone number',
      });
      return;
    }

    const fullPhoneNumber = `${selected}${phone}`;
    Alert.alert('fullPhoneNumber',fullPhoneNumber)
    setLoading(true);
    try {
      const response = await APIsGet(endPoints.generateOtp, {
        phoneNumber: fullPhoneNumber,
      });
      if (
        response.status === 200 &&
        response.message === 'OTP sent successfully' &&
        response.bolValue
      ) {
        Toast.show({type: 'success', text1: response.message});
        storage.set('phoneNumber', fullPhoneNumber);
        navigation.replace('OTPVerificationScreen');
      } else {
        Toast.show({
          type: 'error',
          text1: 'OTP failed',
          text2: response.message || 'Try again later',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Request error',
        text2: 'Please check network and try again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}>
          <View style={styles.flex}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontFamily: fonts.bold,
                  fontSize: fontSizes.large,
                },
              ]}>
              {Strings.loginTitle}
            </Text>
            <View style={[styles.inputContainer, {width: '85%'}]}>
              <View style={styles.countryPickerWrap}>
                <CountryCodeDropdownPicker
                  selected={selected}
                  setSelected={setSelected}
                  setCountryDetails={setCountry}
                  // Code button
                  countryCodeTextStyles={[
                    styles.countryCodeText,
                    {color: colors.text, fontFamily: fonts.medium},
                  ]}
                  countryCodeContainerStyles={[
                    styles.countryCodePicker,
                    {borderColor: colors.text},
                  ]}
                  // Search box
                  searchStyles={[
                    styles.search,
                    {
                      borderColor: colors.text,
                      backgroundColor: colors.background,
                    },
                  ]}
                  searchInputStyles={{color: colors.text}}
                  // Dropdown list container
                  dropdownStyles={[
                    styles.dropdown,
                    {
                      borderColor: colors.text,
                      backgroundColor: colors.background,
                    },
                  ]}
                  // Country name text in each row
                  countryNameTextStyles={{
                    color: colors.text,
                    fontFamily: fonts.regular,
                  }}
                  // Each row background
                  countryNameContainerStyles={{
                    backgroundColor: colors.background,
                  }}
                />
              </View>
              <TextInput
                label="Phone Number"
                mode="outlined"
                style={[
                  styles.phoneInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.text,
                  },
                ]}
                placeholder="Enter Number..."
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                maxLength={10}
                left={<TextInput.Icon icon="phone" color={colors.text} />}
                theme={{
                  colors: {
                    primary: colors.primary,
                    text: colors.text,
                    placeholder: colors.text,
                  },
                }}
              />
            </View>
            <TouchableOpacity
              disabled={phone.length !== 10 || loading}
              style={[
                styles.button,
                {
                  backgroundColor:
                    !isConnected || phone.length !== 10
                      ? colors.disable
                      : colors.primary,
                },
                styles.shadow,
              ]}
              onPress={getOTP}>
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    {color: colors.background, fontFamily: fonts.medium},
                  ]}>
                  {Strings.submit}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: moderateScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  countryPickerWrap: {
    marginRight: moderateScale(10),
    flexShrink: 0,
  },
  countryCodePicker: {
    height: moderateScale(50),
    borderWidth: 1,
    borderRadius: moderateScale(5),
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: moderateScale(16),
  },
  search: {
    height: moderateScale(45),
    borderWidth: 1,
    borderRadius: moderateScale(5),
  },
  dropdown: {
    borderRadius: moderateScale(5),
    borderWidth: 1,
    marginTop: moderateScale(5),
  },
  phoneInput: {
    flex: 1,
    borderRadius: moderateScale(5),
    fontSize: moderateScale(16),
    paddingVertical: moderateScale(4),
  },
  button: {
    width: '80%',
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(30),
  },
  buttonText: {
    fontSize: moderateScale(18),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
