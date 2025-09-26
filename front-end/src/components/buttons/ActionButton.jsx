import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

const ActionButton = ({ title, icon: Icon, onClick, color }) => {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick} color={color ? "error" : "inherit"}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

export default ActionButton;