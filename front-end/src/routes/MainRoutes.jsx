// project imports
import MainLayout from 'layout/MainLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';

import * as Pages from './PageComponents';
import DashboardPage from 'views/dashboard/DashboardPage.jsx';
import TestPage from 'views/dashboard/TestPage.jsx';

// ==============================|| ROTEAMENTO PRINCIPAL ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      index: true,
      element: <DashboardPage />
    },
    {
      path: 'dashboard',
      element: <DashboardPage />
    },
    {
      path: 'test',
      element: <TestPage />
    },
    {
      path: 'colaboradores',
      element: <Pages.Colaboradores />
    },
    {
      path: 'cadastro_colaboradores',
      element: <Pages.CadastroColaboradores />
    },
    {
      path: 'clientes',
      element: <Pages.Clientes />
    },
    {
      path: 'alocar-horas',
      element: <Pages.AlocarHoras />
    },
    {
      path: 'projetos-alocados',
      element: <Pages.ProjetosAlocados />
    },
    {
      path: 'solicitacoes',
      element: <Pages.Solicitacoes />
    },
    {
      path: 'noticias',
      element: <Pages.NewsPage />
    },
    {
      path: 'noticias/:postId',
      element: <Pages.PostPage />
    },
    {
      path: 'cadastro_alocacoes',
      element: <Pages.AlocarHoras />
    },

    // --- GRUPO DE ROTAS DE RH ---
    {
      path: 'rh',
      children: [
        { index: true, element: <Pages.RH /> },
        { path: 'aniversariantes', element: <Pages.Aniversariantes /> }
      ]
    },

    // --- GRUPO DE ROTAS DE CADASTRO ---
    {
      path: 'cadastros',
      children: [
        { path: 'bancos', element: <Pages.Bancos /> },
        { path: 'bancos/form', element: <Pages.CadastroBancos /> },
        { path: 'clientes', element: <Pages.ClientesCadastro /> },
        { path: 'clientes/form', element: <Pages.CadastroClientes /> },
        { path: 'contratos', element: <Pages.Contratos /> },
        { path: 'contratos/form', element: <Pages.CadastroContratos /> },
        { path: 'disciplinas', element: <Pages.Disciplinas /> },
        { path: 'disciplinas/form', element: <Pages.CadastroDisciplinas /> },
        { path: 'generos', element: <Pages.Generos /> },
        { path: 'generos/form', element: <Pages.CadastroGeneros /> },
        { path: 'motivos', element: <Pages.Motivos /> },
        { path: 'motivos/form', element: <Pages.CadastroMotivos /> },
        { path: 'pagamentos', element: <Pages.Pagamentos /> },
        { path: 'pagamentos/form', element: <Pages.CadastroPagamentos /> },
        { path: 'permissoes', element: <Pages.Permissoes /> },
        { path: 'permissoes/form', element: <Pages.CadastroPermissoes /> },
        { path: 'usuarios', element: <Pages.Usuarios /> },
        { path: 'usuarios/form', element: <Pages.CadastroUsuarios /> }
      ]
    }
  ]
};

export default MainRoutes;
