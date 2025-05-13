/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
// src/screens/ProfileScreen2.js
import React, {useEffect, useContext, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Toast from 'react-native-toast-message';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../constants/metrics';
import {APIsGet, APIsPut, endPoints} from '../APIs/apiService';
import useKeyboardOffsetHeight from '../hooks/useKeyboardOffsetHeight';

import PhotoPicker from '../components/ProfileScreen/PhotoPicker';
import ProfileMandFields from '../components/ProfileScreen/ProfileMandFields';
import SocialMediaLinker from '../components/ProfileScreen/SocialMediaLinker';
import BreakerText from '../components/ui/BreakerText';
import SubscriptionStatus from '../components/ProfileScreen/SubscriptionStatus';
import TrustRating from '../components/ProfileScreen/TrustRating';
import HintButton from '../components/ui/HintButton';
import DynamicBoxGrid from '../components/ui/DynamicBoxGrid';
import {storage} from '../contexts/storagesMMKV';

export default function ProfileScreen2() {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hook to track keyboard height
  const keyboardHeight = useKeyboardOffsetHeight();
  // Animated value for sliding
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animate up/down when keyboard opens/closes
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: keyboardHeight > 0 ? -keyboardHeight / 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight, slideAnim]);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const local = storage.getString('user_profile');
      if (local) setProfile(JSON.parse(local));

      if (!isConnected) {
        Toast.show({
          type: 'info',
          text1: 'Offline',
          text2: 'Showing cached data',
        });
        setLoading(false);
        return;
      }

      try {
        console.log('phoneNumber ',storage.getString('phoneNumber'));
        const {status, data} = await APIsGet(endPoints.checkPhone, {
          phoneNumber: storage.getString('phoneNumber'),
        });
        console.log('status',status,' data -> ',data);
        if (status === 200) {
          setProfile(data.data);
          storage.set('user_profile', JSON.stringify(data.data));
          console.log('user_profile -> ',storage.getString('user_profile'));
        } else {
          Toast.show({type: 'error', text1: 'Load error', text2: data.message});
        }
      } catch (err) {
        Toast.show({type: 'error', text1: 'Error', text2: err.message});
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [isConnected]);

  const handleSave = async () => {
    if (!isConnected) {
      Toast.show({
        type: 'info',
        text1: 'No internet',
        text2: 'Cannot save offline',
      });
      return;
    }
    setSaving(true);
    try {
      console.log('profile in profile -> ',profile);
      const {status, data} = await APIsPut(endPoints.updateUser, profile);

      if (status === 200) {
        storage.set('user_profile', JSON.stringify(profile));
        Toast.show({type: 'success', text1: data.message});
      } else {
        Toast.show({type: 'error', text1: 'Save failed', text2: data.message});
      }
    } catch (err) {
      Toast.show({type: 'error', text1: 'Error', text2: err.message});
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <View style={[styles.loader, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={moderateScale(60)}>
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled">
          <BreakerText text="📸 Profile Images" />
          <PhotoPicker
            value={profile.images}
            onChange={imgs => setProfile({...profile, images: imgs})}
          />

          <BreakerText text="📦 Your Subscription:" />
          <SubscriptionStatus subscription={profile.activeSubscription} />

          <BreakerText text="🛡️ Your Trust:" />
          <TrustRating
            icon="tie"
            label="🤝 Your Trust"
            rating={parseFloat(profile.trust)}
            max={5}
          />

          <BreakerText text="🌿 Your Natures:" />
          <View
            style={[
              styles.wrapper,
              {borderColor: colors.border, backgroundColor: colors.surface},
            ]}>
            <Text
              style={[
                styles.natureText,
                {
                  color: colors.text,
                  fontFamily: fonts.medium,
                  fontSize: fontSizes.medium,
                },
              ]}>
              Add your natures
            </Text>
            <ScrollView
              style={{width: '100%'}}
              contentContainerStyle={styles.tagsContainer}
              showsVerticalScrollIndicator={false}>
              {profile.natures.map((item, idx) => (
                <HintButton key={idx} text={`✨ ${item}`} onPress={() => {}} />
              ))}
            </ScrollView>
          </View>

          <BreakerText text="🌐 Social Media" />
          <SocialMediaLinker
            value={profile.socialMedia}
            onChange={val => setProfile({...profile, socialMedia: val})}
          />

          <BreakerText text="💼 Basic Details" />
          <ProfileMandFields
            values={profile}
            onChange={(field, val) => setProfile({...profile, [field]: val})}
          />

          <BreakerText text="🌐 Languages" />
          <DynamicBoxGrid
            label="Language"
            boxCount={5}
            InstruText="Add languages you know"
            value={profile.languages}
            onChange={arr => setProfile({...profile, languages: arr})}
          />

          <BreakerText text="🔥 Interests" />
          <DynamicBoxGrid
            label="Interests"
            boxCount={9}
            InstruText="Add your interests"
            value={profile.interests}
            onChange={arr => setProfile({...profile, interests: arr})}
          />

          <TouchableOpacity
            style={[
              styles.saveBtn,
              {backgroundColor: isConnected ? colors.primary : colors.disable},
            ]}
            onPress={handleSave}
            disabled={!isConnected || saving}>
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text
                style={[
                  styles.saveText,
                  {color: colors.background, fontFamily: fonts.bold},
                ]}>
                Save Profile
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  flex: {flex: 1},
  inner: {padding: moderateScale(16)},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  wrapper: {
    marginVertical: verticalScale(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginBottom: moderateScale(20),
  },
  natureText: {
    textAlign: 'center',
    marginBottom: moderateScale(10),
    textDecorationLine: 'underline',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: moderateScale(2),
  },
  saveBtn: {
    margin: moderateScale(16),
    padding: moderateScale(14),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  saveText: {fontSize: moderateScale(18)},
});
