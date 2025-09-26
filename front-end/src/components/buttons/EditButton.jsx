import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconPencil } from '@tabler/icons-react';

// ==============================|| CREATE BUTTON ||============================== //

const EditButton = ({ onClick }) => (
  <ActionButton
    title="Editar"
    icon={IconPencil}
    onClick={onClick} // Passa o onClick para o ActionButton
  />
);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired, // Valida que onClick é obrigatório
};

export default EditButton;
