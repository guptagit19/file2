/* eslint-disable curly */
// src/screens/LocationPermissionScreen.js
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import {ThemeContext} from '../contexts/ThemeContext';
import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {moderateScale, verticalScale} from '../constants/metrics';
import {APIsGet, APIsPost, endPoints, API_BASE_URL} from '../APIs/apiService';
import {storage} from '../contexts/storagesMMKV';

// Only load on Android
let RNAndroidLocationEnabler = null;
if (Platform.OS === 'android') {
  RNAndroidLocationEnabler =
    require('react-native-android-location-enabler').default;
}

export default function LocationPermissionScreen({navigation}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);
  const [loading, setLoading] = useState(false);

  const askPermissionAndFetch = async () => {
    if (!isConnected) {
      return Toast.show({
        type: 'error',
        text1: 'No Internet',
        text2: 'Please connect and try again.',
      });
    }
    setLoading(true);

    try {
      // 1️⃣ request runtime permissions
      const perms = Platform.select({
        ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        android: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
      });

      for (let perm of perms) {
        let status = await check(perm);
        if (status === RESULTS.DENIED) status = await request(perm);
        if (status !== RESULTS.GRANTED) {
          throw new Error('Location permission denied');
        }
      }

      // 2️⃣ on Android, ensure GPS is turned ON
      if (Platform.OS === 'android' && RNAndroidLocationEnabler) {
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
      }

      // 3️⃣ get coordinates
      // Geolocation.getCurrentPosition(
      //   async ({coords}) => {
      //     const {latitude, longitude} = coords;

      //     // 4️⃣ reverse-geocode
      //     const {data: nomRes} = await APIsGet(
      //       'https://nominatim.openstreetmap.org/reverse',
      //       {lat: latitude, lon: longitude, format: 'json', addressdetails: 1},
      //     );
      //     const addr = nomRes.address || {};
      //     const payload = {
      //       latitude,
      //       longitude,
      //       country: addr.country,
      //       state: addr.state || addr.county,
      //       city: addr.city || addr.town || addr.village,
      //       postalCode: addr.postcode,
      //       place: nomRes.display_name,
      //     };

      //     // 5️⃣ send to backend
      //     const phone = storage.getString('phoneNumber');
      //     await APIsPost(endPoints.saveUserLocation(phone), payload);

      //     Toast.show({type: 'success', text1: 'Location saved!'});
      //     navigation.replace('Main');
      //   },
      //   error => {
      //     console.warn(error);
      //     Toast.show({type: 'error', text1: 'GPS error', text2: error.message});
      //     setLoading(false);
      //   },
      //   {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
      // );

      Geolocation.getCurrentPosition(
        // inside Geolocation.getCurrentPosition success callback
        async ({coords}) => {
          const {latitude, longitude} = coords;
          const query = `?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
          const url = 'https://nominatim.openstreetmap.org/reverse' + query;

          console.log('🛰️ Reverse‑geocode URL:', url);

          try {
            // Use fetch for debugging
            const resp = await fetch(url, {
              headers: {
                'User-Agent': 'CasualDateApp/1.0 (dev@casualdate.com)',
                Accept: 'application/json',
              },
            });

            console.log('🔄 fetch status:', resp.status);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const json = await resp.json();
            console.log('🗺️ Address response:', json);

            // build payload & send to your backend
            const addr = json.address || {};
            const payload = {
              latitude,
              longitude,
              country: addr.country,
              state: addr.state || addr.county,
              city: addr.city || addr.town || addr.village,
              postalCode: addr.postcode,
              place: addr.village,
            };
            console.log('🚀 Sending payload:', payload);
            console.log(
              '🚀 Sending URL:',
              `${API_BASE_URL}${endPoints.saveUserLocation}`,
            );
            const phoneNumber = storage.getString('phoneNumber');
            const backendResp = await fetch(
              `${API_BASE_URL}${
                endPoints.saveUserLocation
              }/${encodeURIComponent(phoneNumber)}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              },
            );
            console.log('✅ Backend status:', backendResp.status);
            console.log('✅ Backend status:', backendResp);
            Toast.show({type: 'success', text1: 'Location saved!'});
            navigation.replace('MainNavPage');
          } catch (err) {
            console.error('❌ Reverse‑geocode error:', err);
            Alert.alert('Error', err.message);
          } finally {
            setLoading(false);
          }
        },
      );
    } catch (err) {
      Toast.show({type: 'error', text1: 'Error', text2: err.message});
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.illustration}
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
        Can we get your location, please?
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: fontSizes.small,
          },
        ]}>
        We need it so we can show you great people nearby (or far away).
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: colors.primary},
          loading && {opacity: 0.6},
        ]}
        onPress={askPermissionAndFetch}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.surface} size={30}/>
        ) : (
          <Text style={[styles.buttonText, {fontFamily: fonts.medium}]}>
            Enable Location
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '60%',
    height: verticalScale(200),
    marginBottom: verticalScale(20),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: verticalScale(24),
    paddingHorizontal: moderateScale(10),
  },
  button: {
    width: '100%',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
  },
});
