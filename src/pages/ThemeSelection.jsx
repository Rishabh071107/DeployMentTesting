import React from 'react';
import { Container, Typography, Box, Paper, Button, ToggleButton, ToggleButtonGroup, Card, CardActionArea, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { ChromePicker } from 'react-color';
import PaletteIcon from '@mui/icons-material/Palette';

const ThemeSelection = () => {
    const navigate = useNavigate();
    const { mode, toggleMode, colorScheme, changeColorScheme, customColor } = useThemeContext();
    const theme = useTheme();
    const [showPicker, setShowPicker] = React.useState(false);
    const [localCustomColor, setLocalCustomColor] = React.useState(customColor);

    const handleContinue = () => {
        navigate('/career-select');
    };

    const handleCustomChange = (color) => {
        setLocalCustomColor(color.hex);
        changeColorScheme('custom', color.hex);
    };

    return (
        <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Make it yours
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Choose a look that inspires you.
                    </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4, mb: 6 }}>
                    {/* Green Theme Option */}
                    <Card
                        elevation={colorScheme === 'green' ? 4 : 1}
                        sx={{
                            border: colorScheme === 'green' ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                            transform: colorScheme === 'green' ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <CardActionArea onClick={() => changeColorScheme('green')} sx={{ height: '100%', p: 2 }}>
                            <Box sx={{ height: 120, bgcolor: '#006C4C', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {colorScheme === 'green' && <CheckCircleIcon sx={{ color: 'white', fontSize: 40 }} />}
                            </Box>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Natural Green</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Calm & Focused.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    {/* Blue Theme Option */}
                    <Card
                        elevation={colorScheme === 'blue' ? 4 : 1}
                        sx={{
                            border: colorScheme === 'blue' ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                            transform: colorScheme === 'blue' ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <CardActionArea onClick={() => changeColorScheme('blue')} sx={{ height: '100%', p: 2 }}>
                            <Box sx={{ height: 120, bgcolor: '#36618E', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {colorScheme === 'blue' && <CheckCircleIcon sx={{ color: 'white', fontSize: 40 }} />}
                            </Box>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Focus Blue</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Clear & Professional.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    {/* Custom Theme Option */}
                    <Card
                        elevation={colorScheme === 'custom' ? 4 : 1}
                        sx={{
                            border: colorScheme === 'custom' ? `2px solid ${customColor}` : '1px solid transparent',
                            transform: colorScheme === 'custom' ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        <CardActionArea
                            onClick={() => {
                                changeColorScheme('custom', localCustomColor);
                                setShowPicker(!showPicker);
                            }}
                            sx={{ height: '100%', p: 2 }}
                        >
                            <Box sx={{ height: 120, bgcolor: localCustomColor, borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {colorScheme === 'custom' ? <PaletteIcon sx={{ color: 'white', fontSize: 40 }} /> : <PaletteIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 40 }} />}
                            </Box>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Custom Style</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pick your vibe.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        {showPicker && colorScheme === 'custom' && (
                            <Box sx={{ position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, 10px)', zIndex: 10 }}>
                                <ChromePicker color={localCustomColor} onChange={handleCustomChange} disableAlpha />
                                <Box sx={{ textAlign: 'center', mt: 1, bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 3 }}>
                                    <Button size="small" onClick={() => setShowPicker(false)}>Close</Button>
                                </Box>
                            </Box>
                        )}
                    </Card>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={toggleMode}
                        aria-label="theme mode"
                        sx={{ bgcolor: 'background.paper' }}
                    >
                        <ToggleButton value="light" aria-label="light mode">
                            <LightModeIcon sx={{ mr: 1 }} /> Light
                        </ToggleButton>
                        <ToggleButton value="dark" aria-label="dark mode">
                            <DarkModeIcon sx={{ mr: 1 }} /> Dark
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Button variant="contained" size="large" onClick={handleContinue} sx={{ px: 6 }}>
                        Confirm Style
                    </Button>
                </Box>

            </motion.div>
        </Container>
    );
};

export default ThemeSelection;
