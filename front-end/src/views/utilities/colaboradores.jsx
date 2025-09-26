import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';
import { Chip, IconButton } from '@mui/material'; 
import { IconTrash } from '@tabler/icons-react';

// components
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import DeleteButton from 'components/buttons/DeleteButton';

// This map translates the gender ID from the database into readable text.
const generoMap = {
  1: 'Masculino',
  2: 'Feminino'
  // Add outros generos se precisar
};

const Colaboradores = () => {
  const navigate = useNavigate();

  const handleCadastro = () => {
    navigate('/cadastro_colaboradores');
  };

  const editColaborador = (id) => {
    navigate(`/cadastro_colaboradores?id=${id}`);
  };

  return (
    <CustomPage
      title="Colaboradores"
      endpoint="/api/colaboradores/ativos" 
      deleteEndpoint="/api/colaboradores"
      buttons={[
              <CreateButton onClick={handleCadastro} />,
            ]}
      columns={[
        { field: 'nome', headerName: 'Nome', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'disciplina', headerName: 'Disciplina', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'cargo', headerName: 'Cargo', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'email_interno', headerName: 'Email Interno', flex: 1, headerAlign: 'center', align: 'center'},
        { 
          field: 'status', 
          headerName: 'Status', 
          flex: 0.7, 
          headerAlign: 'center', 
          align: 'center',
          renderCell: (params) => (
            <Chip 
              label={params.value ? 'Ativo' : 'Inativo'} 
              color={params.value ? 'success' : 'error'}
              size="small" 
            />
          )
        },
        {
          field: 'genero_id',
          headerName: 'Gênero',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          type: 'singleSelect', // Specifies the filter type
          valueOptions: Object.keys(generoMap).map((id) => ({
              value: parseInt(id, 10),
              label: generoMap[id]
          })),
          renderCell: (params) => {
            return <span>{generoMap[params.value] || 'Não informado'}</span>;
          }
        },
        {
          field: 'editar',
          headerName: 'Editar',
          headerAlign: 'center',
          align: 'center',
          sortable: false,
          renderCell: (params) => <EditButton onClick={() => editColaborador(params.row.id)} />
        },
        {
          field: 'deletar',
          headerName: 'Deletar',
          headerAlign: 'center',
          align: 'center',
          sortable: false,
          renderCell: (params) => (
            <IconButton color="success" aria-label="deletar">
              <IconTrash size="1.25rem" />
            </IconButton>
          )
        }
      ]}
    />
  );
};

export default Colaboradores;