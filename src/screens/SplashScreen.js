// src/screens/SplashScreen.js
import React, {useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import Toast from 'react-native-toast-message';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {Strings} from '../constants/strings';
import {moderateScale} from '../constants/metrics';

const SplashScreen = () => {
  const navigation = useNavigation();
  const {isConnected} = useContext(ConnectivityContext);
  const {colors} = useContext(ThemeContext);

  useEffect(() => {
    if (!isConnected) {
      Toast.show({type: 'info', text1: Strings.noInternet});
      return;
    }
    (async () => {
      const {status} = await checkNotifications();
      if (status !== 'granted') {
        await requestNotifications(['alert', 'sound']);
      }
    })().finally(() => setTimeout(() => navigation.replace('Home'), 1000));
  }, [isConnected, navigation]);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, {color: colors.text}]}>
        {isConnected ? Strings.splashTitle : Strings.noInternet}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  logo: {
    width: moderateScale(120),
    height: moderateScale(120),
    marginBottom: moderateScale(24),
  },
  text: {
    marginTop: moderateScale(12),
    fontSize: moderateScale(16),
    fontFamily: 'sans-serif',
  },
});

export default SplashScreen;
