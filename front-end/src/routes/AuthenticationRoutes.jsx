// project imports
import MinimalLayout from 'layout/MinimalLayout';
import * as Pages from './PageComponents';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <Pages.Login />
    },
    {
      path: 'register',
      element: <Pages.Register />
    },
    {
      path: 'forgot-password',
      element: <Pages.ForgotPassword />
    },
    {
      path: 'reset-password',
      element: <Pages.ResetPassword />
    }
  ]
};

export default AuthenticationRoutes;