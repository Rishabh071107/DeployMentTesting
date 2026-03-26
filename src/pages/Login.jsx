import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api'; // Assuming your API client is exported from '../api'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Added error state

    const handleSubmit = async (e) => { // Renamed and made async
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            await api.auth.login({ email, password }); // Use API for login
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed'); // Set error message
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%' }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography component="h1" variant="h3" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
                        CareerBud
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Your friendly career guide
                    </Typography>

                    {error && <Box sx={{ mb: 2, width: '100%' }}><Typography color="error" align="center">{error}</Typography></Box>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, height: 56, fontSize: '1.1rem' }}
                        >
                            Login
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/signup" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Login;
