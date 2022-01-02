import React from 'react';
import './App.css';
import AppRouter from './components/AppRouter/AppRouter';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';


function App() {
  let theme = createTheme({
    typography: {
      fontFamily: [
        'Kanit', 'sans-serif'
        // 'Patrick Hand',
        // 'cursive',
      ].join(','),
    },});
    theme = responsiveFontSizes(theme);

  return (
    <div className="App wallpaper">
      <ThemeProvider theme={theme}>
        <AppRouter/>
      </ThemeProvider>
    </div>
  );
}

export default App;
