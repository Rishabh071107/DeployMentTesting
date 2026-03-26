import React from 'react';
import { Container, Typography, Box, Grid, Card, CardActionArea, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import LayersIcon from '@mui/icons-material/Layers';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SecurityIcon from '@mui/icons-material/Security';
import BrushIcon from '@mui/icons-material/Brush';
import SchoolIcon from '@mui/icons-material/School'; // Fallback or extra if needed, using Science for Data Scientist

import ScienceIcon from '@mui/icons-material/Science';

const CAREERS = [
    { id: 1, title: 'Software Developer', icon: <CodeIcon />, desc: 'Build robust software solutions.' },
    { id: 2, title: 'Frontend Developer', icon: <WebIcon />, desc: 'Craft beautiful user interfaces.' },
    { id: 3, title: 'Backend Developer', icon: <StorageIcon />, desc: 'Power apps with server logic.' },
    { id: 4, title: 'Full Stack Developer', icon: <LayersIcon />, desc: 'Master both client and server.' },
    { id: 5, title: 'Data Analyst', icon: <AnalyticsIcon />, desc: 'Uncover insights from data.' },
    { id: 6, title: 'Data Scientist', icon: <ScienceIcon />, desc: 'Predict trends with advanced AI.' },
    { id: 7, title: 'AI / ML Engineer', icon: <PsychologyIcon />, desc: 'Build intelligent systems.' },
    { id: 8, title: 'DevOps Engineer', icon: <CloudSyncIcon />, desc: 'Streamline development pipelines.' },
    { id: 9, title: 'Cybersecurity Analyst', icon: <SecurityIcon />, desc: 'Protect systems from threats.' },
    { id: 10, title: 'UI/UX Designer', icon: <BrushIcon />, desc: 'Design intuitive user experiences.' },
];

const CareerSelect = () => {
    const navigate = useNavigate();

    const handleSelect = (career) => {
        localStorage.setItem('selectedCareer', JSON.stringify(career));
        navigate('/setup-career');
    };

    const handleSkip = () => {
        localStorage.removeItem('selectedCareer');
        localStorage.removeItem('careerLevel');
        navigate('/dashboard');
    };

    return (
        <Container maxWidth="xl" sx={{ py: 6, minHeight: '100vh' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" fontWeight="800" gutterBottom sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Choose Your Path
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
                    Select a technology career to assist CareerBud in generating your personalized learning roadmap.
                </Typography>
                <Button variant="text" onClick={handleSkip} color="secondary">
                    Skip for now
                </Button>
            </Box>

            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                {CAREERS.map((career, index) => (
                    <Grid item xs={6} sm={4} md={4} lg={3} key={career.id} sx={{ display: 'flex' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            style={{ width: '100%' }}
                        >
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'visible',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-4px)'
                                }
                            }}>
                                <CardActionArea
                                    onClick={() => handleSelect(career)}
                                    sx={{
                                        flexGrow: 1,
                                        p: { xs: 2, md: 3 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    <Box sx={{
                                        p: 2.5,
                                        borderRadius: '24px',
                                        bgcolor: 'primary.50', // Assuming theme has this or similar, else primary.light with opacity
                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                        color: 'primary.main',
                                        mb: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: { xs: 60, md: 80 },
                                        height: { xs: 60, md: 80 },
                                        transition: '0.3s'
                                    }}>
                                        {React.cloneElement(career.icon, { sx: { fontSize: { xs: 32, md: 40 } } })}
                                    </Box>
                                    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2, mb: 1 }}>
                                        {career.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                                        {career.desc}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CareerSelect;
