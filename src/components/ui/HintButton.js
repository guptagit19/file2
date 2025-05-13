// src/components/ui/HintButton.js
import React, {useContext} from 'react';
import {Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';
import { FontSizes } from '../../constants/fonts';

/**
 * HintButton: a small pill-shaped button for tag inputs
 * Props:
 *  - text: the label to display
 *  - onPress: callback when tapped
 */
export default function HintButton({text, onPress}) {
  const {colors, fonts, fontSizes, fontWeights} = useContext(ThemeContext);

  return (
    <TouchableOpacity
      activeOpacity={Platform.select({ios: 0.7, android: 0.6})}
      style={[
        styles.button,
        {backgroundColor: colors.lightSky || colors.background},
        //{backgroundColor: '#e3eceb' || colors.background},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          {
            color: !colors.text,
            fontFamily: fonts.medium,
            fontWeight: fontWeights.bold,
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(8),
    marginBottom: moderateScale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: moderateScale(1)},
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(2),
      },
      android: {
        elevation: 2,
      },
    }),
  },
  text: {
    textAlign: 'center',
  },
});
