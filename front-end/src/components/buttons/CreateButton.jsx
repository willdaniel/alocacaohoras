import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconPlus } from '@tabler/icons-react';

// ==============================|| CREATE BUTTON ||============================== //

const CreateButton = ({ onClick }) => (
  <ActionButton
    title="Adicionar"
    icon={IconPlus}
    onClick={onClick} // Passa o onClick para o ActionButton
  />
);

CreateButton.propTypes = {
  onClick: PropTypes.func // Valida que onClick é obrigatório
};

export default CreateButton;
