import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  Box,
  Button,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction
} from '@mui/material';
import { IconPlus, IconTrash, IconNews, IconAlertTriangle } from '@tabler/icons-react';
import { api } from '../../services/api';
import MainCard from 'ui-component/cards/MainCard';
import NewsModal from './NewsModal';


const NewsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/notificacoes');
        setNews(response.data);
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
        setError('Não foi possível carregar as notícias.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleCreateSubmit = async (formData) => {
    try {
      const response = await api.post('/api/notificacoes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNews([response.data, ...news]);
      setOpenModal(false);
      window.dispatchEvent(new CustomEvent('newsPosted'));
    } catch (error) {
      console.error("Failed to submit post", error);
      // Optionally, show an error message to the user in the modal
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notificacoes/${id}`);
      setNews(news.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete news item", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <MainCard
        title="Notícias e Alertas"
        secondary={user?.role === 'mkt' && (
            <Button variant="contained" startIcon={<IconPlus />} onClick={() => setOpenModal(true)}>
                Adicionar
            </Button>
        )}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <List>
          {news.length > 0 ? (
            news.map((item, index) => (
                <Box key={item.id}>
                    <ListItem
                        alignItems="flex-start"
                        button // Makes the ListItem behave like a button
                        onClick={() => navigate(`/noticias/${item.id}`)} // Navigate on click
                    >
                        <ListItemAvatar>
                            {item.imageUrl ? (
                                <Avatar variant="rounded" src={`${api.defaults.baseURL}${item.imageUrl}`} sx={{ width: 80, height: 80, mr: 2 }} />
                            ) : (
                                <Avatar variant="rounded" sx={{ width: 80, height: 80, mr: 2, bgcolor: 'grey.200' }}>
                                    {item.type === 'alert' ? (
                                        <IconAlertTriangle size="2.5rem" color="orange" />
                                    ) : (
                                        <IconNews size="2.5rem" color="blue" />
                                    )}
                                </Avatar>
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography variant="h5">{item.title}</Typography>} // Removed Link component
                            secondary={
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>{new Date(item.date).toLocaleDateString('pt-BR')}</Typography>
                                    <Typography variant="body2">{item.content.substring(0, 150)}...</Typography>
                                </>
                            }
                        />
                        {user?.role === 'mkt' && (
                            <ListItemSecondaryAction>
                                <IconButton color="success" aria-label="deletar" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                                    <IconTrash size="1.25rem" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                    {index < news.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
            ))
          ) : (
            <ListItem><ListItemText primary="Nenhuma notícia ou alerta no momento." /></ListItem>
          )}
        </List>
      )}

      <NewsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateSubmit}
      />

    </MainCard>
  );
};

export default NewsPage;
