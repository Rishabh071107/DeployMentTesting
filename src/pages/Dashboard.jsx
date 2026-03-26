import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, useTheme, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, CircularProgress, Chip, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState(0);
    const [roadmap, setRoadmap] = useState(null);

    // Chat State
    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]); // Start empty to show welcome screen
    const [newMessage, setNewMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    // Fetch User and Roadmap Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = api.auth.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }

                const roadmapData = await api.roadmap.get();
                if (roadmapData) {
                    setRoadmap(roadmapData);
                    setProgress(roadmapData.progress || 0); // Use backend calculated progress
                }
            } catch (error) {
                console.error("Dashboard Fetch Error", error);
            }
        };
        fetchData();
    }, []);

    // Initial greeting triggered if chat is opened and empty
    useEffect(() => {
        if (openChat && messages.length === 0) {
            setMessages([{ sender: 'buddy', text: `Hi ${user ? user.name.split(' ')[0] : 'there'}! I'm CareerBud. Ready to level up?` }]);
        }
    }, [openChat, user]); // Run when chat opens

    const SUGGESTIONS = [
        "Explain my next task",
        "How can I stay motivated?",
        "Debug code help",
        "What is this concept?"
    ];

    const handleSendMessage = async (text = newMessage) => {
        if (!text.trim()) return;

        const userMsg = { sender: 'user', text: text };
        setMessages(prev => [...prev, userMsg]);
        setNewMessage('');
        setChatLoading(true);

        try {
            const response = await api.buddy.chat(userMsg.text);
            const buddyMsg = { sender: 'buddy', text: response.response };
            setMessages(prev => [...prev, buddyMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'buddy', text: "I'm having trouble connecting right now. Try again later!" }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ pb: 4, px: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: { xs: 3, sm: 4 },
                mt: 2,
                gap: 2
            }}>
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="800"
                        sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
                    >
                        Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Welcome back, {user ? user.name.split(' ')[0] : 'Student'}! 👋
                    </Typography>
                </Box>
                <Button
                    onClick={() => navigate('/account')}
                    sx={{ borderRadius: '50%', minWidth: 0, p: 0, alignSelf: { xs: 'flex-end', sm: 'auto' }, mt: { xs: -6, sm: 0 } }} // Move avatar up on mobile
                >
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            width: { xs: 40, sm: 50 },
                            height: { xs: 40, sm: 50 },
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '2px solid #fff'
                        }}
                    >
                        {user ? user.name[0] : 'S'}
                    </Avatar>
                </Button>
            </Box>

            <Grid container spacing={2}>
                {/* Todo List Section - NOW FIRST/EMPHASIZED */}
                <Grid item xs={12} sm={6} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ height: '100%' }}>
                        <Card sx={{
                            height: '100%',
                            minHeight: { xs: 150, sm: 220 },
                            display: 'flex', flexDirection: 'column',
                            borderRadius: 4,
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            transition: 'transfrom 0.2s',
                            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }
                        }} onClick={() => navigate('/todos')}>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60, mb: 2 }}>
                                    <CheckCircleIcon fontSize="large" />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">My Tasks</Typography>
                                <Typography variant="body2" color="text.secondary">Manage your daily todos</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Career Percentage Section */}
                <Grid item xs={12} sm={6} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ height: '100%' }}>
                        <Card sx={{ height: '100%', minHeight: { xs: 180, sm: 220 }, display: 'flex', flexDirection: 'column', p: 0, borderRadius: 4 }}>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 3 } }}>
                                {roadmap ? (
                                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            size={isMobile ? 100 : 120}
                                            sx={{ color: theme.palette.grey[200], position: 'absolute' }}
                                        />
                                        <CircularProgress
                                            variant="determinate"
                                            value={progress}
                                            size={isMobile ? 100 : 120}
                                            thickness={4}
                                            sx={{ color: 'primary.main', strokeLinecap: 'round' }}
                                        />
                                        <Box
                                            sx={{
                                                top: 0, left: 0, bottom: 0, right: 0,
                                                position: 'absolute',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant={isMobile ? "h5" : "h4"} component="div" color="primary" fontWeight="bold">
                                                {Math.round(progress)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: '50%' }}>
                                        <TrendingUpIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                                    </Box>
                                )}
                                <Typography variant="h6" fontWeight="bold">
                                    {roadmap ? roadmap.level : 'No Career Selected'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {roadmap ? (progress === 100 ? 'Level Completed! 🎉' : 'Keep pushing forward!') : 'Start a career path to track progress'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Career Map Section */}
                <Grid item xs={12} sm={6} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ height: '100%' }}>
                        <Card sx={{ height: '100%', minHeight: { xs: 180, sm: 220 }, bgcolor: 'primary.main', color: 'primary.contrastText', position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                            <Box sx={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.2, transform: 'rotate(-15deg)' }}>
                                <MapIcon sx={{ fontSize: 180 }} />
                            </Box>
                            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: { xs: 2, sm: 3 } }}>
                                <Box>
                                    <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>{roadmap ? 'Current Path' : 'Ready to start?'}</Typography>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {roadmap ? roadmap.career : 'Select a Career'}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<MapIcon />}
                                    onClick={() => navigate(roadmap ? '/career-map' : '/career-select')}
                                    sx={{
                                        alignSelf: 'flex-start',
                                        mt: 2,
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        '&:hover': { bgcolor: 'grey.100' }
                                    }}
                                >
                                    {roadmap ? 'Continue Journey' : 'Browse Careers'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Personal Buddy Section */}
                <Grid item xs={12} md={12}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ height: '100%' }}>
                        <Card sx={{ height: '100%', minHeight: { xs: 150, sm: 220 }, display: 'flex', flexDirection: 'column', borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, white 100%)` }}>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: { xs: 2, sm: 3 } }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                            <ChatIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" lineHeight={1}>
                                                Need Help?
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Ask CareerBud anything
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => setOpenChat(true)}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        color: 'text.secondary',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: 'background.default', borderColor: 'primary.main' }
                                    }}
                                >
                                    Type a message...
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Recent Activity / Recommendations Placeholder */}
                <Grid item xs={12}>
                    {/* Can be kept or improved */}
                </Grid>
            </Grid>

            {/* Chat Dialog */}
            <Dialog
                open={openChat}
                onClose={() => setOpenChat(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 4, height: '80vh', maxHeight: 600, overflow: 'hidden' } }}
            >
                <DialogTitle sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    py: 2
                }}>
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}><ChatIcon /></Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">CareerBud</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} /> Online
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0, bgcolor: 'background.default' }}>
                    <List sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {messages.map((msg, index) => (
                            <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', p: 0 }}>
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    sx={{
                                        p: 2,
                                        borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                        boxShadow: 1,
                                        maxWidth: '85%',
                                        lineHeight: 1.5
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Box>
                            </ListItem>
                        ))}
                        {chatLoading && (
                            <ListItem sx={{ justifyContent: 'flex-start', p: 0 }}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: '20px 20px 20px 4px', boxShadow: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">CareerBud is typing</Typography>
                                    <motion.div
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{ width: 4, height: 4, borderRadius: '50%', background: '#888' }}
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                        style={{ width: 4, height: 4, borderRadius: '50%', background: '#888' }}
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                        style={{ width: 4, height: 4, borderRadius: '50%', background: '#888' }}
                                    />
                                </Box>
                            </ListItem>
                        )}
                        <div id="chat-end" />
                    </List>

                    {/* Suggestions */}
                    {messages.length < 3 && !chatLoading && (
                        <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {SUGGESTIONS.map((s) => (
                                <Chip
                                    key={s}
                                    label={s}
                                    onClick={() => handleSendMessage(s)}
                                    clickable
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ bgcolor: 'background.paper', borderColor: 'primary.light' }}
                                />
                            ))}
                        </Box>
                    )}

                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                sx: { borderRadius: 3, bgcolor: 'background.default' },
                                endAdornment: (
                                    <Button onClick={() => handleSendMessage()} disabled={!newMessage.trim()} sx={{ minWidth: 0, p: 1 }}>
                                        <SendIcon color={newMessage.trim() ? "primary" : "disabled"} />
                                    </Button>
                                )
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Container >
    );
};

export default Dashboard;
