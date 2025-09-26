import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import DeleteButton from 'components/buttons/DeleteButton';
import { api } from 'services/api';

const Clientes = () => {
  const navigate = useNavigate();

  // Função para redirecionar para cadastro
  const handleCadastro = () => {
    navigate('/cadastro_clientes');
  };

  // Função para deletar cliente
  const deleteCliente = async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      alert('Cliente deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      alert('Erro ao deletar cliente.');
    }
  };

  // Função para editar cliente
  const editCliente = (id) => {
    navigate(`/cadastro_clientes?id=${id}`);
  };

  return (
    <CustomPage
      title="Clientes"
      endpoint="/clientes"
      buttons={[
        <CreateButton onClick={handleCadastro} />,
      ]}
      columns={[
        { field: 'nome_fantasia', headerName: 'Cliente', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'validade_integracao', headerName: 'Validade Integração', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'editar',
          headerName: 'Editar',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: (params) => (
            <EditButton onClick={() => editCliente(params.row.id)} />
          ),
        },
        {
          field: 'deletar',
          headerName: 'Deletar',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: (params) => (
            <DeleteButton onClick={() => deleteCliente(params.row.id)} />
          ),
        },
      ]}
    />
  );
};

export default Clientes;
