// project imports
import cadastros from './cadastros';

// ==============================|| MENU ITEMS - SIDE BAR||============================== //

const menuItems = {
  items: [{
    id: 'modulos',
    title: 'Módulos',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'IconDashboard',
        breadcrumbs: false
      },
      {
        id: 'alocar-horas',
        title: 'Alocar Horas',
        type: 'item',
        url: '/alocar-horas',
        icon: 'IconClock',
        breadcrumbs: false
      },
      {
        id: 'projetos-alocados',
        title: 'Projetos Alocados',
        type: 'item',
        url: '/projetos-alocados',
        icon: 'IconFolder',
        breadcrumbs: false
      },
      {
        id: 'solicitacoes',
        title: 'Solicitações',
        type: 'item',
        url: '/solicitacoes',
        icon: 'IconFileText',
        breadcrumbs: false
      },
    
      {
        id: 'news',
        title: 'Notícias e Alertas',
        type: 'item',
        url: '/noticias',
        icon: 'IconNews',
        breadcrumbs: false
      },
      cadastros
    ]
  }]
};

export default menuItems;
