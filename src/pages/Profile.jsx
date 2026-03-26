import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Tabs, Tab, Avatar, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import api from '../services/api';

const Profile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({ weeklyProgress: [], achievements: [] });
    const [userProfile, setUserProfile] = useState({ name: 'Student', level: 'Beginner' });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const currentUser = api.auth.getCurrentUser(); // Get name from local auth state
                const roadmapData = await api.roadmap.get(); // Get detailed stats from backend

                if (roadmapData.userStats) {
                    setUserStats(roadmapData.userStats);
                }

                setUserProfile({
                    name: currentUser ? currentUser.name : 'Student',
                    level: roadmapData.level || 'Beginner'
                });

            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Transform Weekly Progress for Chart
    const graphData = userStats.weeklyProgress.length > 0
        ? userStats.weeklyProgress.map(wp => ({ name: `Week ${wp.week}`, points: wp.points }))
        : [{ name: 'Start', points: 0 }];

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Skeleton variant="circular" width={80} height={80} />
                <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" height={300} sx={{ mt: 4 }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3, fontSize: '2rem' }}>
                    {userProfile.name[0]}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold">{userProfile.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">Software Engineer • {userProfile.level}</Typography>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Progress" />
                    <Tab label="Achievements" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card sx={{ p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Weekly XP Growth</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={graphData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Line type="monotone" dataKey="points" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                {graphData.length === 1 && graphData[0].points === 0 && (
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                        Complete tasks to see your progress graph!
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {tabValue === 1 && (
                <Grid container spacing={2}>
                    {userStats.achievements.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                                <Typography variant="h6">No achievements yet.</Typography>
                                <Typography>Complete 15 tasks to unlock your first badge!</Typography>
                            </Box>
                        </Grid>
                    ) : (
                        userStats.achievements.map((badge, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                                    <Card sx={{
                                        textAlign: 'center',
                                        p: 2,
                                        bgcolor: 'primary.light', // Highlight unlocked badges
                                        color: 'primary.contrastText'
                                    }}>
                                        <Typography variant="h1" sx={{ mb: 1 }}>
                                            {/* Generic Trophy for now, or map badgeIcon string if we had an icon set */}
                                            🏆
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {badge.title}
                                        </Typography>
                                        <Typography variant="caption">
                                            {badge.description}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default Profile;
