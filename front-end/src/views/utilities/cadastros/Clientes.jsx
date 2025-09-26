import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';

// project imports
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import DeleteButton from 'components/buttons/DeleteButton';
import { api } from 'services/api';

// ==============================|| PÁGINA DE CLIENTES ||============================== //

const ClientesCadastroPage = () => {
  const navigate = useNavigate();

  // Função para navegar para a página de criação/edição
  const handleNavigate = (id) => {
    const url = id ? `/cadastros/clientes/form?id=${id}` : '/cadastros/clientes/form';
    navigate(url);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await api.delete(`/api/clientes/${id}`);
        // A solução mais simples para atualizar a lista é recarregar a página.
        window.location.reload();
      } catch (error) {
        console.error('Falha ao deletar o cliente:', error);
        alert('Falha ao deletar o cliente.');
      }
    }
  };
  
  // Definição das colunas para a tabela de dados
  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'nome_cliente',
      headerName: 'Nome do Cliente',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'nome_coordenador',
      headerName: 'Coordenador do Projeto',
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
      renderCell: () => (
        <IconButton color="success" aria-label="deletar">
          <IconTrash size="1.25rem" />
        </IconButton>
      )
    }
  ];

  return (
    <CustomPage
      title="Clientes"
      endpoint="/api/clientes"
      deleteEndpoint="/api/clientes"
      buttons={[
        <CreateButton onClick={() => handleNavigate(null)} />
      ]}
      columns={columns}
    />
  );
};

export default ClientesCadastroPage;