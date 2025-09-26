import React from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box
} from '@mui/material';
import { IconFileExport } from '@tabler/icons-react';

const ReportCard = ({ onGenerate, isLoading }) => {
  return (
    <Card sx={{
      backgroundColor: '#3ca86c',
      borderRadius: '12px', // border-radius
      height: '100%',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
    }}>
      <CardActionArea
        onClick={() => onGenerate('xlsx')}
        disabled={isLoading}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '16px 24px',
          color: 'white', 
        }}
      >
        <IconFileExport size={28} style={{ marginRight: '12px' }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: '600', lineHeight: 1.2 }}> 
          Exportar Relatório de Horas
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default ReportCard;