import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';

// project imports
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import DeleteButton from 'components/buttons/DeleteButton';

// ==============================|| PÁGINA DE GÊNEROS ||============================== //

const GenerosPage = () => {
  const navigate = useNavigate();

  // Função para navegar para a página de criação/edição
  const handleNavigate = (id) => {
    const url = id ? `/cadastros/generos/form?id=${id}` : '/cadastros/generos/form';
    navigate(url);
  };
  
  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'editar',
      headerName: 'Editar',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <EditButton onClick={() => handleNavigate(params.row.id)} />
      )
    },
    {
      field: 'deletar',
      headerName: 'Deletar',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <IconButton color="success" aria-label="deletar">
          <IconTrash size="1.25rem" />
        </IconButton>
      )
    }
  ];

  return (
    <CustomPage
      title="Gêneros"
      endpoint="/api/generos"
      deleteEndpoint="/api/generos"
      buttons={[
        <CreateButton onClick={() => handleNavigate(null)} />
      ]}
      columns={columns}
    />
  );
};

export default GenerosPage;