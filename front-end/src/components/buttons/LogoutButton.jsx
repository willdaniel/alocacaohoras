import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconLogout } from '@tabler/icons-react';

const LogoutButton = ({ onClick }) => (
  <ActionButton
    title="Sair"
    icon={IconLogout}
    onClick={onClick}
  />
);

LogoutButton.propTypes = {
  onClick: PropTypes.func, 
};

export default LogoutButton;
