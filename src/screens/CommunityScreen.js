// src/screens/CommunityScreen.js
import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';

import {ConnectivityContext} from '../contexts/ConnectivityContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {moderateScale} from '../constants/metrics';
import {Strings} from '../constants/strings';

export default function CommunityScreen() {
  const {isConnected} = useContext(ConnectivityContext);
  const {colors, fonts, fontSizes} = useContext(ThemeContext);

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
            styles.offline,
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
          styles.text,
          {
            color: colors.text,
            fontFamily: fonts.bold,
            fontSize: fontSizes.large,
          },
        ]}>
        {Strings.communityTab} Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
  },
  offline: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: moderateScale(8),
    marginBottom: moderateScale(16),
    color: '#fff',
  },
  text: {},
});
