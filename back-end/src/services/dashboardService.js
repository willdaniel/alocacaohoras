import ColaboradoresRepository from '../repositories/ColaboradoresRepository.js';

const repositoryInstance = new ColaboradoresRepository();

const fetchDashboardData = async () => {
  try {
    // Calcular o primeiro e o último dia do mês atual.
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Formatar as datas para o formato ISO que o PostgreSQL aceita
    const firstDayISO = firstDayOfMonth.toISOString().split('T')[0];
    const lastDayISO = lastDayOfMonth.toISOString().split('T')[0];

    // intervalo do mês atual para todas as consultas de vencimento.
    const vencimentosASO = await repositoryInstance.findExpirationsByField('data_aso', firstDayISO, lastDayISO);
    const vencimentosPGR = await repositoryInstance.findExpirationsByField('data_pgr', firstDayISO, lastDayISO);
    const vencimentosPCMSO = await repositoryInstance.findExpirationsByField('data_pcmso', firstDayISO, lastDayISO);
    const vencimentosCNH = await repositoryInstance.findExpirationsByField('data_cnh', firstDayISO, lastDayISO);
    const vencimentosNR = await repositoryInstance.findUpcomingNRExpirations(firstDayISO, lastDayISO);

    // Fetch Birthdays for the Current Month 
    const aniversariantes = await repositoryInstance.findBirthdaysByMonth(today.getMonth() + 1);

    // Fetch gender distribution data
    const distribuicaoGenero = await repositoryInstance.countByGender();

    // Structure the Final JSON Response ---
    return {
      vencimentosASO,
      vencimentosNR,
      vencimentosPGRPCMSO: [...vencimentosPGR, ...vencimentosPCMSO],
      vencimentosCNH,
      aniversariantes,
      distribuicaoGenero
    };

  } catch (error) {
    console.error('Error in dashboardService:', error.message);
    throw new Error('Failed to fetch dashboard data from service.');
  }
};

export default { fetchDashboardData };
