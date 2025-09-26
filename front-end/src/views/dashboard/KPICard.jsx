import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const KPICard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Card sx={{ backgroundColor: color, color: theme.palette.getContrastText(color), height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
          </Box>
          <Box>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
