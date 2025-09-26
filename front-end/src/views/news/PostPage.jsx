import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import {
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Box,
  useTheme,
  Button,
  Stack,
  IconButton
} from '@mui/material';
import { IconPencil, IconDownload } from '@tabler/icons-react';
import { IoReturnUpBackOutline } from "react-icons/io5";
import { api } from '../../services/api';
import MainCard from 'ui-component/cards/MainCard';
import NewsModal from './NewsModal';


const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/notificacoes/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error('Erro ao buscar post:', err);
        setError('Não foi possível carregar o post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdateSubmit = async (formData, id) => {
    try {
      const response = await api.put(`/api/notificacoes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPost(response.data);
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to update post", error);
      // Optionally, show an error message to the user in the modal
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await api.get(`/api/notificacoes/download/${fileName}`,
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!post) {
    return null;
  }

  return (
    <>
        <MainCard
            title={post.title}
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={() => navigate('/noticias')} color="primary" aria-label="Voltar">
                        <IoReturnUpBackOutline />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">{new Date(post.date).toLocaleDateString('pt-BR')}</Typography>
                    {user?.role === 'mkt' && (
                        <Button variant="contained" color="success" startIcon={<IconPencil />} onClick={() => setOpenModal(true)}>
                            Editar
                        </Button>
                    )}
                </Stack>
            }
        >
            {post.imageUrl && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <img src={`${api.defaults.baseURL}${post.imageUrl}`} alt={post.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: theme.shape.borderRadius }} />
                </Box>
            )}
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {post.content}
            </Typography>
            {post.fileUrl && (
                <Box sx={{mt: 3}}>
                    <Button 
                        variant="contained" 
                        color="success"
                        startIcon={<IconDownload />} 
                        onClick={() => handleDownload(post.fileUrl.split('/').pop())}
                    >
                        Download
                    </Button>
                </Box>
            )}
        </MainCard>

        {post && (
            <NewsModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleUpdateSubmit}
                initialData={post}
            />
        )}
    </>
  );
};

export default PostPage;