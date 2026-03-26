
import { alpha, lighten, darken } from '@mui/material/styles';

const generatePalette = (baseColor, isDark) => {
    // Basic palette generation logic based on a single hex color
    const primaryMain = baseColor;
    // For dark mode, we might want a lighter version as main, or keep it and adjust contrast
    // Material 3 usually desaturates/lightens for dark mode.
    // Let's do simple logic:

    if (isDark) {
        return {
            primary: { main: lighten(baseColor, 0.4), contrastText: '#000000' },
            secondary: { main: lighten(baseColor, 0.2), contrastText: '#000000' },
            background: { default: '#121212', paper: '#1E1E1E' },
            text: { primary: '#ffffff', secondary: alpha('#ffffff', 0.7) },
        };
    } else {
        return {
            primary: { main: baseColor, contrastText: '#ffffff' },
            secondary: { main: lighten(baseColor, 0.2), contrastText: '#ffffff' },
            background: { default: '#FAFAFA', paper: '#FFFFFF' },
            text: { primary: '#000000', secondary: alpha('#000000', 0.6) },
        };
    }
};

const greenPalette = {
    light: {
        primary: { main: '#006C4C', contrastText: '#ffffff' },
        secondary: { main: '#4C6358', contrastText: '#ffffff' },
        background: { default: '#FBFDF9', paper: '#F0F5F1' },
        text: { primary: '#191C1A', secondary: '#414945' },
    },
    dark: {
        primary: { main: '#7EDB9A', contrastText: '#003825' },
        secondary: { main: '#B3CCBE', contrastText: '#1E352B' },
        background: { default: '#191C1A', paper: '#202522' },
        text: { primary: '#E1E3DF', secondary: '#C1C9C4' },
    },
};

const bluePalette = {
    light: {
        primary: { main: '#36618E', contrastText: '#ffffff' },
        secondary: { main: '#535F70', contrastText: '#ffffff' },
        background: { default: '#F8F9FF', paper: '#F0F4FA' },
        text: { primary: '#181C20', secondary: '#43474E' },
    },
    dark: {
        primary: { main: '#A0CAFD', contrastText: '#003258' },
        secondary: { main: '#BBC7DB', contrastText: '#253140' },
        background: { default: '#101418', paper: '#1A1C20' },
        text: { primary: '#E1E2E8', secondary: '#C3C6CF' },
    },
};

export const getDesignTokens = (mode, colorScheme, customColor) => {
    let schemePalette;

    if (colorScheme === 'custom' && customColor) {
        schemePalette = generatePalette(customColor, mode === 'dark');
    } else {
        const palettes = {
            green: greenPalette,
            blue: bluePalette
        };
        const selected = palettes[colorScheme] || greenPalette;
        schemePalette = mode === 'dark' ? selected.dark : selected.light;
    }

    // Material 3 polish overrides can go here if needed
    // ...

    return {
        palette: {
            mode,
            ...schemePalette,
        },
        typography: {
            fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontSize: '3rem', fontWeight: 700 },
            h2: { fontSize: '2.5rem', fontWeight: 600 },
            h3: { fontSize: '2rem', fontWeight: 600 },
            h4: { fontSize: '1.75rem', fontWeight: 500 },
            h5: { fontSize: '1.5rem', fontWeight: 500 },
            h6: { fontSize: '1.25rem', fontWeight: 500 },
            button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
            borderRadius: 16,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 24,
                        padding: '10px 24px',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 24,
                        width: '100%',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 12,
                        },
                    },
                },
            }
        },
    };
};
