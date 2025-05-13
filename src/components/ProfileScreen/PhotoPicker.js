import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { moderateScale, verticalScale } from '../../constants/metrics';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

// Dependencies:
// npm install react-native-permissions react-native-image-picker react-native-vector-icons

const MAX_PHOTOS = 5;

export default function PhotoPicker() {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);
  const [photos, setPhotos] = useState([]);

  const getPermission = async () => {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await check(permissionType);
    if (result === RESULTS.GRANTED) return true;

    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      const requestResult = await request(permissionType);
      return requestResult === RESULTS.GRANTED;
    }

    Alert.alert('Permission Denied', 'Cannot access photo library');
    return false;
  };

  const handleAddPhoto = async () => {
    const granted = await getPermission();
    if (!granted) return;

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets[0]?.uri;
      if (!uri) return;
      if (photos.length < MAX_PHOTOS) {
        setPhotos(prev => [...prev, uri]);
      } else {
        Alert.alert(
          'Limit Reached',
          `You can only add up to ${MAX_PHOTOS} photos.`,
        );
      }
    });
  };

  const handleDeletePhoto = index => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const renderSlot = (uri, index) => (
    <View
      key={index}
      style={[
        styles.photoBox,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
          width: moderateScale(80),
          height: moderateScale(80),
        },
      ]}>
      <Image source={{uri}} style={styles.imageStyle} />
      <TouchableOpacity
        style={[
          styles.deleteIcon,
          {
            backgroundColor: colors.error,
            top: moderateScale(-6),
            right: moderateScale(-6),
          },
        ]}
        onPress={() => handleDeletePhoto(index)}>
        <Icon
          name="close-circle"
          size={moderateScale(18)}
          color={colors.background}
        />
      </TouchableOpacity>
    </View>
  );

  const renderAddSlot = idx => (
    <TouchableOpacity
      key={`add-${idx}`}
      style={[
        styles.addBox,
        {
          borderColor: colors.border,
          width: moderateScale(80),
          height: moderateScale(80),
        },
      ]}
      onPress={handleAddPhoto}>
      <Icon name="add" size={moderateScale(30)} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {borderColor: colors.border}]}>
      <Text
        style={[
          styles.label,
          {
            color: colors.text,
            fontFamily: fonts.medium,
            fontSize: fontSizes.medium,
          },
        ]}>
        Please add up to {MAX_PHOTOS} photos
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}>
        {[
          ...photos.map(renderSlot),
          ...Array(MAX_PHOTOS - photos.length)
            .fill()
            .map((_, i) => renderAddSlot(i)),
        ]}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(10),
    padding: moderateScale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(10),
  },
  label: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
    textDecorationLine: 'underline',
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoBox: {
    marginRight: moderateScale(10),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  addBox: {
    marginRight: moderateScale(10),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  deleteIcon: {
    position: 'absolute',
    padding: moderateScale(2),
    borderRadius: moderateScale(10),
  },
});
