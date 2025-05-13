// src/components/ui/TrustRating.js
import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';

/**
 * TrustRating Component
 * Props:
 *  - label: label text
 *  - rating: numeric rating, supports half-stars (e.g., 3.5)
 *  - max: maximum rating value
 *  - onPress: optional callback when component is pressed
 */
export default function TrustRating({label, rating, max = 5, onPress}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);
  const stars = [];
  const starColor = colors.fullStar;
  const emptyColor = colors.emptyStar;
  const starSize = moderateScale(40);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <MaterialCommunityIcons
        key={`full-${i}`}
        name="star"
        size={starSize}
        color={starColor}
        style={styles.star}
      />,
    );
  }
  if (hasHalf) {
    stars.push(
      <MaterialCommunityIcons
        key="half"
        name="star-half-full"
        size={starSize}
        color={starColor}
        style={styles.star}
      />,
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <MaterialCommunityIcons
        key={`empty-${i}`}
        name="star-outline"
        size={starSize}
        color={emptyColor}
        style={styles.star}
      />,
    );
  }

  const thumbsName =
    rating >= max / 2 ? 'thumb-up-outline' : 'thumb-down-outline';
  const thumbsColor = rating >= max / 2 ? colors.goodThumbsColor : colors.badThumbsColor;
  const thumbsSize = moderateScale(30);

  return (
    <TouchableOpacity
      activeOpacity={Platform.select({ios: 0.7, android: 0.6})}
      style={[
        styles.wrapper,
        //{backgroundColor: `${colors.background}10`},  // 10% opacity overlay
        {backgroundColor: colors.surface || colors.background},
      ]}
      onPress={onPress}>
      <View style={styles.header}>
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: fontSizes.large,
            },
          ]}>
          {label}
        </Text>
      </View>
      <View style={[styles.divider, {backgroundColor: colors.disable}]} />
      <View style={styles.body}>
        <MaterialCommunityIcons
          name={thumbsName}
          size={thumbsSize}
          color={thumbsColor}
          style={styles.thumb}
        />
        <View style={styles.starRow}>{stars}</View>
        <Text
          style={[
            styles.value,
            {
              color: colors.text,
              fontFamily: fonts.medium,
              fontSize: fontSizes.large,
            },
          ]}>
          {`${rating}/${max}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    marginVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: moderateScale(2)},
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  label: {
    // styled via inline
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: verticalScale(6),
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    marginRight: moderateScale(8),
  },
  starRow: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: moderateScale(2),
  },
  value: {
    marginLeft: moderateScale(8),
    // styled via inline
  },
});
