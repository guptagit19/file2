/* eslint-disable react-native/no-inline-styles */
// App.js
import React from 'react';
import {SafeAreaView, StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import {ConnectivityProvider} from './src/contexts/ConnectivityContext';
import {ThemeProvider} from './src/contexts/ThemeContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import {toastConfig} from './src/components/ToastConfig';
import SplashScreen from './src/screens/SplashScreen';
import TabNavigator from './src/navigation/TabNavigator';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen2 from './src/screens/ProfileScreen2';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <ConnectivityProvider>
        <ThemeProvider>
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName = "Splash" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="ProfileScreen2" component={ProfileScreen2} />
                <Stack.Screen name="Main" component={TabNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
            <Toast
              config={toastConfig}
              position="top"
              visibilityTime={4000}
              topOffset={60}
            />
          </SafeAreaView>
        </ThemeProvider>
      </ConnectivityProvider>
    </ErrorBoundary>
  );
}
