// src/hooks/useLocation.js
import {useState, useEffect} from 'react';
import {Platform, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export default function useLocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('loading');
  // 'loading' | 'granted' | 'denied'

  useEffect(() => {
    async function ask() {
      const perm = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });
      let res = await check(perm);
      if (res === RESULTS.DENIED || res === RESULTS.LIMITED) {
        res = await request(perm);
      }
      if (res === RESULTS.GRANTED) {
        setStatus('granted');
        Geolocation.getCurrentPosition(
          p => setCoords(p.coords),
          e => {
            console.warn(e);
            setStatus('denied');
          },
          {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
        );
      } else {
        setStatus('denied');
      }
    }
    ask();
  }, []);

  return {coords, status, retry: () => setStatus('loading')};
}
