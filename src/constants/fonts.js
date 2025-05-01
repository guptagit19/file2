// src/constants/fonts.js
import {Platform} from 'react-native';
import {moderateScale} from './metrics';

export const Fonts = {
  regular: Platform.select({ios: 'HelveticaNeue', android: 'Roboto-Regular'}),
  medium: Platform.select({
    ios: 'HelveticaNeue-Medium',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({ios: 'HelveticaNeue-Bold', android: 'Roboto-Bold'}),
};

export const FontSizes = {
  small: moderateScale(12),
  medium: moderateScale(16),
  large: moderateScale(20),
  xlarge: moderateScale(24),
};
