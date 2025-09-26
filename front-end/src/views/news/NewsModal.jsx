import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  IconButton
} from '@mui/material';
import { IconPhoto, IconUpload, IconDownload } from '@tabler/icons-react';
import { api } from 'services/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const NewsModal = ({ open, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('news');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [downloadableFile, setDownloadableFile] = useState(null);
  const [downloadableFileName, setDownloadableFileName] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isEditMode) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setType(initialData.type);
      setImagePreview(initialData.imageUrl);
      setDownloadableFileName(initialData.fileUrl ? initialData.fileUrl.split('/').pop() : '');
    } else {
      setTitle('');
      setContent('');
      setType('news');
      setImagePreview('');
      setDownloadableFileName('');
    }
  }, [initialData, isEditMode, open]);


  const handleImageChange = (e) => {
    if (e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
        const file = e.target.files[0];
        setDownloadableFile(file);
        setDownloadableFileName(file.name);
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/notificacoes/download/${downloadableFileName}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadableFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('type', type);
    if (imageFile) {
        formData.append('image', imageFile);
    }
    if (downloadableFile) {
        formData.append('file', downloadableFile);
    }
    
    // Pass the form data to the parent component's submit handler
    onSubmit(formData, initialData?.id);
  };

  return (
    <Modal
        open={open}
        onClose={onClose}
    >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" component="h2" sx={{mb: 2}}>
                {isEditMode ? 'Editar Notícia' : 'Adicionar Notícia ou Alerta'}
            </Typography>
            <TextField margin="normal" required fullWidth id="title" label="Título" name="title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField margin="normal" required fullWidth name="content" label="Conteúdo" id="content" multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
            <FormControl fullWidth margin="normal">
                <InputLabel id="type-select-label">Tipo</InputLabel>
                <Select labelId="type-select-label" id="type-select" value={type} label="Tipo" onChange={(e) => setType(e.target.value)}>
                    <MenuItem value={'news'}>Notícia</MenuItem>
                    <MenuItem value={'alert'}>Alerta</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" component="label" startIcon={<IconPhoto />} sx={{mt: 1, mb: 1}}>
                {isEditMode ? 'Trocar Imagem' : 'Carregar Imagem'}
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {imagePreview && <Avatar src={imagePreview} variant="rounded" sx={{ width: 100, height: 100, mt: 1 }} />} 

            <Button variant="outlined" component="label" startIcon={<IconUpload />} sx={{mt: 1, mb: 1}}>
                {isEditMode ? 'Trocar Arquivo' : 'Carregar Arquivo'}
                <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {downloadableFileName && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2">{downloadableFileName}</Typography>
                <IconButton onClick={handleDownload} size="small">
                  <IconDownload />
                </IconButton>
              </Box>
            )}

            <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ml: 1}}>{isEditMode ? 'Salvar' : 'Publicar'}</Button>
            </Box>
        </Box>
    </Modal>
  );
};

export default NewsModal;