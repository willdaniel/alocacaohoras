import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';

// project imports
import Avatar from '../extended/Avatar';

// ==============================|| CARD SECONDARY ACTION ||============================== //

const CardSecondaryAction = forwardRef(({ title, onClick, icon }, ref) => {
  const theme = useTheme();

  return (
    <Tooltip title={title || 'Adicionar'} placement="top">
      <ButtonBase ref={ref} onClick={onClick}>
        <Avatar
          component="div"
          aria-label="action icon"
          size="badge"
          color="primary"
          outline
        >
          {icon}
        </Avatar>
      </ButtonBase>
    </Tooltip>
  );
});

CardSecondaryAction.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func, // Adicionando prop para onClick
  icon: PropTypes.element.isRequired,
};

export default CardSecondaryAction;
