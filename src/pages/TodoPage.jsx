import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Chip, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const TodoPage = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await api.get('/todos'); // Assuming api wrapper handles base URL
            setTodos(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const res = await api.post('/todos', { text: newTodo, priority });
            setTodos([res, ...todos]);
            setNewTodo('');
            setPriority('medium');
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            const res = await api.put(`/todos/${id}`, { completed: !currentStatus });
            setTodos(todos.map(t => t._id === id ? res : t));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Stay organized and track your daily progress.
            </Typography>

            {/* Add Todo Form */}
            <Paper component="form" onSubmit={handleAdd} sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    size="small"
                />
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priority}
                        label="Priority"
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
                    Add
                </Button>
            </Paper>

            {/* Todo List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <AnimatePresence>
                        {todos.map((todo) => (
                            <motion.div
                                key={todo._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                layout
                            >
                                <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }} elevation={0}>
                                    <ListItem
                                        sx={{
                                            bgcolor: todo.completed ? 'action.hover' : 'background.paper',
                                            transition: '0.2s',
                                        }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo._id)} color="default">
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <IconButton edge="start" onClick={() => handleToggle(todo._id, todo.completed)} sx={{ mr: 2 }}>
                                            {todo.completed ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
                                        </IconButton>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                                        color: todo.completed ? 'text.secondary' : 'text.primary',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {todo.text}
                                                </Typography>
                                            }
                                        />
                                        <Chip
                                            label={todo.priority}
                                            size="small"
                                            color={getPriorityColor(todo.priority)}
                                            variant="outlined"
                                            sx={{ mr: 2, textTransform: 'capitalize' }}
                                        />
                                    </ListItem>
                                </Paper>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {todos.length === 0 && (
                        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                            No tasks yet. Add one above!
                        </Typography>
                    )}
                </List>
            )}
        </Container>
    );
};

export default TodoPage;
