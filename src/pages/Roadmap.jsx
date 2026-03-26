import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Card, LinearProgress, Chip, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Confetti from 'react-confetti';
import api from '../services/api';

const Roadmap = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [careerTitle, setCareerTitle] = useState('');
    const [progress, setProgress] = useState(0);

    // UI State for Progression Events
    const [showConfetti, setShowConfetti] = useState(false);
    const [promotionDialog, setPromotionDialog] = useState({ open: false, level: '' });
    const [achievementSnack, setAchievementSnack] = useState({ open: false, title: '' });

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const data = await api.roadmap.get();
                setCareerTitle(data.career);
                setProgress(data.progress || 0);

                if (data.roadmapData && data.roadmapData.phases) {
                    const allTasks = data.roadmapData.phases.flatMap(phase => phase.tasks);
                    setTasks(allTasks);
                }
            } catch (error) {
                console.error("Failed to fetch roadmap", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, []);

    // Optimized Toggle Handler
    const handleToggle = React.useCallback(async (id, currentStatus) => {
        try {
            const response = await api.roadmap.updateProgress({ taskId: id, completed: !currentStatus });

            // Only strictly necessary updates
            const updatedRoadmap = response.roadmap;

            // Batch updates if possible or check if really changed
            setCareerTitle(updatedRoadmap.career);
            setProgress(updatedRoadmap.progress);

            if (updatedRoadmap.roadmapData && updatedRoadmap.roadmapData.phases) {
                // Functional update not straightforward here due to flattened structure, but new ref needed anyway
                setTasks(updatedRoadmap.roadmapData.phases.flatMap(phase => phase.tasks));
            }

            if (response.newAchievement) {
                setAchievementSnack({ open: true, title: response.newAchievement.title });
            }

            if (response.promotion && response.promotion.promoted) {
                setShowConfetti(true);
                setPromotionDialog({ open: true, level: response.promotion.nextLevel });
                setTimeout(() => setShowConfetti(false), 8000);
            }

        } catch (error) {
            console.error("Failed to update progress", error);
        }
    }, []);

    const handleSelectionRedirect = () => {
        window.location.href = '/career-select';
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Skeleton variant="text" width="60%" height={60} />
                <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                <Skeleton variant="rectangular" height={300} />
            </Container>
        );
    }

    if (!careerTitle) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <EmojiEventsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Start Your Journey
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                    You haven't selected a career path yet. Choose a career to generate your personalized learning roadmap.
                </Typography>
                <Button variant="contained" size="large" onClick={handleSelectionRedirect}>
                    Select Career
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Career Roadmap: {careerTitle}
            </Typography>

            <Card sx={{ mb: 4, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">Level Progress</Typography>
                    <Typography variant="h6" color="primary">{Math.round(progress)}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
            </Card>

            <List>
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <RoadmapTaskItem key={task.id} task={task} index={index} onToggle={handleToggle} />
                    ))}
                </AnimatePresence>
            </List>

            {/* Achievement Snackbar */}
            <Snackbar open={achievementSnack.open} autoHideDuration={6000} onClose={() => setAchievementSnack({ ...achievementSnack, open: false })}>
                <Alert onClose={() => setAchievementSnack({ ...achievementSnack, open: false })} severity="success" sx={{ width: '100%' }}>
                    🏆 Achievement Unlocked: {achievementSnack.title}!
                </Alert>
            </Snackbar>

            {/* Promotion Dialog */}
            <Dialog open={promotionDialog.open} onClose={() => setPromotionDialog({ ...promotionDialog, open: false })}>
                <DialogTitle>🎉 Congratulations!</DialogTitle>
                <DialogContent>
                    <Typography>
                        You have mastered this level! You are now promoted to <strong>{promotionDialog.level}</strong>.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Your roadmap has been updated with new challenges suitable for your new level.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPromotionDialog({ ...promotionDialog, open: false })} variant="contained">
                        Let's Go!
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

// Optimization: Memoized Task Item to prevent full list re-render on single toggle
const RoadmapTaskItem = React.memo(({ task, index, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <ListItem disablePadding sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <ListItemButton onClick={() => onToggle(task.id, task.completed)} dense>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={!!task.completed}
                            tabIndex={-1}
                            disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={task.text}
                        primaryTypographyProps={{
                            fontWeight: 500,
                            style: { textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'gray' : 'inherit' }
                        }}
                    />
                    {task.points > 0 && (
                        <Chip
                            icon={<EmojiEventsIcon />}
                            label={`${task.points} XP`}
                            size="small"
                            color={task.completed ? "success" : "default"}
                            variant="outlined"
                        />
                    )}
                </ListItemButton>
            </ListItem>
        </motion.div>
    );
});

export default Roadmap;
