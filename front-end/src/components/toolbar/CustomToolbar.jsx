import React from 'react';
import { 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector 
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const CustomToolbar = () => {

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
    {/* Botões de Colunas, Filtros e Densidade */}
    <Box>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
    </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
