// src/components/ui/EditInfoRow.js
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';

const LONG_VALUE_THRESHOLD = 13;

/**
 * EditInfoRow
 * - Shows a label and value (or input when editing)
 * - Automatically switches to column layout for long values
 */
export default function EditInfoRow({
  icon,
  label,
  value,
  onChange,
  suffix,
  keyboardType = 'default',
}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const [isEditing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // If value is long and not editing, use vertical layout
  const isLong = !isEditing && value?.length >= LONG_VALUE_THRESHOLD;

  const handleSave = () => {
    setEditing(false);
    onChange && onChange(tempValue);
  };

  // Long layout
  if (isLong) {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View
          style={[
            styles.container,
            styles.containerLong,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
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
              {suffix}
            </Text>
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButton}
              activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="pencil"
                size={moderateScale(20)}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Inline layout
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
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

        {isEditing ? (
          <TextInput
            value={tempValue}
            onChangeText={setTempValue}
            onBlur={handleSave}
            autoFocus
            keyboardType={keyboardType}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                fontFamily: fonts.regular,
                fontSize: fontSizes.medium,
              },
            ]}
          />
        ) : (
          <View style={styles.right}>
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
              {suffix}
            </Text>
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButton}
              activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="pencil"
                size={moderateScale(20)}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        )}
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
  label: {
    marginLeft: moderateScale(8),
  },
  noIconLabel: {
    marginLeft: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    width: '100%',
    marginVertical: verticalScale(8),
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(8),
    maxWidth: '50%',
  },
  value: {
    flexShrink: 1,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    minWidth: moderateScale(100),
    maxWidth: moderateScale(150),
    paddingHorizontal: moderateScale(4),
  },
  editButton: {
    marginLeft: moderateScale(8),
  },
});
