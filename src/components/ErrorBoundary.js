// src/components/ErrorBoundary.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {Strings} from '../constants/strings';

export default class ErrorBoundary extends React.Component {
  state = {hasError: false, error: null};

  static getDerivedStateFromError(error) {
    return {hasError: true, error};
  }

  componentDidCatch(error, info) {
    console.log('ErrorBoundary caught error:', error, info);
    Toast.show({
      type: 'error',
      text1: Strings.errorTitle,
      text2: error.toString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{Strings.errorTitle}</Text>
          <Text style={styles.message}>{this.state.error.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
  message: {fontSize: 14},
});
