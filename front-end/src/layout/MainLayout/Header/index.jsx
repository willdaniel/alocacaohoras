import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// project imports
import LogoSection from '../LogoSection';
import useAuth from 'hooks/useAuth';

// assets
import MenuToggleButton from 'components/buttons/MenuButton';
import FullscreenButton from 'components/buttons/FullscreenButton';
import LightDarkModeButton from 'components/buttons/LightDarkModeButton';
import NotificationButton from 'components/buttons/NotificationButton';
import LogoutButton from 'components/buttons/LogoutButton';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
        await logout();
        alert("Você fez logout no sistema")
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Centraliza os botões verticalmente
        justifyContent: 'space-between', // Distribui o espaço horizontalmente
        width: '100%',
      }}
    >
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          alignItems: 'center', // Centraliza verticalmente o logo e o botão do menu
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <MenuToggleButton handleLeftDrawerToggle={handleLeftDrawerToggle} />
      </Box>

      {/* Botões de ação */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', // Centraliza os botões verticalmente
          gap: 2, // Adiciona espaçamento horizontal entre os botões
        }}
      >
        <FullscreenButton />
        <LightDarkModeButton />
        <NotificationButton />
        <LogoutButton onClick={handleLogout}/>
      </Box>
    </Box>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;