/* eslint-disable curly */
import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {ActivityIndicator, Checkbox} from 'react-native-paper';

// Contexts and Components
import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import BreakerText from '../components/ui/BreakerText';
import HintButton from '../components/ui/HintButton';
import RequestFields from '../components/ui/RequestFields';
import SocialMediaLinker from '../components/ProfileScreen/SocialMediaLinker';
import {moderateScale, verticalScale} from '../constants/metrics';
import {storage} from '../contexts/storagesMMKV';
import {useGlobalAlert} from '../contexts/GlobalAlertContext';
import {APIsGet, endPoints} from '../APIs/apiService';
import useKeyboardOffsetHeight from '../hooks/useKeyboardOffsetHeight';

export default function DatingScreen() {
  // Context Hooks
  const {isConnected} = useContext(ConnectivityContext);
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {showAlert} = useGlobalAlert();

  // Refs
  const formRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // State Management
  //const [profile, setProfile] = useState({socialMedia: {}});
  const [profile, setProfile] = useState({});
  const [selectedSM, setSelectedSM] = useState({});
  const [blindDate, setBlindDate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Derived Values
  const {hasValidSubscription, isNonSilver} = useMemo(() => {
    const subscription = profile?.activeSubscription || {};
    return {
      hasValidSubscription: Number(subscription.remainingRequestLimit) > 0,
      isNonSilver:
        subscription.subscriptionName &&
        subscription.subscriptionName !== 'SILVER',
    };
  }, [profile]);

  // Profile Management
  const loadProfile = useCallback(() => {
    const rawProfile = storage.getString('user_profile') || '{}';
    const parsedProfile = JSON.parse(rawProfile);

    setProfile(parsedProfile);
    setSelectedSM(
      Object.keys(parsedProfile.socialMedia || {}).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {},
      ),
    );
  }, []);

  // Data Fetching
  const fetchProfileData = useCallback(async () => {
    try {
      const {status, data} = await APIsGet(endPoints.checkPhone, {
        phoneNumber: storage.getString('phoneNumber'),
      });

      if (status === 200 && data.message === 'User Found' && data.bluValue) {
        storage.set('user_profile', JSON.stringify(data.data));
        return true;
      }
      Toast.show({type: 'error', text1: 'Load error', text2: data.message});
      return false;
    } catch (error) {
      Toast.show({type: 'error', text1: 'Error', text2: error.message});
      return false;
    }
  }, []);

  // Storage Listener for Real-time Updates
  useEffect(() => {
    const unsubscribe = storage.addOnValueChangedListener(changedKey => {
      if (changedKey === 'user_profile') loadProfile();
    });
    return () => unsubscribe.remove();
  }, [loadProfile]);

  // Initial Load
  useEffect(() => {
    const initialize = async () => {
      await fetchProfileData();
      loadProfile();
    };
    initialize();
  }, [fetchProfileData, loadProfile]);

  // Keyboard Handling
  // useEffect(() => {
  //   const keyboardDidShow = Keyboard.addListener('keyboardDidShow', e => {
  //     Animated.spring(slideAnim, {
  //       toValue: -e.endCoordinates.height / 1.5,
  //       useNativeDriver: true,
  //       speed: 500,
  //     }).start();
  //   });

  //   const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
  //     Animated.spring(slideAnim, {
  //       toValue: 0,
  //       useNativeDriver: true,
  //       speed: 500,
  //     }).start();
  //   });

  //   return () => {
  //     keyboardDidShow.remove();
  //     keyboardDidHide.remove();
  //   };
  // }, [slideAnim]);

  const keyboardHeight = useKeyboardOffsetHeight();
  useEffect(() => {
    // Slide up when keyboard shows
    Animated.timing(slideAnim, {
      toValue: -keyboardHeight / 1.5,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight, slideAnim]);

  // Refresh Control
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchProfileData();
      loadProfile();
      formRef.current?.resetForm();
    } finally {
      setRefreshing(false);
    }
  }, [fetchProfileData, loadProfile]);

  // Social Media Toggle
  const handleSMtoggle = useCallback(
    (key, checked) => {
      if (!isNonSilver) {
        showAlert({
          type: 'error',
          title: 'Subscription Required',
          message: 'Premium subscription required for this feature',
          iconName: 'warning',
        });
        return;
      }
      setSelectedSM(prev => ({...prev, [key]: checked}));
    },
    [isNonSilver, showAlert],
  );

  // Form Handling
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        request: Yup.string().required('Request is required').trim(),
        meetupArea: Yup.string().required('Meet-up area is required').trim(),
        meetupTime: Yup.date()
          .required('Time is required')
          .min(new Date(), 'Cannot be in the past')
          .max(moment().add(48, 'hours').toDate(), 'Max 48 h from now'),
        termsAccepted: Yup.boolean().oneOf([true], 'You must accept terms'),
      }),
    [],
  );

  const handleSubmit = useCallback(
    async (values, {setSubmitting}) => {
      if (!hasValidSubscription) {
        showAlert({
          type: 'error',
          title: 'Subscription Required',
          message: 'Please upgrade your subscription plan',
          iconName: 'warning',
        });
        setSubmitting(false);
        return;
      }

      const payload = {
        ...values,
        meetupTime: values.meetupTime.toISOString(),
        blindDate,
        socialPlatforms: Object.keys(selectedSM).filter(k => selectedSM[k]),
      };
      Alert.alert('payload -> ', JSON.stringify(payload, null, 2));
      Toast.show({
        type: 'info',
        text1: 'Request Submitted',
        text2: 'Your dating request has been processed',
      });
      setSubmitting(false);
    },
    [hasValidSubscription, blindDate, selectedSM, showAlert],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        style={[styles.container, {backgroundColor: colors.background}]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }>
        <Animated.View
          style={[styles.flex, {transform: [{translateY: slideAnim}]}]}>
          {/* Header Section */}
          <Text
            style={[
              styles.pageTitle,
              {color: colors.text, fontFamily: fonts.bold},
            ]}>
            Dating Preferences
          </Text>

          {/* How It Works */}
          <TouchableOpacity
            onPress={() =>
              Toast.show({
                type: 'info',
                text1: 'Dating Process',
                text2: 'Customize your dating preferences and connect!',
              })
            }
            style={styles.infoButton}>
            <Text
              style={[
                styles.howItWorks,
                {color: colors.primary, fontFamily: fonts.medium},
              ]}>
              How it works?
            </Text>
          </TouchableOpacity>

          {/* Date Type Selection */}
          <View style={styles.selectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {color: colors.text, fontFamily: fonts.medium},
              ]}>
              Date Type
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setBlindDate(!blindDate)}
              style={[
                styles.optionCard,
                {
                  backgroundColor: blindDate ? colors.lightSky : colors.surface,
                  borderColor: colors.border,
                },
              ]}>
              <View style={styles.optionContent}>
                <Checkbox
                  status={blindDate ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.text}
                />
                <Text
                  style={[
                    styles.optionText,
                    {color: blindDate ? colors.background : colors.text},
                  ]}>
                  Blind Date Experience
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Social Media Connections */}
          <SocialMediaLinker
            value={profile.socialMedia}
            titleText="Connected Platforms"
            selected={selectedSM}
            onToggle={handleSMtoggle}
            disabled={!isNonSilver}
          />

          {/* Dating Request Form */}
          <Formik
            innerRef={formRef}
            initialValues={{
              request: '',
              meetupArea: '',
              meetupTime: null,
              termsAccepted: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({handleSubmit, setFieldValue, isSubmitting}) => (
              <View style={styles.formContainer}>
                <RequestFields
                  minDate={new Date()}
                  maxDate={moment().add(48, 'hours').toDate()}
                  onChangeField={setFieldValue}
                />

                {/* Request Suggestions */}
                <View style={styles.suggestionsContainer}>
                  {[
                    'Chai pe Chale !!!',
                    "Let's go on a walk.",
                    "Hi, Let's ",
                    "Hi, Let's have a Dinner...",
                  ].map((hint, index) => (
                    <HintButton
                      key={index}
                      text={hint}
                      onPress={() => setFieldValue('request', hint)}
                    />
                  ))}
                </View>

                {/* Submission Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isConnected || isSubmitting}
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor:
                        isConnected && !isSubmitting
                          ? colors.primary
                          : colors.disable,
                    },
                  ]}>
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={[styles.buttonText, {fontFamily: fonts.bold}]}>
                      {hasValidSubscription ? 'Send Request' : 'Upgrade Required'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </Animated.View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {flexGrow: 1},
  container: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(16),
    //paddingVertical: verticalScale(0),
  },
  contentContainer: {paddingVertical: verticalScale(9)},
  pageTitle: {
    fontSize: moderateScale(26),
    textAlign: 'center',
    marginBottom: verticalScale(15),
  },
  infoButton: {
    alignSelf: 'center',
    marginBottom: verticalScale(25),
  },
  howItWorks: {
    fontSize: moderateScale(16),
    textDecorationLine: 'underline',
  },
  selectionContainer: {
    marginBottom: verticalScale(25),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginBottom: verticalScale(15),
  },
  optionCard: {
    borderRadius: moderateScale(15),
    borderWidth: 1,
    padding: moderateScale(5),
    marginHorizontal: moderateScale(10),
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: moderateScale(16),
    marginLeft: moderateScale(10),
  },
  formContainer: {
    marginTop: verticalScale(20),
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: moderateScale(10),
    marginVertical: verticalScale(20),
  },
  submitButton: {
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  buttonText: {
    fontSize: moderateScale(18),
    color: '#FFF',
  },
});
