import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Chip } from '@mui/material'; 
import { IconTrash } from '@tabler/icons-react';

// project imports
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import { headerFilteringStateInitializer } from '@mui/x-data-grid/internals';

const UsuariosPage = () => {
  const navigate = useNavigate();

  const handleCadastro = () => {
    navigate('/cadastros/usuarios/form');
  };

  const handleEdit = (id) => {
    navigate(`/cadastros/usuarios/form?id=${id}`);
  };

  return (
    <CustomPage
      title="Usuários"
      endpoint="/api/usuarios"
      deleteEndpoint="/api/usuarios"
      buttons={[
        <CreateButton onClick={handleCadastro} />,
      ]}
      columns={[
        { field: 'colaborador', headerName: 'Colaborador', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'permissao', headerName: 'Tipo de Permissão', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'disciplina', headerName: 'Disciplina', flex: 1, headerAlign: 'center', align: 'center' },
        
        {
          field: 'acesso',
          headerName: 'Acesso',
          flex: 0.7,
          headerAlign: 'center',
          align: 'center',
          renderCell: (params) => (
            <Chip 
              label={params.value ? 'Permitido' : 'Restrito'} 
              color={params.value ? 'success' : 'error'}
              size="small" 
            />
          )
        },
        {
          field: 'editar',
          headerName: 'Editar',
          flex: 0.5,
          headerAlign: 'center',
          align: 'center',
          sortable: false,
          renderCell: (params) => <EditButton onClick={() => handleEdit(params.row.id)} />
        },
        {
          field: 'deletar',
          headerName: 'Deletar',
          flex: 0.5,
          headerAlign: 'center',
          align: 'center',
          sortable: false,
          renderCell: () => (
            <IconButton color="success" aria-label="deletar">
              <IconTrash size="1.25rem" />
            </IconButton>
          )
        }
      ]}
    />
  );
};

export default UsuariosPage;