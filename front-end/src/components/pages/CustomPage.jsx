import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/gridLocaleText';
import CustomToolbar from 'components/toolbar/CustomToolbar';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { api } from 'services/api';

const CustomPage = ({ title, buttons = [], columns, endpoint = '', deleteEndpoint = '', queryParams = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const url = new URL(endpoint, window.location.origin);
      Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
      const response = await api.get(url.pathname + url.search);
      console.log('API response:', response.data);

      let items = Array.isArray(response.data) ? response.data : [];
      console.log('Processed items:', items);

      items = items.filter(item => item && item.id !== undefined && item.id !== null);

      setData(items);
    } catch (error) {
      console.error(`Error loading data from ${endpoint}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      loadData();
    }
    // eslint-disable-next-line
  }, [endpoint]);

  const handleDelete = async (id) => {
    if (window.confirm('Você tem certeza que quer deletar este Usuário?')) {
      try {
        if (!deleteEndpoint) throw new Error('Delete endpoint is not configured');
        await api.delete(`${deleteEndpoint}/${id}`);
        await loadData();
        alert('Deletado com sucesso!');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert(`Error deleting: ${error.message}`);
      }
    }
  };

  const processedColumns = columns.map((col) => {
    if (col.field === 'deletar') {
      return {
        ...col,
        renderCell: (params) => {
          if (!params.row) return null;
          // Gets the original DeleteButton component
          const originalButton = col.renderCell(params);
          // Clones it and adds the correct onClick prop
          return React.cloneElement(originalButton, { onClick: () => handleDelete(params.row.id) });
        }
      };
    }
    return col;
  });

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box component="span">{title}</Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {buttons.map((ButtonComponent, index) => (
                <Box key={index} sx={{ ml: 1 }}>{ButtonComponent}</Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <DataGrid
            columns={processedColumns}
            rows={data}
            loading={loading}
            getRowId={(row) => row.id}
            slots={{ toolbar: CustomToolbar }}
            localeText={GRID_DEFAULT_LOCALE_TEXT}
            disableRowSelectionOnClick
            // Debug: Show if no rows
            componentsProps={{
              noRowsOverlay: {
                children: <div>No data found. Check API response and row IDs.</div>
              }
            }}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

CustomPage.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.node),
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  endpoint: PropTypes.string,
  deleteEndpoint: PropTypes.string,
  queryParams: PropTypes.object
};

export default CustomPage;
