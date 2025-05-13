/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
// src/screens/LoginScreen.js
import React, {useState, useContext, useEffect, useRef} from 'react';
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
  Image,
  Animated,
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
import useKeyboardOffsetHeight from '../hooks/useKeyboardOffsetHeight';
import {Fonts, FontSizes} from '../constants/fonts';

export default function LoginScreen({navigation}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);
  const [selected, setSelected] = useState('+91');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const keyboardHeight = useKeyboardOffsetHeight();

  const slideAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Slide up when keyboard shows
    Animated.timing(slideAnim, {
      toValue: -keyboardHeight / 2,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight, slideAnim]);

  const handlePhoneChange = text => {
    // Use a regular expression to check if the input contains only numbers
    const isNumeric = /^[0-9]+$/.test(text);

    if (isNumeric && text.length <= 10) {
      setPhone(text);
    } else if (!isNumeric) {
      // Show the error Toast if the input contains non-numeric characters
      Toast.show({
        type: 'error',
        text1: 'Invalid number',
        text2: 'Please enter only numbers.',
      });
      // Optionally, you might want to clear the input or revert to the previous valid state
      // setPhone(phone.slice(0, -1)); // Example: remove the last entered character
    } else if (text.length > 10) {
      // Optionally show a Toast for exceeding the length, or just truncate
      Toast.show({
        type: 'error',
        text1: 'Invalid number',
        text2: 'Phone number cannot exceed 10 digits.',
      });
      setPhone(text.slice(0, 10)); // Truncate to 10 digits
    }
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
    //Alert.alert('fullPhoneNumber', fullPhoneNumber);
    setLoading(true);
    try {
      const {status, data} = await APIsGet(endPoints.generateOtp, {
        phoneNumber: fullPhoneNumber,
      });
      console.log('Login status - ', status, 'data - ', data, 'data.data - ', data.data);
      if (
        status === 200 &&
        data.message === 'OTP sent successfully' &&
        data.bluValue
      ) {
        Toast.show({type: 'success', text1: data.message});
        storage.set('phoneNumber', fullPhoneNumber);
        navigation.replace('OTPVerificationScreen');
      } else {
        Toast.show({
          type: 'error',
          text1: 'OTP failed',
          text2: data.message || 'Try again later',
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
        <Animated.View
          style={[styles.flex, {transform: [{translateY: slideAnim}]}]}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}>
            <View style={styles.flex}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontFamily: fonts.bold,
                    fontSize: fontSizes.xlarge,
                  },
                ]}>
                {Strings.loginTitle}
              </Text>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontFamily: fonts.bold,
                    fontSize: fontSizes.large,
                  },
                ]}>
                {Strings.loginSubTitle}
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
                      {
                        color: !colors.text,
                        fontFamily: fonts.bold,
                        fontSize: fontSizes.large,
                      },
                    ]}
                    countryCodeContainerStyles={[
                      styles.countryCodePicker,
                      {borderColor: colors.text},
                    ]}
                    // Search box
                    searchStyles={[
                      styles.search,
                      {
                        backgroundColor: '#FFFFFF',
                        fontFamily: fonts.bold,
                        fontSize: fontSizes.large,
                      },
                    ]}
                    searchInputStyles={{
                      color: !colors.text,
                      fontFamily: fonts.bold,
                      fontSize: fontSizes.xlarge,
                    }}
                    // Dropdown list container
                    dropdownStyles={[
                      styles.dropdown,
                      {
                        borderColor: colors.text,
                        //backgroundColor: colors.background,
                      },
                    ]}
                    // Country name text in each row
                    countryNameTextStyles={{
                      color: colors.text,
                      fontFamily: fonts.regular,
                    }}
                    // Each row background
                    countryNameContainerStyles={
                      {
                        //backgroundColor: colors.background,
                      }
                    }
                  />
                </View>
                <TextInput
                  label="Phone Number"
                  mode="outlined"
                  style={[
                    styles.phoneInput,
                    {
                      fontFamily: fonts.medium,
                      fontSize: FontSizes.large,
                    },
                  ]}
                  placeholder="Enter Number."
                  keyboardType="numeric"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  maxLength={10}
                  left={
                    <TextInput.Icon
                      icon="phone"
                      size={35}
                      color={!colors.text}
                    />
                  }
                  // theme={{
                  //   colors: {
                  //     primary: colors.primary,
                  //     text: colors.text,
                  //     placeholder: colors.text,
                  //   },
                  // }}
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
                  <ActivityIndicator size="large" color={colors.background} />
                ) : (
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: colors.text,
                        fontSize: FontSizes.large,
                        fontFamily: fonts.medium,
                      },
                    ]}>
                    {Strings.submit}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  //container: {flex: 1, padding: moderateScale(16)},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: moderateScale(10),
  },
  logo: {
    width: moderateScale(120),
    height: moderateScale(120),
    marginBottom: moderateScale(16),
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
    //backgroundColor: 'red',
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
  },

  button: {
    width: moderateScale(190),
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
