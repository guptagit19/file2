// src/components/ToastConfig.js
import React from 'react';
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';
import {Colors} from '../constants/colors';
import {moderateScale} from '../constants/metrics';

export const toastConfig = {
  success: ({text1, text2, ...rest}) => (
    <SuccessToast
      {...rest}
      style={{
        borderLeftColor: Colors.light.primary,
        backgroundColor: Colors.light.background,
        paddingHorizontal: moderateScale(12),
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      text1Style={{
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: Colors.light.primary,
      }}
      text2Style={{color: Colors.light.text}}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({text1, text2, ...rest}) => (
    <ErrorToast
      {...rest}
      style={{
        borderLeftColor: Colors.light.error,
        backgroundColor: Colors.light.background,
        paddingHorizontal: moderateScale(12),
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      text1Style={{
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: Colors.light.error,
      }}
      text2Style={{color: Colors.light.text}}
      text1={text1}
      text2={text2}
    />
  ),
  info: ({text1, text2, ...rest}) => (
    <InfoToast
      {...rest}
      style={{
        borderLeftColor: Colors.light.primary,
        backgroundColor: Colors.light.background,
        paddingHorizontal: moderateScale(12),
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      text1Style={{
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: Colors.light.text,
      }}
      text2Style={{color: Colors.light.text}}
      text1={text1}
      text2={text2}
    />
  ),
  custom: ({text1, text2, ...rest}) => (
    <BaseToast
      {...rest}
      style={{
        borderLeftColor: Colors.light.primary,
        backgroundColor: Colors.light.background,
        paddingHorizontal: moderateScale(12),
      }}
      contentContainerStyle={{paddingHorizontal: moderateScale(8)}}
      // eslint-disable-next-line react-native/no-inline-styles
      text1Style={{
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: Colors.light.text,
      }}
      text2Style={{color: Colors.light.text}}
      text1={text1}
      text2={text2}
    />
  ),
};
