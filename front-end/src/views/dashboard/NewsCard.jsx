import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Divider,
  Box,
  Paper,
  useTheme,
  Button
} from '@mui/material';
import { IconNews, IconAlertTriangle } from '@tabler/icons-react';
import { api } from '../../services/api';

const NewsCard = () => {
  const theme = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/notificacoes?limit=3');
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

  return (
    <Paper elevation={3} sx={{ p: 2, minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box display="flex" alignItems="center">
            <IconNews color={theme.palette.secondary.main} />
            <Typography variant="h5" sx={{ ml: 1 }}>Últimas Notícias e Alertas</Typography>
        </Box>
      </Box>
      <Divider />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <>
            <List dense sx={{ flexGrow: 1, overflow: 'auto', pr: 1, mt: 1 }}>
            {news.length > 0 ? (
                news.map((item) => (
                <ListItem button component={Link} to={`/noticias/${item.id}`} key={item.id}>
                    <ListItemIcon sx={{minWidth: '40px', mt: 0.5}}>
                        {item.type === 'alert' ? <IconAlertTriangle color={theme.palette.warning.main} /> : <IconNews color={theme.palette.primary.main}/>}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{variant: 'subtitle1'}}
                    />
                </ListItem>
                ))
            ) : (
                <ListItem><ListItemText primary="Nenhuma notícia ou alerta no momento." /></ListItem>
            )}
            </List>
            <Box sx={{ pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={Link} to="/noticias" size="small">
                    Ver todas as notícias
                </Button>
            </Box>
        </>
      )}
    </Paper>
  );
};

export default NewsCard;