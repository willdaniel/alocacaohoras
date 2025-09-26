import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MENU TOGGLE BUTTON ||============================== //

const MenuToggleButton = ({ handleLeftDrawerToggle }) => (
  <ActionButton
    title="Menu"
    icon={IconMenu2}
    onClick={handleLeftDrawerToggle} // Passa a função para alternar o menu lateral
  />
);

MenuToggleButton.propTypes = {
  handleLeftDrawerToggle: PropTypes.func.isRequired, // Valida que a função é obrigatória
};

export default MenuToggleButton;
