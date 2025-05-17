import messaging from '@react-native-firebase/messaging';
import {Platform, Alert} from 'react-native';

export const getFCMToken = async () => {
  try {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token from getFCMToken =:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await getFCMToken();
      return token;
    } else {
      Alert.alert(
        'Permission Denied',
        'Enable notifications from settings to receive important updates.',
      );
      return null;
    }
  } catch (error) {
    console.log('Error requesting notification permission:', error);
    Alert.alert(
      'Error',
      'An error occurred while requesting notification permissions.',
    );
    return null;
  }
};

export const setupForegroundMessageListener = () => {
  return messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

export const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};
