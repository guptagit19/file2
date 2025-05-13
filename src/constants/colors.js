// src/constants/colors.js
export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F2', // very light gray card background
    text: '#222222',
    //border: '#E0E0E0', // <-- light divider
    shadow: 'rgba(0, 0, 0, 0.12)',   // very soft black shadow
    border: '#1E232A',
    primary: '#4A90E2',
    error: '#D0021B',
    disable: '#A9A9A9', // a mid‐tone gray for light mode
    teal: '#008080', // your custom color
    fullStar: '#FFD700',
    emptyStar: '#FFD700',
    goodThumbsColor: '#4CAF50',
    badThumbsColor: '#E53935',
    lightSky: '#e3eceb',
  },
  dark: {
    //background: '#121212',
    //background: '#142842',
    // background: '#1E232A',
    // surface: '#1E1E1E', // slightly lighter than background

    surface: '#1E232A',
    background: '#121212', // slightly lighter than background
    shadow: 'rgba(0, 0, 0, 0.60)',   // stronger shadow to show up on dark
    text: '#EEEEEE',
    //border: '#2C2C2E', // <-- dark divider
    border: 'rgba(255,255,255,0.12)', 
    primary: '#1E88E5',
    error: '#EF5350',
    disable: 'rgba(255,255,255,0.3)', // light translucent gray for dark mode
    teal: '#008080',
    fullStar: '#FFD700',
    emptyStar: '#FFD700',
    goodThumbsColor: '#4CAF50',
    badThumbsColor: '#E53935',
    lightSky: '#e3eceb',
  },
};
