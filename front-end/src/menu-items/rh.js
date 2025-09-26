const rh = {
  id: 'rh',
  title: 'RH',
  type: 'collapse',
  icon: 'IconClipboardHeart',
  permissions: ['master', 'rh'],
  children: [
    {
      id: 'aniversariantes',
      title: 'Aniversariantes',
      type: 'item',
      url: '/rh/aniversariantes',
      icon: 'IconBalloon'
    },
    {
      id: 'crachas',
      title: 'Crachás',
      type: 'item',
      url: '/rh/crachas',
      icon: 'IconAddressBook'
    },
    {
      id: 'integracoes-rh',
      title: 'Integrações',
      type: 'item',
      url: '/rh/integracoes',
      icon: 'IconChecklist'
    },
    {
      id: 'venc-cpst',
      title: 'Vencimentos de CPST',
      type: 'item',
      url: '/rh/vencimentos/cpst',
      icon: 'IconFileCertificate'
    },
    {
      id: 'venc-exames',
      title: 'Vencimentos de Exames',
      type: 'item',
      url: '/rh/vencimentos/exames',
      icon: 'IconHeartRateMonitor'
    },
    {
      id: 'venc-nrs',
      title: 'Vencimentos de NRs',
      type: 'item',
      url: '/rh/vencimentos/nrs',
      icon: 'IconFileText'
    },
    {
      id: 'venc-pcmso',
      title: 'Vencimentos de PCMSO',
      type: 'item',
      url: '/rh/vencimentos/pcmso',
      icon: 'IconActivity'
    },
    {
      id: 'venc-pgr',
      title: 'Vencimentos de PGR',
      type: 'item',
      url: '/rh/vencimentos/pgr',
      icon: 'IconFileText'
    },
    {
      id: 'venc-cnh',
      title: 'Vencimentos de CNH',
      type: 'item',
      url: '/rh/vencimentos/cnh',
      icon: 'IconLicense'
    },
    {
      id: 'salarios-rh',
      title: 'Salários',
      type: 'item',
      url: '/rh/salarios',
      icon: 'IconCash'
    }
  ]
};

export default rh;