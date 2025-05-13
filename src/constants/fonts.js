// src/constants/fonts.js
import {Platform} from 'react-native';
import {moderateScale} from './metrics';

export const Fonts = {
  // if you want to switch to the system font + separate weights,
  // you can do:
  regular: Platform.select({ios: 'System', android: 'sans-serif'}),
  medium: Platform.select({ios: 'System', android: 'sans-serif-medium'}),
  bold: Platform.select({ios: 'System', android: 'sans-serif-bold'}),
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  bold: '700',
};

export const FontSizes = {
  small: moderateScale(12),
  xSmall: moderateScale(14),
  medium: moderateScale(16),
  xmedium: moderateScale(18),
  large: moderateScale(20),
  xlarge: moderateScale(24),
};
