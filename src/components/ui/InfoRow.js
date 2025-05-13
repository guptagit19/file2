// src/components/ui/InfoRow.js
import React, {useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';

// Threshold for switching to vertical layout remains unchanged
const LONG_VALUE_THRESHOLD = 15;

export default function InfoRow({icon, label, value, onChange}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const isLong = value?.length > LONG_VALUE_THRESHOLD;

  // Vertical layout for long values
  if (isLong) {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View
          style={[
            styles.container,
            styles.containerLong,
            {backgroundColor: colors.surface, borderColor: colors.border},
          ]}>
          <View style={styles.header}>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={moderateScale(20)}
                color={colors.text}
              />
            )}
            <Text
              style={[
                styles.label,
                !icon && styles.noIconLabel,
                {
                  color: colors.text,
                  fontFamily: fonts.medium,
                  fontSize: fontSizes.medium,
                },
              ]}>
              {label}
            </Text>
          </View>
          <View style={[styles.divider, {backgroundColor: colors.border}]} />
          <View style={styles.body}>
            <Text
              style={[
                styles.value,
                {
                  color: colors.text,
                  fontFamily: fonts.bold,
                  fontSize: fontSizes.medium,
                },
              ]}>
              {value}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default inline layout
  return (
    <TouchableOpacity
      onPress={onChange ? () => onChange(value) : null}
      activeOpacity={onChange ? 0.7 : 1}>
      <View
        style={[
          styles.container,
          {backgroundColor: colors.surface, borderColor: colors.border},
        ]}>
        <View style={styles.left}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={moderateScale(20)}
              color={colors.text}
            />
          )}
          <Text
            style={[
              styles.label,
              !icon && styles.noIconLabel,
              {
                color: colors.text,
                fontFamily: fonts.medium,
                fontSize: fontSizes.medium,
              },
            ]}>
            {label}
          </Text>
        </View>
        <Text
          style={[
            styles.value,
            {
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: fontSizes.medium,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    marginVertical: verticalScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerLong: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    width: '100%',
    marginVertical: verticalScale(8),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    marginLeft: moderateScale(8),
  },
  noIconLabel: {
    marginLeft: 0,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
