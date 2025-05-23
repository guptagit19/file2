import React, {useContext, useEffect, useRef} from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {moderateScale} from '../../constants/metrics';
import {ThemeContext} from '../../contexts/ThemeContext';

const {width, height} = Dimensions.get('window');

export default function GlobalAlertBanner({
  type = 'info',
  title = 'Alert',
  message = 'This is an alert message.',
  onConfirm,
  onCancel,
  iconName = 'info-outline', // Default icon
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const {colors, fonts, fontSizes} = useContext(ThemeContext);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim,scaleAnim]);

  const bgColor = {
    success: colors.success || '#4CAF50',
    error: colors.error || '#F44336',
    info: colors.primary || '#2196F3',
  }[type];

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.alertBox,
          {
            backgroundColor: colors.card,
            transform: [{scale: scaleAnim}],
            opacity: fadeAnim,
          },
        ]}>
        {/* Icon */}
        <View style={[styles.iconCircle, {backgroundColor: bgColor}]}>
          <Icon name={iconName} size={30} color="#fff" />
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            {color: colors.text, fontFamily: fonts.semiBold},
          ]}>
          {title}
        </Text>

        {/* Message */}
        <Text
          style={[
            styles.message,
            {color: colors.text, fontFamily: fonts.regular},
          ]}>
          {message}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.border}]}
            onPress={onCancel}>
            <Text style={{color: colors.text, fontFamily: fonts.medium}}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: bgColor}]}
            onPress={onConfirm}>
            <Text style={{color: '#fff', fontFamily: fonts.medium}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  alertBox: {
    width: width * 0.8,
    padding: moderateScale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    marginBottom: 8,
  },
  message: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
