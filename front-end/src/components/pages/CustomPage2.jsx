import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Material-UI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

// Tradução personalizada
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/gridLocaleText';

// Custom Toolbar
import CustomToolbar from 'components/toolbar/CustomToolbar';

// Project Imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { api } from 'services/api'; // Adicione seu serviço de API aqui

const CustomPage = ({ 
  title, 
  buttons, 
  columns, 
  endpoint 
}) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (endpoint) {
      loadData();
    }
  }, [endpoint]);

  async function loadData() {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error(`Erro ao carregar dados de ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }

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
                <Box key={index} sx={{ ml: 1 }}>
                  {ButtonComponent}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <DataGrid
            columns={columns}
            rows={data}
            loading={loading}
            slots={{
              toolbar: CustomToolbar,
            }}
            localeText={GRID_DEFAULT_LOCALE_TEXT}
            disableRowSelectionOnClick
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
  endpoint: PropTypes.string, // Adicionada a prop `endpoint`
};

CustomPage.defaultProps = {
  buttons: [],
  endpoint: '', // Por padrão, não faz chamadas de API
};

export default CustomPage;
