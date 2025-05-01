// src/constants/metrics.js
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

export const scale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
