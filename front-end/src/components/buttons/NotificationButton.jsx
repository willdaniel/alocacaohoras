import React, { useState, useEffect, useCallback } from 'react';
import { IconBell, IconBellFilled } from "@tabler/icons-react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tooltip, IconButton } from '@mui/material';
import { api } from 'services/api';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const NotificationButton = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const fetchAndSetNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/api/notificacoes');
      if (data.length === 0) {
        setHasUnread(false);
        return;
      }
      setNotifications(data);

      // Compara o ID da notificação mais recente com o último ID visto armazenado localmente.
      const latestNotificationId = data[0].id;
      const lastSeenId = localStorage.getItem(`lastSeenNotificationId_${user.usuario_id}`);

      setHasUnread(latestNotificationId.toString() !== lastSeenId);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchAndSetNotifications();

    const intervalId = setInterval(fetchAndSetNotifications, 60 * 60 * 1000); // Every hour

    // Listen for custom event
    const handleNewsPosted = () => {
      fetchAndSetNotifications();
    };
    window.addEventListener('newsPosted', handleNewsPosted);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('newsPosted', handleNewsPosted);
    };
  }, [fetchAndSetNotifications]);

  const handleOpen = async () => {
    setOpen(true);
    // Ao abrir, marca que o usuário viu as notificações atuais.
    if (notifications.length > 0) {
      // Armazena o ID da notificação mais recente para o usuário atual.
      const latestNotificationId = notifications[0].id;
      localStorage.setItem(`lastSeenNotificationId_${user.usuario_id}`, latestNotificationId.toString());
      // Atualiza o estado para remover o indicador vermelho.
      setHasUnread(false); 
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton
          onClick={handleOpen}
          color={hasUnread ? 'error' : 'default'}
          sx={!hasUnread ? { color: '#fff' } : {}}
        >
          {hasUnread ? <IconBellFilled /> : <IconBell />}
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Notificações
          </Typography>
          {
            notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box component={RouterLink} to={notification.link} onClick={handleClose} key={notification.id} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', mt: 2, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                    <Typography variant="body1">
                        {notification.mensagem}
                    </Typography>
                </Box>
              ))
            ) : (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Nenhuma notificação.
              </Typography>
            )
          }
        </Box>
      </Modal>
    </>
  );
};

export default NotificationButton;