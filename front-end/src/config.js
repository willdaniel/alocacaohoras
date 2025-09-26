export const INITIAL_PAGE = '/dashboard';

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark'
};

const config = {
  // Rota do Icone AXIS
  basename: '/axis',
  defaultPath: '/dashboard',
  fontFamily: 'Roboto',
  borderRadius: 12,
  mode: ThemeMode.DARK,
  presetColor: 'default'
};

export default config;
