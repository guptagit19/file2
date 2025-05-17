/* eslint-disable react-native/no-inline-styles */
// src/components/ui/SocialMediaChecklist.js

import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Checkbox} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';
import {FontWeights} from '../../constants/fonts';

const platforms = [
  {key: 'Instagram', icon: 'instagram'},
  {key: 'Facebook', icon: 'facebook'},
  {key: 'Twitter/X', icon: 'twitter'},
  {key: 'Snapchat', icon: 'snapchat'},
  {key: 'LinkedIn', icon: 'linkedin'},
  {key: 'TikTok', icon: 'music-note'},
];

/**
 * SocialMediaChecklist
 * Props:
 *  - value: { [platformKey: string]: string }  // the URLs the user linked
 *  - selected: { [platformKey: string]: boolean } // which checkboxes are checked
 *  - onToggle: (platformKey: string, isChecked: boolean) => void
 */
export default function SocialMediaChecklist({
  value = {},
  selected = {},
  onToggle = () => {},
}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  console.log('value -> ', value);
  return (
    <View style={styles.container}>
      {platforms.map(({key, icon}) => {
        const hasLink = Boolean(value[key]);
        const isChecked = !!selected[key];

        return (
          <TouchableOpacity
            key={key}
            activeOpacity={hasLink ? 0.7 : 1}
            onPress={() => hasLink && onToggle(key, !isChecked)}
            style={[
              styles.box,
              {
                borderColor: colors.border,
                borderStyle: hasLink ? 'solid' : 'dashed',
                backgroundColor: hasLink
                  ? isChecked
                    ? colors.lightSky
                    : colors.surface
                  : 'transparent',
                ...Platform.select({
                  ios: {
                    shadowColor: colors.shadow || '#000',
                    shadowOffset: {width: 0, height: moderateScale(2)},
                    shadowOpacity: hasLink ? 0.2 : 0,
                    shadowRadius: moderateScale(4),
                    elevation: 3,
                  },
                  android: {
                    elevation: hasLink ? 3 : 0,
                  },
                }),
              },
            ]}>
            {hasLink && (
              <Checkbox
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => onToggle(key, !isChecked)}
                color={colors.goodThumbsColor}
                uncheckedColor={colors.text}
                style={{marginLeft: moderateScale(6)}}
              />
            )}

            <MaterialCommunityIcons
              name={icon}
              size={moderateScale(18)}
              color={hasLink ? colors.primary : colors.teal}
              style={{marginRight: moderateScale(6)}}
            />

            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: fontSizes.small,
                fontWeight: FontWeights.bold,
                color: hasLink ? colors.text : colors.disable,
                flex: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
              >
              {key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: verticalScale(10),
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(30),
    margin: moderateScale(4),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
  },
});
