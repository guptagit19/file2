// src/screens/OTPVerificationScreen.js
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import Toast from 'react-native-toast-message';

import useKeyboardOffsetHeight from '../hooks/useKeyboardOffsetHeight';
import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {moderateScale} from '../constants/metrics';
import {Strings} from '../constants/strings';
import {storage} from '../contexts/storagesMMKV';
import {APIsGet, endpoints} from '../APIs/apiService';

export default function OTPVerificationScreen({navigation}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);
  const keyboardHeight = useKeyboardOffsetHeight();

  const slideAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Slide up when keyboard shows
    Animated.timing(slideAnim, {
      toValue: -keyboardHeight / 2,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight, slideAnim]);

  const phoneNumber = storage.getString('phoneNumber') || '';
  const [otp, setOtp] = useState(['', '', '', '']);

  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const inputRefs = useMemo(() => [ref0, ref1, ref2, ref3], []);

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleDigit = useCallback(
    (value, index) => {
      if (!/^[0-9]?$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    },
    [otp, inputRefs],
  );

  const handleKeyPress = useCallback(
    ({nativeEvent}, index) => {
      if (nativeEvent.key === 'Backspace') {
        if (otp[index]) {
          const newOtp = [...otp];
          newOtp[index] = '';
          setOtp(newOtp);
        } else if (index > 0) {
          inputRefs[index - 1].current.focus();
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
        }
      }
    },
    [otp, inputRefs],
  );

  const verifyOtp = useCallback(async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Enter all 4 digits',
      });
      return;
    }
    if (!isConnected) {
      Toast.show({type: 'info', text1: Strings.noInternet});
      return;
    }
    setLoading(true);
    try {
      const res = await APIsGet(endpoints.verifyOTP, {phoneNumber, otp: code});
      if (res.status === 200 && res.data === 'OTP verified successfully') {
        Toast.show({type: 'success', text1: 'OTP Verified'});
        const chk = await APIsGet(endpoints.checkPhoneNumber, {phoneNumber});
        navigation.replace(chk.data ? 'Main' : 'RegisterScreenDemo');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: res.data || 'Try again',
        });
        setOtp(['', '', '', '']);
        inputRefs[0].current.focus();
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not verify OTP',
      });
    } finally {
      setLoading(false);
    }
  }, [otp, isConnected, navigation, phoneNumber, inputRefs]);

  const resendOtp = useCallback(async () => {
    if (!canResend) return;
    if (!isConnected) {
      Toast.show({type: 'info', text1: Strings.noInternet});
      return;
    }
    setLoading(true);
    try {
      const res = await APIsGet(endpoints.generateOtp, {phoneNumber});
      Toast.show({
        type: res.status === 200 ? 'success' : 'error',
        text1: res.message || 'OTP resent',
      });
      setOtp(['', '', '', '']);
      inputRefs[0].current.focus();
      setResendTimer(30);
      setCanResend(false);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not resend OTP',
      });
    } finally {
      setLoading(false);
    }
  }, [canResend, isConnected, phoneNumber, inputRefs]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Animated.View
          style={[styles.flex, {transform: [{translateY: slideAnim}]}]}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.header,
              {
                color: colors.text,
                fontFamily: fonts.bold,
                fontSize: fontSizes.xlarge,
              },
            ]}>
            Verification
          </Text>
          <Text
            style={[
              styles.instruction,
              {color: colors.text, fontFamily: fonts.regular},
            ]}>
            Enter the 4-digit code sent to
          </Text>
          <Text
            style={[
              styles.phone,
              {color: colors.primary, fontFamily: fonts.medium},
            ]}>
            {phoneNumber}
          </Text>

          <View style={styles.otpRow}>
            {inputRefs.map((ref, idx) => (
              <TextInput
                key={idx}
                ref={ref}
                value={otp[idx]}
                style={[
                  styles.otpInput,
                  {borderColor: colors.text, color: colors.text},
                ]}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={text => handleDigit(text, idx)}
                onKeyPress={e => handleKeyPress(e, idx)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  otp.join('').length === 4 ? colors.primary : colors.disable,
              },
            ]}
            disabled={otp.join('').length !== 4 || loading}
            onPress={verifyOtp}>
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: colors.text,
                    fontFamily: fonts.bold,
                    fontSize: fontSizes.large,
                  },
                ]}>
                {Strings.verify}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text
              style={[
                styles.resendText,
                {color: colors.text, fontFamily: fonts.regular},
              ]}>
              Didn't receive code?
            </Text>
            <TouchableOpacity onPress={resendOtp} disabled={!canResend}>
              <Text
                style={[
                  styles.resendLink,
                  {
                    color: canResend ? colors.primary : colors.disable,
                    fontFamily: fonts.medium,
                  },
                ]}>
                {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {flex: 1, padding: moderateScale(16)},
  logo: {
    width: moderateScale(120),
    height: moderateScale(120),
    marginBottom: moderateScale(16),
  },
  header: {marginBottom: moderateScale(8)},
  instruction: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(4),
    textAlign: 'center',
  },
  phone: {fontSize: moderateScale(16), marginBottom: moderateScale(20)},
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: moderateScale(240),
    marginBottom: moderateScale(30),
  },
  otpInput: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderWidth: 1,
    borderRadius: moderateScale(5),
    textAlign: 'center',
    fontSize: moderateScale(20),
    padding: 0,
  },
  button: {
    width: '80%',
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  buttonText: {fontSize: moderateScale(18)},
  resendRow: {flexDirection: 'row', alignItems: 'center'},
  resendText: {fontSize: moderateScale(14)},
  resendLink: {fontSize: moderateScale(14), marginLeft: moderateScale(6)},
});
