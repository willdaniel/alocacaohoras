import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from './CustomToolbar';

const CustomDataGrid = ({ rows, columns }) => {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      slots={{
        toolbar: CustomToolbar // Toolbar personalizada
      }}
      disableRowSelectionOnClick
    />
  );
};

export default CustomDataGrid;
