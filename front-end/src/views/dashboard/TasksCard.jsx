import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme,
  IconButton,
  Button,
  Checkbox
} from '@mui/material';
import { IconClipboardList, IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { api } from 'services/api.js';
import useAuth from 'hooks/useAuth';
import TaskModal from './TaskModal.jsx';

const TasksCard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tasks');
      setTasks(Array.isArray(response.data) ? response.data.sort((a, b) => a.completed - b.completed || b.id - a.id) : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (user?.role === 'lider') {
        try {
          const { data: team } = await api.get('/api/colaboradores/team');
          setTeamMembers(team || []);
        } catch (err) {
          console.error("Failed to fetch team members:", err);
          setTeamMembers([{ nome: user.nome, usuario_id: user.usuario_id }]);
        }
      }
    };

    if (user) {
      fetchTasks();
      fetchTeamMembers();
    }
  }, [user]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setModalOpen(false);
  };

  const handleSaveTask = async (task) => {
    try {
      const taskData = { ...task };

      if (taskData.id) {
        await api.put(`/api/tasks/${taskData.id}`, taskData);
      } else {
        await api.post('/api/tasks', taskData);
      }
      fetchTasks();
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteTask = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    fetchTasks();
  };

  const handleToggleTask = async (task) => {
    await api.put(`/api/tasks/${task.id}`, { ...task, completed: !task.completed, assigned_to_id: task.assigned_to_id });
    fetchTasks();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box display="flex" alignItems="center">
          <IconClipboardList />
          <Typography variant="h5" sx={{ ml: 1 }}>Tarefas</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpenModal(null)}
          sx={{
            minWidth: 0,
            padding: '6px',
            backgroundColor: '#3ca86c',
            '&:hover': {
              backgroundColor: '#3ca86c',
            },
          }}
        ></Button>
      </Box>
      <Divider />
      <Box flexGrow={1} sx={{ overflowY: 'auto', pr: 1 }}>
        <List sx={{ maxHeight: '200px' }}>
          {tasks.map((task) => {
            // ** 1. Define the permission condition in a variable for clarity **
            const hasDeletePermission = user.role !== 'usuario' || Number(task.creator_id) === Number(user.usuario_id);

            return (
              <ListItem
                key={task.id}
                sx={{
                  marginBottom: '4px',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(task)}>
                      <IconPencil />
                    </IconButton>
                    
                    {/* ** 2. Always render the button, but use the 'disabled' prop ** */}
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="success"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={!hasDeletePermission} // <-- KEY CHANGE HERE
                    >
                      <IconTrash />
                    </IconButton>
                  </>
                }
              >
                <Checkbox checked={task.completed} onChange={() => handleToggleTask(task)} />
                <ListItemText
                  primary={task.text}
                  secondary={
                    user?.role === 'lider'
                      ? `Para: ${task.assignee_name}`
                      : user?.role === 'usuario' && task.creator_name && task.creator_name !== user.nome
                      ? `De: ${task.creator_name}`
                      : null
                  }
                  sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      <TaskModal
        open={modalOpen}
        handleClose={handleCloseModal}
        task={selectedTask}
        handleSave={handleSaveTask}
        user={user}
        teamMembers={teamMembers}
      />
    </Paper>
  );
};

export default TasksCard;