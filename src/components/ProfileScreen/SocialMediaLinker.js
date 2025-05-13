/* eslint-disable react-native/no-inline-styles */
// src/components/ui/SocialMediaLinker.js
import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Platform,
  ToastAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../../contexts/ThemeContext';
import {ConnectivityContext} from '../../contexts/ConnectivityContext';
import {moderateScale, verticalScale} from '../../constants/metrics';
import {FontWeights} from '../../constants/fonts';

const platforms = [
  {name: 'Instagram', icon: 'instagram'},
  {name: 'Facebook', icon: 'facebook'},
  {name: 'Twitter/X', icon: 'twitter'},
  {name: 'Snapchat', icon: 'snapchat'},
  {name: 'LinkedIn', icon: 'linkedin'},
  {name: 'TikTok', icon: 'music-note'},
];

/**
 * SocialMediaLinker
 * Props:
 * - value: object mapping platform names to links (controlled)
 * - onChange: callback(updatedLinks) when links change
 */
export default function SocialMediaLinker({value = {}, onChange}) {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const {isConnected} = useContext(ConnectivityContext);
  const [links, setLinks] = useState(value);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const scales = useRef(platforms.map(() => new Animated.Value(1))).current;
  const inputRefs = useRef({});

  useEffect(() => {
    setLinks(value || {});
  }, [value]);

  useEffect(() => {
    if (editingPlatform && inputRefs.current[editingPlatform]) {
      inputRefs.current[editingPlatform].focus();
    }
  }, [editingPlatform]);

  const showToast = msg => {
    if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
    else console.warn(msg);
  };

  const handleBoxPress = (name, idx) => {
    if (!isConnected) {
      showToast('No internet connection');
      return;
    }
    Animated.sequence([
      Animated.timing(scales[idx], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scales[idx], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setEditingPlatform(name));
  };

  const handleLinkChange = (name, text) => {
    const updated = {...links, [name]: text};
    setLinks(updated);
    onChange && onChange(updated);
  };

  const finishEditing = () => setEditingPlatform(null);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.surface, borderColor: colors.border},
      ]}>
      <Text
        style={[
          styles.label,
          {
            color: colors.text,
            fontFamily: fonts.bold,
            fontSize: fontSizes.large,
          },
        ]}>
        Link your Social Media Profiles
      </Text>
      <View style={styles.boxContainer}>
        {platforms.map((platformObj, idx) => {
          const {name, icon} = platformObj;
          const isEdit = editingPlatform === name;
          const hasLink = !!links[name];
          return (
            <Animated.View
              key={name}
              style={{transform: [{scale: scales[idx]}]}}>
              <TouchableOpacity
                activeOpacity={Platform.select({ios: 0.7, android: 0.85})}
                onPress={() => handleBoxPress(name, idx)}
                style={[
                  styles.box,
                  {
                    //borderColor: colors.border,
                    borderColor: colors.border,
                    borderStyle: hasLink ? 'solid' : 'dashed',
                    backgroundColor: hasLink
                      ? colors.lightSky || colors.surface
                      : 'transparent',
                    ...Platform.select({
                      ios: {
                        shadowColor: colors.shadow || '#000',
                        shadowOffset: {width: 0, height: moderateScale(2)},
                        shadowOpacity: 0.2,
                        shadowRadius: moderateScale(4),
                        elevation: Platform.OS === 'android' ? 3 : 0,
                      },
                      android: {
                        elevation: 3,
                      },
                    }),
                  },
                ]}>
                <View style={styles.iconRow}>
                  <MaterialCommunityIcons
                    name={icon}
                    size={moderateScale(18)}
                    color={hasLink ? colors.primary : colors.teal}
                    style={{marginRight: moderateScale(6)}}
                  />
                  {isEdit ? (
                    <TextInput
                      ref={el => (inputRefs.current[name] = el)}
                      value={links[name] || ''}
                      onChangeText={text => handleLinkChange(name, text.trim())}
                      onBlur={finishEditing}
                      autoFocus
                      placeholder={`Paste ${name} link`}
                      placeholderTextColor={colors.disable}
                      style={[
                        styles.input,
                        {
                          color: !colors.text,
                          fontFamily: fonts.regular,
                          fontSize: fontSizes.small,
                        },
                      ]}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.text,
                        {
                         // color: colors.text,
                          color : hasLink ? '#000000' : colors.text,
                          fontWeight: FontWeights.bold,
                          fontFamily: fonts.medium,
                          fontSize: fontSizes.small,
                        },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {name}
                    </Text>
                  )}
                  {hasLink && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={moderateScale(16)}
                      color={colors.goodThumbsColor}
                      style={{marginLeft: moderateScale(6)}}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    marginVertical: verticalScale(10),
  },
  label: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
    textDecorationLine: 'underline',
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    minHeight: verticalScale(30),
    margin: moderateScale(4),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'transparent',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: moderateScale(200),
  },
  text: {
    flexShrink: 1,
  },
  input: {
    flexShrink: 1,
    padding: 0,
    textAlign: 'left',
  },
});
