import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';

// project imports
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import DeleteButton from 'components/buttons/DeleteButton';

// ==============================|| PÁGINA DE BANCOS ||============================== //

const BancosPage = () => {
  const navigate = useNavigate();

  // Função para navegar para a página de criação/edição
  const handleNavigate = (id) => {
    // Se um 'id' for fornecido, vamos para o modo de edição.
    // Se não, vamos para o modo de criação.
    const url = id ? `/cadastros/bancos/form?id=${id}` : '/cadastros/bancos/form';
    navigate(url);
  };
  
  // Definição das colunas para a tabela de dados
  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1, // Faz a coluna se expandir para preencher o espaço
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
      title="Bancos"
      // Endpoint da API para buscar a lista de bancos
      endpoint="/api/bancos"
      // Endpoint da API para deletar um banco
      deleteEndpoint="/api/bancos"
      // Botão de "+" no canto superior direito
      buttons={[
        <CreateButton onClick={() => handleNavigate(null)} />
      ]}
      // Definição das colunas da tabela
      columns={columns}
    />
  );
};

export default BancosPage;