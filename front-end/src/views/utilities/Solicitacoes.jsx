import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { TextField, MenuItem, Typography, Grid, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import useAuth from 'hooks/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { api } from 'services/api';
import { IconButton } from '@mui/material';
import { IconTrash, IconCheck, IconX } from '@tabler/icons-react';

const Solicitacoes = () => {
  const { user } = useAuth();
  const [tipo, setTipo] = useState('');
  const [dateRange, setDateRange] = useState([null, null]); 
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const { data } = await api.get('/api/usuarios/managers');
        console.log('Fetched managers:', data);
        setManagers(data);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
      }
    };

    fetchManagers();
  }, []);

  const fetchSolicitacoes = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'lider' ? '/api/solicitacoes/manager' : '/api/solicitacoes/user';
      const { data } = await api.get(endpoint);
      setSolicitacoes(data);
    } catch (error) {
      console.error("Failed to fetch solicitations:", error);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [user]);

  const handleSubmit = async () => {
    try {
      await api.post('/api/solicitacoes', {
        tipo,
        dateRange,
        managerId: selectedManager,
      });
      fetchSolicitacoes();
    } catch (error) {
      console.error("Failed to create solicitation:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta solicitação?')) {
      try {
        await api.delete(`/api/solicitacoes/${id}`);
        fetchSolicitacoes();
      } catch (error) {
        console.error('Failed to delete solicitation:', error);
        alert('Falha ao deletar a solicitação.');
      }
    }
  };

  const columns = [
    {
      field: 'data_solicitacao',
      headerName: 'Data / Período',
      width: 220,
      renderCell: (params) => {
        const { tipo, data_inicio, data_fim, data_solicitacao } = params.row;

        if (tipo === 'Lançar horas retroativas' && data_inicio && data_fim) {
          const startDate = format(parseISO(data_inicio), 'dd/MM/yyyy');
          const endDate = format(parseISO(data_fim), 'dd/MM/yyyy');
          return `${startDate} a ${endDate}`;
        }

        if (data_solicitacao) {
          return format(parseISO(data_solicitacao), 'dd/MM/yyyy');
        }

        return 'N/A';
      }
    },
    // Coluna Tipo
    { field: 'tipo', headerName: 'Tipo', width: 250 },
    // Coluna Status
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        let label;
        let color;
        switch (params.value) {
          case 'aprovado':
            label = 'Aprovado';
            color = 'success';
            break;
          case 'negado':
            label = 'Negado';
            color = 'error';
            break;
          case 'aguardando':
            label = 'Aguardando';
            color = 'warning'; 
            break;
          default:
            label = params.value;
            color = 'default';
        }
        return (
          <Chip
            label={label}
            color={color}
            size="small"
            sx={{ color: 'white' }}
          />
        );
      },
    }
  ];

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/api/solicitacoes/${id}/status`, { status });
      fetchSolicitacoes();
    } catch (error) {
      console.error(`Failed to update status:`, error);
      alert(`Falha ao atualizar o status da solicitação.`);
    }
  };

  if (user?.role === 'lider') {
    columns.unshift({
      field: 'solicitante_nome',
      headerName: 'Solicitante',
      width: 200,
    });
    columns.push({
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        if (params.row.status === 'aguardando') {
          return (
            <>
              <IconButton color="success" onClick={() => handleUpdateStatus(params.row.id, 'aprovado')}>
                <IconCheck size="1.25rem" />
              </IconButton>
              <IconButton color="error" onClick={() => handleUpdateStatus(params.row.id, 'negado')}>
                <IconX size="1.25rem" />
              </IconButton>
            </>
          );
        }
        return null;
      }
    });
  } else {
    columns.push({
      field: 'deletar',
      headerName: 'Deletar',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="success"
          aria-label="deletar"
          onClick={() => handleDelete(params.row.id)}
          disabled={params.row.status === 'aprovado'}
        >
          <IconTrash size="1.25rem" />
        </IconButton>
      )
    });
  }

  return (
    <MainCard title="Solicitações">
      {user?.role !== 'lider' && (
        <>
          <TextField
            fullWidth
            label="Nome"
            value={user?.nome || ''}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Selecione o tipo de solicitação"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Inserir AX">Inserir AX</MenuItem>
            <MenuItem value="Lançar horas retroativas">Lançar Horas retroativas</MenuItem>
          </TextField>

          {tipo === 'Lançar horas retroativas' && (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data Inicial"
                    value={dateRange[0]}
                    onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data Final"
                    value={dateRange[1]}
                    onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          )}

          <TextField
            fullWidth
            select
            label="Selecione o Lider"
            value={selectedManager}
            onChange={(e) => {
              console.log('Selected manager:', e.target.value);
              setSelectedManager(e.target.value);
            }}
            sx={{ mt: 2, mb: 2 }}
          >
            {managers
              .slice()
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.nome}
                </MenuItem>
              ))}
          </TextField>

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={!selectedManager}>
            Cadastrar
          </Button>
        </>
      )}

      <Typography variant="h4" sx={{ mt: user?.role !== 'lider' ? 4 : 0, mb: 2 }}>
        {user?.role === 'lider' ? 'Solicitações para Aprovação' : 'Acompanhar solicitações'}
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={solicitacoes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

    </MainCard>
  ); 
};

export default Solicitacoes;