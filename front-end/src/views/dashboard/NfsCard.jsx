import React from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box
} from '@mui/material';
import { IconBug } from '@tabler/icons-react';

const NfsCard = () => {
  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Card sx={{
        backgroundColor: '#3ca86c',
        borderRadius: '12px',
        height: '100%',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
      }}>
        <CardActionArea
          component="a"
          href="http://suporte.ax/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '16px 24px',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          <>
            <IconBug size={28} style={{ marginRight: '12px' }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: '600', lineHeight: 1.2 }}>
              Suporte - osTicket
            </Typography>
          </>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default NfsCard;