import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconArrowBackUp } from '@tabler/icons-react';

// ==============================|| CREATE BUTTON ||============================== //

const ReturnButton = ({ onClick }) => (
  <ActionButton
    title="Retornar"
    icon={IconArrowBackUp}
    onClick={onClick} // Passa o onClick para o ActionButton
  />
);

ReturnButton.propTypes = {
  onClick: PropTypes.func // Valida que onClick é obrigatório
};

export default ReturnButton;
