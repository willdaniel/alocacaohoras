import { BrowserRouter, useRoutes } from 'react-router-dom';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import routes from 'routes';

// defaultTheme
import ThemeCustomization from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { JWTProvider } from 'contexts/JWTContext';

// ==============================|| APP ||============================== //

// Componente helper para renderizar as rotas
const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => {
  return (
    <ThemeCustomization>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
          <NavigationScroll>
            <JWTProvider>
              <AppRoutes />
            </JWTProvider>
          </NavigationScroll>
        </BrowserRouter>
      </StyledEngineProvider>
    </ThemeCustomization>
  );
};

export default App;