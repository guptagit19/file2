/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
// src/navigation/TabNavigator.js
import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {moderateScale} from '../constants/metrics';
import {ThemeContext} from '../contexts/ThemeContext';
import {Strings} from '../constants/strings';

import DatingScreen from '../screens/DatingScreen';
import CommunityScreen from '../screens/CommunityScreen';
import LifePartnerScreen from '../screens/LifePartnerScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const {colors, fonts, fontSizes} = useContext(ThemeContext);

  const tabs = [
    {
      name: 'Dating',
      component: DatingScreen,
      icon: ['heart-outline', 'heart'],
      label: Strings.datingTab,
    },
    {
      name: 'Community',
      component: CommunityScreen,
      icon: ['people-outline', 'people'],
      label: Strings.communityTab,
    },
    {
      name: 'LifePartner',
      component: LifePartnerScreen,
      icon: ['ribbon-outline', 'ribbon'],
      label: Strings.lifePartnerTab,
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: moderateScale(70),
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      {tabs.map(({name, component, icon, label}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabContainer}>
                {/* Top indicator */}
                <View
                  style={{
                    height: focused ? 3 : 0,
                    width: moderateScale(30),
                    backgroundColor: colors.primary,
                    borderTopLeftRadius: focused ? 3 : 0,
                    borderTopRightRadius: focused ? 3 : 0,
                    marginBottom: moderateScale(6),
                  }}
                />
                {/* Pill & icon */}
                <View
                  style={{
                    padding: moderateScale(8),
                    borderRadius: moderateScale(20),
                    backgroundColor: focused
                      ? `${colors.primary}20`
                      : 'transparent',
                  }}>
                  <Ionicons
                    name={focused ? icon[1] : icon[0]}
                    size={moderateScale(24)}
                    color={focused ? colors.primary : colors.text}
                  />
                </View>
                {/* Forced single‐line label */}
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: fontSizes.small,
                    color: focused ? colors.primary : colors.text,
                    marginTop: moderateScale(4),
                  }}>
                  {label}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    width: moderateScale(80), // ensure enough room for label
    alignItems: 'center',
    justifyContent: 'center',
  },
});
