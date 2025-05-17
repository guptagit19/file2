import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../contexts/ThemeContext';
import {moderateScale, verticalScale} from '../../constants/metrics';
import BreakerText from '../ui/BreakerText';
import InfoRow from '../ui/InfoRow';
import EditInfoRow from '../ui/EditInfoRow';

/**
 * ProfileMandFields
 * Renders mandatory profile fields organized in responsive themed sections.
 */
export default function ProfileMandFields({values, onChange}) {
  const {colors} = useContext(ThemeContext);

  return (
    <>
      {/* Basic Details Section */}
      <View style={[styles.section, {backgroundColor: colors.surface}]}>
        <InfoRow
          label="👤 First Name"
          value={values.firstName}
          onChange={val => onChange('firstName', val.trim())}
        />
        <InfoRow
          label="👥 Last Name"
          value={values.lastName}
          onChange={val => onChange('lastName', val.trim())}
        />
        <InfoRow
          label="📧 Email"
          value={values.email}
          onChange={val => onChange('email', val.trim())}
        />
        <InfoRow
          label="📱 Phone Number"
          value={values.phoneNumber}
          onChange={val => onChange('phoneNumber', val.trim())}
        />
        <InfoRow
          label="🎂 Age"
          value={String(values.age)}
          onChange={val => onChange('age', val.trim())}
        />
        <InfoRow
          label="⚥ Gender"
          value={values.gender}
          onChange={val => onChange('gender', val.trim())}
        />
        <InfoRow
          label="🔒 Profile Verified"
          value={values.profileVerified}
          onChange={val => onChange('profileVerified', val.trim())}
        />
        <InfoRow
          label="✅ Terms Accepted"
          value={values.termsCondition}
          onChange={val => onChange('termsCondition', val.trim())}
        />
      </View>
      <BreakerText text="📝 Personal & Professional Details" />
      {/* Personal & Professional Details Section */}
      
        <View style={[styles.section, {backgroundColor: colors.surface}]}>
          <View style={[styles.bioContainer, {borderColor: colors.border}]}>
            <EditInfoRow
              label="🎓 University"
              value={values.university}
              onChange={val => onChange('university', val?.trim())}
            />
            <EditInfoRow
              label="🏫 College"
              value={values.college}
              onChange={val => onChange('college', val?.trim())}
            />
            <EditInfoRow
              label="🎓 Graduated From"
              value={values.graduatePlace}
              onChange={val => onChange('graduatePlace', val?.trim())}
            />
            <EditInfoRow
              label="🏢 Company Name"
              value={values.profession}
              onChange={val => onChange('profession', val?.trim())}
            />
            <EditInfoRow
              label="💼 Profession"
              value={values.profession}
              onChange={val => onChange('profession', val?.trim())}
            />
            <EditInfoRow
              label="📏 Height"
              value={String(values.height === null ? '' : values.height)}
              suffix=" inches"
              keyboardType="numeric"
              onChange={val => onChange('height', val?.trim())}
            />
            <EditInfoRow
              label="🏠 Current Living In"
              value={values.currentLivingPlace}
              onChange={val => onChange('currentLivingPlace', val?.trim())}
            />
          </View>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: verticalScale(10),
    padding: moderateScale(12),
  },
  bioContainer: {
    marginTop: verticalScale(8),
    padding: moderateScale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
  },
});
