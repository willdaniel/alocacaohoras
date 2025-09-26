import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import { useCallback, useState } from 'react';

// ==============================|| CREATE BUTTON ||============================== //

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prevFullscreen) => !prevFullscreen);
    if (document && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  return (
    <ActionButton
      title={isFullscreen ? 'Sair do modo tela cheia' : 'Entrar no modo tela cheia'}
      icon={isFullscreen ? IconArrowsMinimize : IconArrowsMaximize}
      onClick={handleToggleFullscreen} // Passa a função de alternância de fullscreen para o botão
    />
  );
};

FullscreenButton.propTypes = {
  onClick: PropTypes.func // Valida que onClick é obrigatório
};

export default FullscreenButton;
