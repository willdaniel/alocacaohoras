// material-ui
import { useTheme } from '@mui/material/styles';

// Importação da imagem do logo
import logo from 'assets/images/logo_axis.png';

// ==============================|| LOGO COM IMAGEM ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * Usando uma imagem em vez de um svg
     */
    <img src={logo} alt="Benny" width="130" />
  );
};

export default Logo;
