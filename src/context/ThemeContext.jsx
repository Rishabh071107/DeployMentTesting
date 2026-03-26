import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from '../styles/theme';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Load preferences from local storage
    const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
    const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('colorScheme') || 'green');
    const [customColor, setCustomColor] = useState(() => localStorage.getItem('customColor') || '#6200ea');

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
        localStorage.setItem('colorScheme', colorScheme);
        localStorage.setItem('customColor', customColor);
    }, [mode, colorScheme, customColor]);

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const changeColorScheme = (scheme, color = null) => {
        setColorScheme(scheme);
        if (scheme === 'custom' && color) {
            setCustomColor(color);
        }
    };

    // Create the theme based on current mode, color scheme, and custom color
    const theme = useMemo(() => createTheme(getDesignTokens(mode, colorScheme, customColor)), [mode, colorScheme, customColor]);

    return (
        <ThemeContext.Provider value={{ mode, toggleMode, colorScheme, changeColorScheme, customColor }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
