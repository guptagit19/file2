// src/contexts/ThemeContext.js
import React, {createContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';
import {storage} from './storagesMMKV';
import {Colors} from '../constants/colors';
import {Fonts, FontSizes, FontWeights} from '../constants/fonts';

const STORAGE_KEY = 'user_theme';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  clearTheme: () => {},
});

export const ThemeProvider = ({children}) => {
  const systemPref = Appearance.getColorScheme() || 'light';
  const saved = storage.getString(STORAGE_KEY);
  const [theme, setTheme] = useState(saved || systemPref);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({colorScheme}) => {
      if (!storage.getString(STORAGE_KEY)) {
        setTheme(colorScheme);
      }
    });
    return () => sub.remove();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    storage.set(STORAGE_KEY, next);
    setTheme(next);
  };

  const clearTheme = () => {
    storage.delete(STORAGE_KEY);
    const sys = Appearance.getColorScheme() || 'light';
    setTheme(sys);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        clearTheme,
        colors: Colors[theme],
        fonts: Fonts,
        fontSizes: FontSizes,
        fontWeights: FontWeights,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
