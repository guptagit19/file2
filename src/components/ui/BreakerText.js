// components/BreakerText.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { moderateScale,verticalScale } from '../../constants/metrics';

const BreakerText = ({
  text,
  color = '#666',
  fontSize = 14,
  marginVertical = 0,
}) => {
  return (
    <View style={[styles.container, {marginVertical}]}>
      <View style={[styles.line, {backgroundColor: color}]} />
      <Text style={[styles.text, {color, fontSize}]}>{text}</Text>
      <View style={[styles.line, {backgroundColor: color}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(10),
    marginHorizontal: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BreakerText;
