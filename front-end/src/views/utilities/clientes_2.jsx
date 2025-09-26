import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import { api } from 'services/api';

const Integracoes = () => {
  const navigate = useNavigate();

  // Função para redirecionar para cadastro
  const handleCadastro = () => {
    navigate('/cadastro_integracao');
  };

  return (
    <CustomPage
      title="Integrações"
      endpoint="/api/integracoes"
      buttons={[
        <CreateButton onClick={handleCadastro} />,
      ]}
      columns={[
        { field: 'colaborador', headerName: 'Colaborador', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'cliente', headerName: 'Cliente', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'data_integracao', headerName: 'Data de Integração', flex: 1, headerAlign: 'center', align: 'center' },
      ]}
    />
  );
};

export default Integracoes;
