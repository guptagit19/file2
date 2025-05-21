// src/screens/LocationPermissionScreen.js
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {storage} from '../contexts/storagesMMKV';
import {API_BASE_URL, endPoints} from '../APIs/apiService';
//import {APIsGet, APIsPost, endPoints} from '../APIs/apiService';
import Toast from 'react-native-toast-message';
export default function LocationPermissionScreen({navigation}) {
  const {isConnected} = useContext(ConnectivityContext);
  const {colors} = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);

  const askPermissionAndSend = async () => {
    if (!isConnected) {
      return Alert.alert('No internet', 'Please connect and try again.');
    }

    setLoading(true);
    try {
      // 1️⃣ Check & request permissions
      const perms = Platform.select({
        ios: [
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ],
        android: [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ],
      });

      for (const perm of perms) {
        let status = await check(perm);
        if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
          status = await request(perm);
        }
        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission blocked',
            'Enable location in settings to continue.',
            [{text: 'Open Settings', onPress: openSettings}],
          );
          setLoading(false);
          return;
        }
        if (status !== RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Location is required.');
          setLoading(false);
          return;
        }
      }

      // 2️⃣ Ensure device location services are ON
      const gpsAvailable = await new Promise(resolve => {
        Geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          {timeout: 5000},
        );
      });
      if (!gpsAvailable) {
        Alert.alert(
          'Location services off',
          'Please turn on device location services.',
          [{text: 'Open Settings', onPress: () => Linking.openSettings()}],
        );
        setLoading(false);
        return;
      }

      // 3️⃣ Fetch precise coordinates
      // Geolocation.getCurrentPosition(
      //   async ({coords}) => {
      //     const {latitude, longitude} = coords;
      //     console.log('latitude', latitude);
      //     console.log('longitude', longitude);
      //     try {
      //       // 1️⃣ Reverse-geocode via your axios instance
      //       const {data: nomRes} = await APIsGet(
      //         'https://nominatim.openstreetmap.org/reverse',
      //         {
      //           lat: latitude,
      //           lon: longitude,
      //           format: 'json',
      //           addressdetails: 1,
      //         },
      //       );

      //       const addr = nomRes.address || {};
      //       const phoneNumber = storage.getString('phoneNumber');
      //       const payload = {
      //         latitude,
      //         longitude,
      //         country: addr.country,
      //         state: addr.state || addr.county,
      //         city: addr.city || addr.town || addr.village,
      //         postalCode: addr.postcode,
      //         place: nomRes.display_name,
      //       };

      //       // 2️⃣ Send to backend via your wrapper
      //       await APIsPost(
      //         `${endPoints.saveUserLocation}/${phoneNumber}`,
      //         payload,
      //       );

      //       Toast.show({type: 'success', text1: 'Location saved!'});
      //       navigation.replace('MainNavPage');
      //     } catch (err) {
      //       // will use your ToastConfig to show error
      //       Toast.show({
      //         type: 'error',
      //         text1: 'Error saving location',
      //         text2: err.message,
      //       });
      //       setLoading(false);
      //     }
      //   },
      //   error => {
      //     Toast.show({type: 'error', text1: 'GPS error', text2: error.message});
      //     setLoading(false);
      //   },
      //   {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
      console.warn(err);
      Alert.alert('Error', 'Failed to fetch or save location.');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.text, {color: colors.text, marginBottom: 20}]}>
        We need your location to show nearby profiles.
      </Text>

      <Button
        title={loading ? 'Please wait…' : 'Enable Location'}
        onPress={askPermissionAndSend}
        color={colors.primary}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator
          style={{marginTop: 20}}
          size="small"
          color={colors.primary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
