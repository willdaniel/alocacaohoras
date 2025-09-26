const colaboradores = {
  id: 'colaboradores',
  title: 'Colaboradores',
  type: 'collapse',
  icon: 'IconUsers',
  permissions: ['master', 'rh'],
  children: [
    { id: 'colaboradores-page', title: 'Colaboradores', type: 'item', url: '/colaboradores', icon: 'IconUsers' },
    { id: 'integracoes-col', title: 'Integrações', type: 'item', url: '/integracoes', icon: 'IconChecklist' },
    { id: 'salarios', title: 'Salários', type: 'item', url: '/salarios', icon: 'IconCash' },
    { id: 'admissoes', title: 'Admissões', type: 'item', url: '/admissoes', icon: 'IconUserPlus' },
    { id: 'demissoes', title: 'Demissões', type: 'item', url: '/demissoes', icon: 'IconUserOff' },
    { id: 'inativos', title: 'Inativos', type: 'item', url: '/inativos', icon: 'IconUserX' }
  ]
};

export default colaboradores;