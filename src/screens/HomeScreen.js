// src/screens/HomeScreen.js
import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {Strings} from '../constants/strings';

const HomeScreen = () => {
  const {isConnected} = useContext(ConnectivityContext);
  const {theme, toggleTheme, clearTheme, colors, fonts, fontSizes} =
    useContext(ThemeContext);

  useEffect(() => {
    if (!isConnected) {
      Toast.show({type: 'info', text1: Strings.offlineBanner});
    }
  }, [isConnected]);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {!isConnected && (
        <Text
          style={[
            styles.offlineBanner,
            {
              backgroundColor: colors.error,
              fontFamily: fonts.regular,
              fontSize: fontSizes.small,
            },
          ]}>
          {Strings.offlineBanner}
        </Text>
      )}
      <Text
        style={[
          styles.welcome,
          {
            color: colors.text,
            fontFamily: fonts.bold,
            fontSize: fontSizes.large,
          },
        ]}>
        {Strings.homeWelcome}
      </Text>
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.button, {backgroundColor: colors.primary}]}>
        <Text
          style={{
            color: colors.background,
            fontFamily: fonts.medium,
            fontSize: fontSizes.medium,
          }}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={clearTheme}
        style={[styles.resetButton, {borderColor: colors.text}]}>
        <Text
          style={{
            color: colors.text,
            fontFamily: fonts.medium,
            fontSize: fontSizes.small,
          }}>
          Reset Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  offlineBanner: {
    color: '#fff',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  welcome: {marginBottom: 20},
  button: {padding: 12, borderRadius: 8},
  resetButton: {marginTop: 12, padding: 8, borderRadius: 8, borderWidth: 1},
});

export default HomeScreen;
