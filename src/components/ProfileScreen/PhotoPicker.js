import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';

const MAX_PHOTOS = 5;

export default function PhotoPicker() {
  const { colors, fonts, fontSizes } = React.useContext(ThemeContext);
  const [photos, setPhotos] = useState([]);
  const { width } = useWindowDimensions();

  const getPermission = async () => {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await check(permissionType);
    if (result === RESULTS.GRANTED) return true;
    const requestResult = await request(permissionType);
    return requestResult === RESULTS.GRANTED;
  };

  const handleAddPhoto = async () => {
    if (!(await getPermission())) {
      Alert.alert('Permission required', 'App needs photo library access');
      return;
    }
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets[0].uri;
      setPhotos(prev => prev.length < MAX_PHOTOS ? [...prev, uri] : prev);
    });
  };

  const handleDelete = index => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // grid item size dynamic
  const boxSize = moderateScale((width - moderateScale(40)) / 3.7);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>      
      <Text
        style={[
          styles.title,
          { color: colors.text, fontFamily: fonts.medium, fontSize: fontSizes.medium },
        ]}>
        Please add the Gebili Images
      </Text>
      <ScrollView
        contentContainerStyle={styles.grid}
        nestedScrollEnabled
      >
        {photos.map((uri, idx) => (
          <View key={idx} style={[styles.box, { width: boxSize, height: boxSize }]}>            
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.delete}
              onPress={() => handleDelete(idx)}>
              <Icon name="close-circle" size={moderateScale(18)} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        {Array.from({ length: MAX_PHOTOS - photos.length }).map((_, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.add, {backgroundColor:colors.disable, width: boxSize, height: boxSize, borderColor: colors.border }]}
            onPress={handleAddPhoto}>
            <Icon name="add" size={moderateScale(32)} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(10),
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  box: {
    margin: moderateScale(5),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  delete: {
    position: 'absolute',
    top: moderateScale(4),
    right: moderateScale(4),
  },
  add: {
    margin: moderateScale(5),
    borderWidth: moderateScale(1),
    borderStyle: 'dashed',
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
