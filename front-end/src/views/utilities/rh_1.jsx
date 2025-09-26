import React from 'react';
import CustomPage from 'components/pages/CustomPage';
import CreateButton from 'components/buttons/CreateButton';
import EditButton from 'components/buttons/EditButton';
import DeleteButton from 'components/buttons/DeleteButton';
import { useNavigate } from 'react-router-dom';

const Aniversariantes = () => {
  const navigate = useNavigate();

  const handleCadastro = () => {
    navigate('/cadastro_aniversariante');
  };

  const handleEdit = (id) => {
    navigate(`/editar_aniversariante/${id}`);
  };

  const handleDelete = (id) => {
    // Implement delete logic 
  };

  return (
    <CustomPage
      title="Aniversariantes"
      endpoint="/api/aniversariantes"
      deleteEndpoint="/api/aniversariantes"
      buttons={[
        <CreateButton onClick={handleCadastro} />
      ]}
      columns={[
        { field: 'nome', headerName: 'Colaborador', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'disciplina', headerName: 'Disciplina', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'data_nascimento', headerName: 'Data de Nascimento', flex: 1, headerAlign: 'center', align: 'center' },
      ]}
    />
  );
};

export default Aniversariantes;
