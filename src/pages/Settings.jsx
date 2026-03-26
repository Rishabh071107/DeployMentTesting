import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Switch, Divider, Button, Paper, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { ChromePicker } from 'react-color';

const Settings = () => {
    const navigate = useNavigate();
    const { mode, toggleMode, colorScheme, changeColorScheme, customColor } = useThemeContext();
    const [showPicker, setShowPicker] = React.useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ mb: 4 }}>
                Settings
            </Typography>

            <Paper sx={{ mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'visible' }} elevation={0}>
                <List>
                    <ListItem>
                        <ListItemText primary="Dark Mode" secondary="Switch between light and dark themes" />
                        <Switch edge="end" checked={mode === 'dark'} onChange={toggleMode} />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 3 }}>
                        <ListItemText primary="Color Scheme" secondary="Choose your preferred accent color" sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant={colorScheme === 'green' ? "contained" : "outlined"}
                                onClick={() => changeColorScheme('green')}
                                sx={{ borderRadius: '20px', textTransform: 'none' }}
                            >
                                Green
                            </Button>
                            <Button
                                variant={colorScheme === 'blue' ? "contained" : "outlined"}
                                onClick={() => changeColorScheme('blue')}
                                sx={{ borderRadius: '20px', textTransform: 'none' }}
                            >
                                Blue
                            </Button>
                            <Box sx={{ position: 'relative' }}>
                                <Button
                                    variant={colorScheme === 'custom' ? "contained" : "outlined"}
                                    onClick={() => {
                                        changeColorScheme('custom', customColor);
                                        setShowPicker(!showPicker);
                                    }}
                                    sx={{
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        bgcolor: colorScheme === 'custom' ? customColor : 'transparent',
                                        borderColor: customColor,
                                        color: colorScheme === 'custom' ? '#fff' : customColor,
                                        '&:hover': {
                                            bgcolor: colorScheme === 'custom' ? customColor : alpha(customColor, 0.1),
                                        }
                                    }}
                                >
                                    Custom
                                </Button>
                                {showPicker && (
                                    <Box sx={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, mt: 2 }}>
                                        <ChromePicker
                                            color={customColor}
                                            onChange={(color) => changeColorScheme('custom', color.hex)}
                                            disableAlpha
                                        />
                                        <Box sx={{ textAlign: 'center', mt: 1, bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 3 }}>
                                            <Button size="small" onClick={() => setShowPicker(false)}>Close</Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ mb: 4, p: 2 }}>
                <Typography variant="h6" gutterBottom>About CareerBud</Typography>
                <Typography variant="body2" color="text.secondary">
                    Version 1.0.0 (Phase 2)
                    <br />
                    Designed for students to explore and plan their careers.
                </Typography>
            </Paper>

            <Box sx={{ textAlign: 'center' }}>
                <Button variant="outlined" color="error" size="large" onClick={handleLogout}>
                    Log Out
                </Button>
            </Box>
        </Container>
    );
};

export default Settings;
