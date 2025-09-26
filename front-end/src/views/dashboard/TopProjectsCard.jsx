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
  useTheme
} from '@mui/material';
import { IconCalendarDue } from '@tabler/icons-react';
import { api } from 'services/api.js';
import useAuth from 'hooks/useAuth';

const TopProjectsCard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/alocacoes/top3');
        setProjects(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.response?.data?.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopProjects();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" alignItems="center" mb={1.5}>
        <IconCalendarDue />
        <Typography variant="h5" sx={{ ml: 1 }}>Projetos da Semana atual</Typography>
      </Box>
      <Divider />
      <Box flexGrow={1} sx={{ overflow: 'auto', pr: 1 }}>
        <List>
          {projects.map((project) => {
            const [projectName, ...descriptionParts] = project.nome.split('_');
            const description = descriptionParts.join('_');

            return (
              <ListItem 
                key={project.id} 
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <ListItemText 
                  primary={
                    (user?.role === 'lider' || user?.role === 'usuario') && description
                      ? `${projectName} | ${description}`
                      : projectName
                  } 
                  secondary={
                    user?.role === 'master'
                      ? `Horas: ${project.total_horas} | Usuário: ${project.usuario_nome || 'N/A'}`
                      : `Horas: ${project.total_horas}`
                  } 
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
};

export default TopProjectsCard;
