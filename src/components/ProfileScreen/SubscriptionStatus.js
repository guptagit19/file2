// src/components/ui/SubscriptionStatus.js
import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import {ThemeContext} from '../../contexts/ThemeContext';
import {ConnectivityContext} from '../../contexts/ConnectivityContext';
import {moderateScale, verticalScale} from '../../constants/metrics';

/**
 * Shows subscription details or prompt to buy/renew.
 */
export default function SubscriptionStatus({navigation, subscription}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);

  const handleNavigate = () => {
    if (!isConnected) {
      Toast.show({
        type: 'info',
        text1: 'No internet',
        text2: 'Check your network and try again.',
      });
    } else {
      navigation.navigate('SubscriptionScreen');
    }
  };

  if (!subscription) {
    return (
      <TouchableOpacity activeOpacity={0.7}>
      <View
        style={[
          styles.container,
          {backgroundColor: colors.surface, borderColor: colors.border},
        ]}>
        <Text
          style={[
            styles.noSubscriptionText,
            {
              color: colors.error,
              fontFamily: fonts.medium,
              fontSize: fontSizes.medium,
            },
          ]}>
          You don't have any active subscription package.
        </Text>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          activeOpacity={Platform.select({ios: 0.7, android: 0.85})}
          onPress={handleNavigate}>
          <Text
            style={[
              styles.btnText,
              {
                color: colors.background,
                fontFamily: fonts.bold,
                fontSize: fontSizes.medium,
              },
            ]}>
            Buy Subscription
          </Text>
        </TouchableOpacity>
      </View>
      </TouchableOpacity>
    );
  }

  const {
    subscriptionName,
    expireDate,
    remainingRequestLimit,
    initialTotalRequestLimit,
  } = subscription;
  const now = moment();
  const expiry = moment(expireDate);
  const remainingDays = expiry.diff(now, 'days');
  const isExpiringSoon = remainingDays <= 1 && remainingDays >= 0;
  const isExpired = remainingDays < 0;

  return (
    <TouchableOpacity activeOpacity={0.7}>
    <View
      style={[
        styles.container,
        {backgroundColor: colors.surface, borderColor: colors.border},
      ]}>
      {isExpired ? (
        <>
          <Text
            style={[
              styles.noSubscriptionText,
              {
                color: colors.error,
                fontFamily: fonts.medium,
                fontSize: fontSizes.medium,
              },
            ]}>
            Your subscription has expired.
          </Text>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.error}]}
            activeOpacity={Platform.select({ios: 0.7, android: 0.85})}
            onPress={handleNavigate}>
            <Text
              style={[
                styles.btnText,
                {
                  color: colors.background,
                  fontFamily: fonts.bold,
                  fontSize: fontSizes.medium,
                },
              ]}>
              Renew Subscription
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={[
              styles.title,
              {
                color: colors.primary,
                fontFamily: fonts.bold,
                fontSize: fontSizes.large,
              },
            ]}>
            {subscriptionName} Plan
          </Text>
          <Text
            style={[
              styles.detail,
              {
                color: colors.text,
                fontFamily: fonts.regular,
                fontSize: fontSizes.small,
              },
            ]}>
            Remaining Requests: {remainingRequestLimit} /{' '}
            {initialTotalRequestLimit}
          </Text>
          <Text
            style={[
              styles.detail,
              {
                color: colors.text,
                fontFamily: fonts.regular,
                fontSize: fontSizes.small,
              },
            ]}>
            Expires in: {remainingDays} day(s)
          </Text>

          {isExpiringSoon && (
            <>
              <Text
                style={[
                  styles.warning,
                  {
                    color: colors.error,
                    fontFamily: fonts.medium,
                    fontSize: fontSizes.small,
                  },
                ]}>
                Your subscription will expire{' '}
                {remainingDays === 0 ? 'today' : 'tomorrow'}! Renew soon.
              </Text>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: colors.error}]}
                activeOpacity={Platform.select({ios: 0.7, android: 0.85})}
                onPress={handleNavigate}>
                <Text
                  style={[
                    styles.btnText,
                    {
                      color: colors.background,
                      fontFamily: fonts.bold,
                      fontSize: fontSizes.medium,
                    },
                  ]}>
                  Renew Subscription
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(8),
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: verticalScale(6),
  },
  detail: {
    marginBottom: verticalScale(4),
  },
  noSubscriptionText: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  warning: {
    textAlign: 'center',
    marginVertical: verticalScale(6),
  },
  button: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(6),
  },
  btnText: {
    textAlign: 'center',
  },
});
