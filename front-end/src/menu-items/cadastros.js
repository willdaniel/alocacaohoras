const cadastros = {
  id: 'cadastros',
  title: 'Cadastro',
  type: 'collapse',
  icon: 'IconSettings',
  permissions: ['master'], 
  children: [
    { 
      id: 'clientes', 
      title: 'Clientes', 
      type: 'item', 
      url: '/cadastros/clientes', 
      icon: 'IconUsers',
      breadcrumbs: false
    },
    { 
      id: 'disciplinas', 
      title: 'Disciplinas', 
      type: 'item', 
      url: '/cadastros/disciplinas', 
      icon: 'IconSettings',
      breadcrumbs: false
    },
    { 
      id: 'permissoes', 
      title: 'Permissões', 
      type: 'item', 
      url: '/cadastros/permissoes', 
      icon: 'IconKey',
      breadcrumbs: false
    },
    { 
      id: 'usuarios', 
      title: 'Usuários', 
      type: 'item', 
      url: '/cadastros/usuarios', 
      icon: 'IconUsers',
      breadcrumbs: false
    },
  ]
};

export default cadastros;