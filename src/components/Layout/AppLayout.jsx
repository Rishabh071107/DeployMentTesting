import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 80;

const NAVIGATION_ITEMS = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Roadmap', icon: <MapIcon />, path: '/career-map' }, // Placeholder path for now
    { label: 'Profile', icon: <PersonIcon />, path: '/profile' }, // Placeholder path for now
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' }, // Placeholder path for now
];

const AppLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const currentPath = location.pathname;

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default' }}>
            {/* Desktop Navigation Rail */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            py: 2,
                            borderRight: 'none',
                            backgroundColor: 'background.paper',
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                        {/* Logo Placeholder */}
                        <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '50%', mb: 2 }} />

                        <List sx={{ width: '100%' }}>
                            {NAVIGATION_ITEMS.map((item) => (
                                <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
                                    <Tooltip title={item.label} placement="right">
                                        <ListItemButton
                                            onClick={() => handleNavigation(item.path)}
                                            selected={currentPath === item.path}
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: 'center',
                                                px: 2.5,
                                                borderRadius: 2,
                                                mx: 1,
                                                mb: 1,
                                                '&.Mui-selected': {
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: 'primary.light',
                                                    },
                                                    '& .MuiListItemIcon-root': {
                                                        color: 'primary.main',
                                                    },
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: 'auto',
                                                    justifyContent: 'center',
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </Tooltip>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Box>
                        <Tooltip title="Logout" placement="right">
                            <IconButton color="error">
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Drawer>
            )}

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflow: 'auto',
                    p: 3,
                    pb: isMobile ? 10 : 3, // Add padding for bottom nav on mobile
                }}
            >
                <Outlet />
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={currentPath}
                        onChange={(event, newValue) => {
                            handleNavigation(newValue);
                        }}
                    >
                        {NAVIGATION_ITEMS.map((item) => (
                            <BottomNavigationAction
                                key={item.label}
                                label={item.label}
                                value={item.path}
                                icon={item.icon}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )}
        </Box>
    );
};

export default AppLayout;
