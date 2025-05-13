/* eslint-disable react-native/no-inline-styles */
// src/screens/RegisterScreen.js
import React, {
  useCallback,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import useKeyboardOffsetHeight from '../hooks/useKeyboardOffsetHeight';
import {moderateScale} from '../constants/metrics';
import {Strings} from '../constants/strings';
import {APIsPost, endPoints} from '../APIs/apiService';
import {storage} from '../contexts/storagesMMKV';
import BreakerText from '../components/ui/BreakerText';
//import {requestNotificationPermission} from '../components/FCMService';

export default function RegisterScreen({navigation}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);
  const keyboardHeight = useKeyboardOffsetHeight();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    storage.set('phoneNumber', '+919380584233');
    Animated.timing(slideAnim, {
      toValue: -keyboardHeight / 7,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight, slideAnim]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, 'First name is too short')
      .required('First name is required')
      .trim(),
    lastName: Yup.string()
      .min(3, 'Last name is too short')
      .required('Last name is required')
      .trim(),
    email: Yup.string().email().required('Email is required').trim(),
    age: Yup.string()
      .matches(/^[0-9]+$/, 'Age must be a number')
      .min(2, 'Invalid Age')
      .max(2, 'Invalid Age')
      .required('Age is required')
      .trim(),
    gender: Yup.string().required('Gender is required').trim(),
    termsCondition: Yup.boolean().oneOf(
      [true],
      'Terms & Conditions must be checked.',
    ),
  });

  const handleRegister = useCallback(
    async (values, {resetForm, setErrors}) => {
      if (!isConnected) {
        Toast.show({
          type: 'info',
          text1: Strings.noInternet,
          text2: Strings.checkConnection,
        });
        return;
      }
      setSubmitting(true);
      //const fcmToken = await requestNotificationPermission();
      //const payload = {...values, fcmtoken: fcmToken};
      const payload = {...values, fcmtoken: ''};
      try {
        console.log('payload', payload);
        const response = await APIsPost(endPoints.registerUser, payload);
        console.log('response', response);
        if (
          response.status === 200 &&
          response.data.message === 'User Saved Successfully' &&
          response.data.bluValue
        ) {
          storage.set('isRegistered', true);
          console.log('response.data.data - ', response.data.data);
          storage.set('user_profile', JSON.stringify(response.data.data));
          Toast.show({type: 'success', text1: Strings.registrationSuccess});
          navigation.replace('ProfileScreen2');
          resetForm();
        } else {
          Toast.show({
            type: 'error',
            text1: Strings.error,
            text2: response.data?.message || Strings.registrationFailed,
          });
        }
      } catch (error) {
        // assume backend sent { message: "Validation failed", data: { field1: msg1, … }}
        console.log('err -> ', error);
        //const fieldErrors = error.response?.data?.data;
        //console.log('fieldErrors -> ',fieldErrors);
        if (error && typeof error === 'object') {
          // pass those directly into Formik’s errors
          setErrors(error);
        } else {
          // fallback toast
          console.log('error -> ', error);
          Toast.show({
            type: 'error',
            text1: error || Strings.somethingWrong,
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [isConnected, navigation],
  );

  const genderOptions = ['female', 'male'];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          transform: [{translateY: slideAnim}],
        },
      ]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        //keyboardVerticalOffset={moderateScale(60)}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          //keyboardShouldPersistTaps="handled"
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontFamily: fonts.bold,
                fontSize: fontSizes.xlarge,
              },
            ]}>
            {Strings.registerTitle}
          </Text>

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              age: '',
              gender: '',
              termsCondition: false,
              phoneNumber: storage.getString('phoneNumber'),
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}>
            {({
              values,
              setFieldValue,
              handleSubmit,
              errors,
              touched,
              dirty,
              isValid,
            }) => (
              <>
                {['firstName', 'lastName', 'email', 'age'].map(field => (
                  <View key={field} style={styles.fieldContainer}>
                    <TextInput
                      label={Strings[field]}
                      mode="outlined"
                      keyboardType={field === 'age' ? 'numeric' : 'default'}
                      placeholder={`Enter your ${field}...`}
                      value={values[field]}
                      onChangeText={txt => setFieldValue(field, txt.trim())}
                      style={[
                        styles.input,
                        {
                          borderWidth: 0,
                          borderColor: colors.error,
                          //backgroundColor: colors.background,
                        },
                      ]}
                      theme={{
                        colors: {
                          borderWidth: 10,
                          borderColor: colors.error,
                          primary: colors.primary,
                          text: colors.text,
                          placeholder: colors.text,
                        },
                      }}
                      left={
                        <TextInput.Icon
                          icon={Strings.icons[field]}
                          color={!colors.text}
                        />
                      }
                    />
                    {errors[field] && touched[field] && (
                      <Text style={[styles.errorText, {color: colors.error}]}>
                        {errors[field]}
                      </Text>
                    )}
                  </View>
                ))}
                <BreakerText text="OK" />
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontFamily: fonts.bold,
                      fontSize: fontSizes.large,
                    },
                  ]}>
                  {Strings.genderQuestion}
                </Text>
                <View style={styles.optionsContainer}>
                  {genderOptions.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.optionButton,
                        values.gender === opt && {
                          borderColor: colors.primary,
                          backgroundColor: `${colors.primary}20`,
                        },
                      ]}
                      onPress={() => setFieldValue('gender', opt)}>
                      <Icon
                        name={Strings.icons[opt]}
                        size={moderateScale(54)}
                        color={colors.teal}
                      />

                      <Text
                        style={[
                          styles.optionText,
                          {color: colors.text, fontFamily: fonts.regular},
                        ]}>
                        {Strings[opt]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && touched.gender && (
                  <Text
                    style={[
                      styles.errorText,
                      {color: colors.error, borderColor: colors.error},
                    ]}>
                    {errors.gender}
                  </Text>
                )}

                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() =>
                      setFieldValue('termsCondition', !values.termsCondition)
                    }>
                    <Icon
                      name={
                        values.termsCondition
                          ? 'checkbox-outline'
                          : 'square-outline'
                      }
                      size={moderateScale(20)}
                      color={
                        values.termsCondition ? colors.primary : colors.error
                      }
                    />
                    <Text
                      style={[
                        styles.termsText,
                        {
                          color: colors.text,
                          fontFamily: fonts.regular,
                          textAlign: 'center',
                        },
                      ]}>
                      {Strings.termsPrefix}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginLeft: moderateScale(4)}}
                    onPress={() => navigation.navigate('TermsAndConditions')}>
                    <Text style={[styles.linkText, {color: colors.primary}]}>
                      {Strings.termsLink}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.termsCondition && touched.termsCondition && (
                  <Text
                    style={[
                      styles.errorText,
                      {color: colors.error, borderColor: colors.error},
                    ]}>
                    {errors.termsCondition}
                  </Text>
                )}

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor:
                        !dirty || !isValid || submitting
                          ? colors.disable
                          : colors.primary,
                    },
                  ]}
                  onPress={handleSubmit}
                  //disabled={!dirty || !isValid || submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text
                      style={[
                        styles.submitText,
                        {color: colors.background, fontFamily: fonts.medium},
                      ]}>
                      {Strings.continue}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  flex: {flex: 1},
  inner: {
    padding: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {marginBottom: moderateScale(20)},
  fieldContainer: {width: moderateScale(324), marginBottom: moderateScale(12)},
  input: {borderRadius: moderateScale(5)},
  label: {
    textAlign: 'center',
    marginLeft: moderateScale(16),
    marginTop: moderateScale(12),
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: moderateScale(324),
    marginVertical: moderateScale(12),
  },

  optionButton: {
    alignItems: 'center',
    padding: moderateScale(8),
    borderWidth: 1,
    borderRadius: moderateScale(5),
    width: moderateScale(130), // instead of '40%'
    // no hardcoded borderColor here
  },

  optionText: {marginTop: moderateScale(4)},
  termsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(12),
    width: moderateScale(324),
  },
  termsText: {marginLeft: moderateScale(8)},
  linkText: {textDecorationLine: 'underline'},
  submitButton: {
    width: moderateScale(324),
    padding: moderateScale(14),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  submitText: {fontSize: moderateScale(18)},
  errorText: {marginTop: moderateScale(4)},
});
