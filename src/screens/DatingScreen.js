// src/screens/DatingScreen.js
import React, {useState, useCallback, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import useKeyboardOffsetHeight from '../hooks/useKeyboardOffsetHeight';
import BreakerText from '../components/ui/BreakerText';
import HintButton from '../components/ui/HintButton';
import RequestFields from '../components/ui/RequestFields';
import SocialMediaLinker from '../components/ProfileScreen/SocialMediaLinker';
import {moderateScale, verticalScale} from '../constants/metrics';
import {storage} from '../contexts/storagesMMKV';
import {Checkbox} from 'react-native-paper';

export default function DatingScreen() {
  const keyboardOffset = useKeyboardOffsetHeight();
  const {isConnected} = useContext(ConnectivityContext);
  const {colors, fonts, fontSizes} = useContext(ThemeContext);

  // load profile + init checkboxes
  const [profile, setProfile] = useState({socialMedia: {}});
  const [selectedSM, setSelectedSM] = useState({});
  const [blindDate, setBlindDate] = useState(false);

  useEffect(() => {
    const p = JSON.parse(storage.getString('user_profile') || '{}');
    setProfile(p);
    // only platforms user actually linked
    const init = Object.keys(p.socialMedia || {}).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setSelectedSM(init);
  }, []);

  const toggleSM = useCallback((key, checked) => {
    setSelectedSM(prev => ({...prev, [key]: checked}));
  }, []);

  const toggleBlind = () => setBlindDate(v => !v);

  const now = new Date();
  const minDate = now;
  const maxDate = moment(now).add(48, 'hours').toDate();

  const schema = Yup.object().shape({
    request: Yup.string().required().trim(),
    meetupArea: Yup.string().required().trim(),
    meetupTime: Yup.date().required().min(minDate).max(maxDate),
    termsAccepted: Yup.boolean().oneOf([true]),
  });

  const onSubmit = useCallback(
    values => {
      const data = {
        ...values,
        meetupTime: values.meetupTime.toISOString(), // local timezone
        blindDate,
        socialPlatforms: Object.keys(selectedSM).filter(k => selectedSM[k]),
      };
      Alert.alert('Submission Data', JSON.stringify(data));
      Toast.show({
        type: 'info',
        text1: 'Submission Data',
        text2: JSON.stringify(data, null, 2),
      });
    },
    [blindDate, selectedSM],
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardOffset}>
      <ScrollView
        style={[styles.container, {backgroundColor: colors.background}]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        <Text
          style={[
            styles.pageTitle,
            {color: colors.text, fontFamily: fonts.bold},
          ]}>
          Dating Page
        </Text>

        <TouchableOpacity
          onPress={() =>
            Toast.show({
              type: 'info',
              text1: 'How it works',
              text2: 'Explain the dating process here.',
            })
          }>
          <Text
            style={[
              styles.howItWorks,
              {color: colors.primary, fontFamily: fonts.medium},
            ]}>
            How it works?
          </Text>
        </TouchableOpacity>

        {/* Blind‑Date Checkbox */}
        <Text
          style={[
            styles.sectionTitle,
            {color: colors.text, fontFamily: fonts.medium},
          ]}>
          Go with:
        </Text>
        <View style={styles.goWithOptions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleBlind}
            style={[
              styles.optionButton,
              {
                borderColor: colors.border,
                // highlight background when checked
                backgroundColor: blindDate ? colors.lightSky : colors.surface,
              },
            ]}>
            <View style={styles.blindRow}>
              <Checkbox
                status={blindDate ? 'checked' : 'unchecked'}
                onPress={toggleBlind}
                color={colors.primary}
                uncheckedColor={colors.text}
              />
              <Text
                style={{
                  color: blindDate ? colors.background : colors.text,
                  fontFamily: fonts.regular,
                  fontSize: fontSizes.medium,
                }}>
                Blind Date With Profile
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <BreakerText
          text="OR"
          color={colors.border}
          fontSize={fontSizes.medium}
        />

        {/* Social‑Media Checklist */}

        <SocialMediaLinker
          value={profile.socialMedia}
          titleText="Select your linked platforms"
          screen="DatingScreen"
          selected={selectedSM}
          onToggle={toggleSM}
        />

        <BreakerText
          text="Your Request"
          color={colors.border}
          fontSize={fontSizes.medium}
        />

        <Formik
          initialValues={{
            request: '',
            meetupArea: '',
            meetupTime: null,
            termsAccepted: false,
          }}
          validationSchema={schema}
          onSubmit={onSubmit}>
          {({handleSubmit, setFieldValue, errors, touched}) => (
            <>
              <RequestFields
                minDate={minDate}
                maxDate={maxDate}
                errors={errors}
                touched={touched}
              />

              <BreakerText
                text="Request Hints:"
                color={colors.border}
                fontSize={fontSizes.small}
              />
              <View style={styles.hintsButtonsContainer}>
                {[
                  'Chai pe Chale !!!',
                  "Let's go on a walk.",
                  "Hi, Let's have a Coffee...",
                  "Hi, Let's have a Dinner...",
                ].map((hint, i) => (
                  <HintButton
                    key={i}
                    text={hint}
                    onPress={() => setFieldValue('request', hint)}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isConnected}
                style={[
                  styles.sendRequestButton,
                  {
                    backgroundColor: isConnected
                      ? colors.primary
                      : colors.disable,
                  },
                ]}>
                <Text
                  style={[
                    styles.sendRequestButtonText,
                    {fontFamily: fonts.bold},
                  ]}>
                  Send Request
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, paddingHorizontal: moderateScale(16)},
  contentContainer: {paddingVertical: verticalScale(20)},
  pageTitle: {
    fontSize: moderateScale(24),
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  howItWorks: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: verticalScale(20),
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },
  goWithOptions: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  optionButton: {
    padding: moderateScale(2),
    borderRadius: moderateScale(20),
    borderWidth: StyleSheet.hairlineWidth,
    width: '65%', // stretch full width
    maxWidth: moderateScale(300), // optional max width
  },
  hintsButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(20),
  },
  sendRequestButton: {
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  sendRequestButtonText: {
    fontSize: moderateScale(18),
    color: '#FFF',
  },
  blindRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
