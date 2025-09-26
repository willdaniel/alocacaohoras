import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  FormControl
} from '@mui/material';

const TaskModal = ({ open, handleClose, task, handleSave, user, teamMembers }) => {
  const [text, setText] = useState('');
  const [assignee, setAssignee] = useState(null);

  useEffect(() => {
    if (open) {
      setText(task ? task.text : '');
      if (user?.role === 'lider' && teamMembers?.length) {
        if (task && task.assigned_to_id) {
          const currentAssignee = teamMembers.find(member => member.usuario_id === task.assigned_to_id);
          setAssignee(currentAssignee || null);
        } else {
          const self = teamMembers.find(member => member.usuario_id === user.userId);
          setAssignee(self || null);
        }
      }
    }
  }, [task, open, teamMembers, user]);

  const onSave = () => {
    const taskPayload = {
      text: text,
    };

    // If editing, include the task ID
    if (task?.id) {
      taskPayload.id = task.id;
    }

    if (user?.role === 'lider') {
      // A leader can set the assignee. Default to self if none is selected.
      taskPayload.assigned_to_id = assignee ? assignee.usuario_id : user.userId;
    } else {

      taskPayload.assigned_to_id = task?.assigned_to_id || user.userId;
    }
    handleSave(taskPayload);
  };

  const handleInternalClose = () => {
    setText('');
    setAssignee(null);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleInternalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'background.paper',
        borderRadius: '12px',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {task ? 'Editar Tarefa' : 'Adicionar Tarefa'}
        </Typography>
        <TextField
          fullWidth
          label="Tarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 2 }}
        />
        {user?.role === 'lider' && teamMembers?.length > 0 && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Autocomplete
              options={teamMembers}
              getOptionLabel={(option) => option.nome || ''}
              value={assignee}
              onChange={(event, newValue) => {
                setAssignee(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.usuario_id === value.usuario_id}
              renderInput={(params) => <TextField {...params} label="Atribuir para" />}
            />
          </FormControl>
        )}
        <Button onClick={onSave} sx={{ mt: 2 }}>Salvar</Button>
      </Box>
    </Modal>
  );
};

export default TaskModal;
