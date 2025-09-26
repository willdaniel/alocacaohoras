import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

// Este ficheiro é o único responsável por carregar os componentes de página.

// --- Páginas Principais ---
export const Colaboradores = Loadable(lazy(() => import('views/utilities/colaboradores')));
export const RH = Loadable(lazy(() => import('views/utilities/rh')));
export const Clientes = Loadable(lazy(() => import('views/utilities/clientes')));
export const Login = Loadable(lazy(() => import('views/pages/authentication3/Login3')));
export const Register = Loadable(lazy(() => import('views/pages/authentication3/Register3')));

export const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
export const ResetPassword = Loadable(lazy(() => import('views/pages/authentication/ResetPassword')));

// --- Formulários de Cadastro/Edição ---
export const CadastroColaboradores = Loadable(lazy(() => import('views/utilities/cadastro_colaboradores')));
export const CadastroRH = Loadable(lazy(() => import('views/utilities/cadastro_rh')));

// --- Páginas de Cadastro (Adicionadas) ---
export const Bancos = Loadable(lazy(() => import('views/utilities/cadastros/Bancos')));
export const CadastroBancos = Loadable(lazy(() => import('views/utilities/cadastros/CadastroBancos')));

export const ClientesCadastro = Loadable(lazy(() => import('views/utilities/cadastros/Clientes')));
export const CadastroClientes = Loadable(lazy(() => import('views/utilities/cadastros/CadastroClientes')));

export const Contratos = Loadable(lazy(() => import('views/utilities/cadastros/Contratos')));
export const CadastroContratos = Loadable(lazy(() => import('views/utilities/cadastros/CadastroContratos')));

export const Disciplinas = Loadable(lazy(() => import('views/utilities/cadastros/Disciplinas')));
export const CadastroDisciplinas = Loadable(lazy(() => import('views/utilities/cadastros/CadastroDisciplinas')));

export const Generos = Loadable(lazy(() => import('views/utilities/cadastros/Generos')));
export const CadastroGeneros = Loadable(lazy(() => import('views/utilities/cadastros/CadastroGeneros')));

export const Motivos = Loadable(lazy(() => import('views/utilities/cadastros/Motivos')));
export const CadastroMotivos = Loadable(lazy(() => import('views/utilities/cadastros/CadastroMotivos')));

export const Pagamentos = Loadable(lazy(() => import('views/utilities/cadastros/Pagamentos')));
export const CadastroPagamentos = Loadable(lazy(() => import('views/utilities/cadastros/CadastroPagamentos')));

export const Permissoes = Loadable(lazy(() => import('views/utilities/cadastros/Permissoes')));
export const CadastroPermissoes = Loadable(lazy(() => import('views/utilities/cadastros/CadastroPermissoes')));

export const Usuarios = Loadable(lazy(() => import('views/utilities/cadastros/Usuarios')));
export const CadastroUsuarios = Loadable(lazy(() => import('views/utilities/cadastros/CadastroUsuarios')));

// --- Sub-páginas de RH ---
export const Aniversariantes = Loadable(lazy(() => import('views/utilities/rh_1')));

// --- Sub-páginas de Clientes ---
export const VinculoIntegracoes = Loadable(lazy(() => import('views/utilities/clientes_2')));
export const AlocarHoras = Loadable(lazy(() => import('views/utilities/AlocarHoras')));
export const ProjetosAlocados = Loadable(lazy(() => import('views/utilities/ProjetosAlocados')));
export const Solicitacoes = Loadable(lazy(() => import('views/utilities/Solicitacoes')));
export const NewsPage = Loadable(lazy(() => import('views/news/NewsPage')));
export const PostPage = Loadable(lazy(() => import('views/news/PostPage')));