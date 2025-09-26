import ActionButton from './ActionButton';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

const LightDarkModeButton = () => {
  const { mode, onChangeMode } = useConfig();
  
  const isDarkMode = mode === ThemeMode.DARK; // Verifica o tema atual

  const handleClick = () => {
    // Alterna entre claro e escuro
    const newMode = isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK;
    onChangeMode(newMode); // Atualiza o tema no contexto
  };

  return (
    <ActionButton
      title={isDarkMode ? 'Trocar para tema claro' : 'Trocar para tema escuro'}
      icon={isDarkMode ? IconSun : IconMoon}
      onClick={handleClick} // Chama a função ao clicar
    />
  );
};

export default LightDarkModeButton;
