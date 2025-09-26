import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconMinus } from '@tabler/icons-react';

// ==============================|| CREATE BUTTON ||============================== //

const DeleteButton = ({ onClick }) => (
  <ActionButton
    title="Deletar"
    icon={IconMinus}
    onClick={onClick} // Passa o onClick para o ActionButton
  />
);

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired, // Valida que onClick é obrigatório
};

export default DeleteButton;
