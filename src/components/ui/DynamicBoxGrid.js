/* eslint-disable react-native/no-inline-styles */
// src/components/ui/DynamicBoxGrid.js
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';
import {FontWeights} from '../../constants/fonts';

/**
 * DynamicBoxGrid with HintButton-style adaptive boxes
 * - Always two empty boxes per row
 * - Filled boxes shrink-wrap to text + padding
 * - Very long text spans full width
 */
export default function DynamicBoxGrid({
  label,
  value,
  onChange,
  boxCount,
  InstruText,
}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const [values, setValues] = useState(Array(boxCount).fill(''));
  const [editingIndex, setEditingIndex] = useState(null);

  // sync when parent value changes
  useEffect(() => {
    const arr = Array(boxCount)
      .fill('')
      .map((_, i) => (value[i] != null ? value[i] : ''));
    setValues(arr);
  }, [value, boxCount]);

  const finishEditing = () => setEditingIndex(null);

  const handleTextChange = (text, idx) => {
    const newArr = [...values];
    newArr[idx] = text;
    setValues(newArr);
    onChange && onChange(newArr.filter(v => v)); // remove empty
  };

  return (
    <View style={styles.wrapper}>
      {/* <Text
        style={[
          styles.legend,
          { backgroundColor: colors.surface, color: colors.text, fontFamily: fonts.medium, fontSize: fontSizes.medium },
        ]}
      >
        {label}
      </Text> */}

      <View
        style={[
          styles.container,
          {borderColor: colors.border, backgroundColor: colors.surface},
        ]}>
        {/* Instruction Text */}
        <Text
          style={[
            styles.instruction,
            {
              color: colors.text,
              fontFamily: fonts.medium,
              fontSize: fontSizes.medium,
            },
          ]}>
          {InstruText}
        </Text>

        {values.map((val, idx) => {
          const isEditing = editingIndex === idx;
          const isFilled = !!val;
          const longText = isFilled && val.length > 30;
          const widthStyle = longText ? {width: '100%'} : {};

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              style={[
                styles.box,
                widthStyle,
                {
                  backgroundColor: isFilled ? colors.lightSky : colors.disable,
                  borderColor: colors.border,
                },

                isFilled && {
                  backgroundColor: colors.lightSky,
                  borderStyle: 'solid',
                  borderColor: colors.border,
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.shadow || '#000',
                      shadowOffset: {width: 0, height: moderateScale(1)},
                      shadowOpacity: 0.1,
                      shadowRadius: moderateScale(2),
                    },
                    android: {elevation: 2},
                  }),
                },
              ]}
              onPress={() => setEditingIndex(idx)}>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: !colors.text,
                      fontFamily: fonts.regular,
                      fontSize: fontSizes.medium,
                    },
                  ]}
                  value={val}
                  onChangeText={text => handleTextChange(text.trim(), idx)}
                  onBlur={finishEditing}
                  autoFocus
                  placeholder="Enter"
                  placeholderTextColor={colors.disable}
                />
              ) : isFilled ? (
                <Text
                  style={[
                    styles.hintText,
                    {
                      color: isFilled ? '#000000' : colors.text,
                      fontWeight: FontWeights.bold,
                      fontFamily: fonts.bold,
                      fontSize: fontSizes.medium,
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {val.trim()}
                </Text>
              ) : (
                <MaterialCommunityIcons
                  name="plus"
                  size={moderateScale(24)}
                  color={colors.text}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: verticalScale(20),
    paddingHorizontal: moderateScale(2),
  },
  instruction: {
    width: '100%',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: verticalScale(8),
  },
  legend: {
    position: 'absolute',
    top: -verticalScale(12),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(20),
    zIndex: 1,
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(10),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(12),
    paddingHorizontal: moderateScale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    minHeight: verticalScale(30),
    margin: moderateScale(4),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: verticalScale(8),
  },
  input: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: moderateScale(2),
  },
  hintText: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
