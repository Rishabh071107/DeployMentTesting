import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Avatar, Divider, Alert, Fade } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import api from '../services/api';

const Account = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const currentUser = api.auth.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setMessage(null);

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: "New passwords don't match." });
            return;
        }

        if (passwords.new.length < 6) {
            setMessage({ type: 'error', text: "Password must be at least 6 characters." });
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setMessage({ type: 'success', text: "Password updated successfully! (Simulation)" });
            setPasswords({ current: '', new: '', confirm: '' });
        }, 800);
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom>
                Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Manage your profile and security preferences.
            </Typography>

            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 3, fontSize: '1.5rem' }}>
                        {user.name[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                </Box>
            </Paper>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="action" /> Security
            </Typography>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box component="form" onSubmit={handleUpdate}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Change Password
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                        Ensure your account stays secure by using a strong password.
                    </Typography>

                    {message && (
                        <Fade in>
                            <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
                                {message.text}
                            </Alert>
                        </Fade>
                    )}

                    <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<LockIcon />}
                        disabled={!passwords.current || !passwords.new}
                        sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}
                    >
                        Update Password
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Account;
