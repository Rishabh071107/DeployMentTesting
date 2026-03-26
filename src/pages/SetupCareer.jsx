import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Button, RadioGroup, FormControlLabel, Radio, Slider } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SetupCareer = () => {
    const navigate = useNavigate();
    const [career, setCareer] = useState(null);
    const [level, setLevel] = useState('beginner');
    const [hours, setHours] = useState(1);
    const [duration, setDuration] = useState(3);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const storedCareer = localStorage.getItem('selectedCareer');
        if (storedCareer) {
            setCareer(JSON.parse(storedCareer));
        } else {
            navigate('/career-select');
        }
    }, [navigate]);

    const handleStart = async () => {
        if (!career) return;
        setLoading(true);
        try {
            await api.roadmap.generate({
                career: career.title,
                level,
                hours,
                duration
            });

            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to generate roadmap', error);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h3" gutterBottom align="center" fontWeight="bold" color="primary">
                        {career ? `Setup: ${career.title}` : 'Tailor Your Journey'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6 }}>
                        Customize your learning path for {career ? career.title : 'your new career'}.
                    </Typography>

                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Current Level</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Be honest! This helps us curate the right content.
                        </Typography>

                        <RadioGroup
                            row
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            sx={{ justifyContent: 'space-between', gap: 2 }}
                        >
                            {[
                                { value: 'beginner', label: 'Beginner', desc: 'New to this field' },
                                { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                                { value: 'achiever', label: 'Achiever', desc: 'Ready for mastery' }
                            ].map((option) => (
                                <Paper
                                    key={option.value}
                                    variant="outlined"
                                    sx={{
                                        flex: 1,
                                        p: 2,
                                        cursor: 'pointer',
                                        borderColor: level === option.value ? 'primary.main' : 'divider',
                                        bgcolor: level === option.value ? 'action.selected' : 'transparent',
                                        borderWidth: 2,
                                        borderRadius: 3,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onClick={() => setLevel(option.value)}
                                >
                                    <FormControlLabel
                                        value={option.value}
                                        control={<Radio sx={{ display: 'none' }} />}
                                        label={
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">{option.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">{option.desc}</Typography>
                                            </Box>
                                        }
                                        sx={{ m: 0, width: '100%' }}
                                    />
                                </Paper>
                            ))}
                        </RadioGroup>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Daily Commitment</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            How many hours can you dedicate each day?
                        </Typography>

                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={hours}
                                onChange={(e, val) => setHours(val)}
                                step={0.5}
                                min={0.5}
                                max={8}
                                valueLabelDisplay="on"
                                marks={[
                                    { value: 1, label: '1h' },
                                    { value: 4, label: '4h' },
                                    { value: 8, label: '8h' },
                                ]}
                            />
                        </Box>
                        <Typography align="center" sx={{ mt: 2 }} fontWeight="bold" color="primary">
                            {hours} hours / day
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Duration (Weeks)</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            How many weeks do you want to plan for?
                        </Typography>

                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={duration}
                                onChange={(e, val) => setDuration(val)}
                                step={1}
                                min={1}
                                max={24}
                                valueLabelDisplay="on"
                                marks={[
                                    { value: 4, label: '4w' },
                                    { value: 12, label: '12w' },
                                    { value: 24, label: '24w' },
                                ]}
                            />
                        </Box>
                        <Typography align="center" sx={{ mt: 2 }} fontWeight="bold" color="primary">
                            {duration} weeks
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleStart}
                            disabled={loading}
                            sx={{ px: 8, py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? 'Generating Roadmap...' : 'Start My Career Journey'}
                        </Button>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="text" onClick={() => navigate('/dashboard')} color="secondary">
                                Skip for now
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default SetupCareer;
