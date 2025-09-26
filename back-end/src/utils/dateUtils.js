import moment from 'moment';

/**
 * Filtra colaboradores ativos (onde status = true)
 * @param {Array} dataList - Lista de colaboradores
 * @returns {Array} - Lista de colaboradores ativos
 */
export function filterActiveCollaborators(dataList) {
    return dataList.filter(colaborador => colaborador.status === true);
}

/**
 * Filtra colaboradores ativos (onde status = true)
 * @param {Array} dataList - Lista de colaboradores
 * @returns {Array} - Lista de colaboradores ativos
 */
export function filterInactiveCollaborators(dataList) {
    return dataList.filter(colaborador => colaborador.status === false);
}

/**
 * Filtra registros com vencimento dentro de um intervalo de dias a partir da data atual.
 * @param {Array} dataList - Lista de objetos contendo datas
 * @param {string} dateField - Campo da data que será filtrado
 * @param {number} days - Número de dias para o limite de vencimento
 * @returns {Array} - Lista filtrada
 */
export function filterByExpirationDate(dataList, dateField, days = 45) {
    const today = moment().startOf('day'); // Início do dia atual
    const dateLimit = moment().add(days, 'days').endOf('day'); // Fim do dia limite
    
    return dataList.filter(colaborador => {
        const vencimentoData = moment.utc(colaborador[dateField]);
        return vencimentoData.isBetween(today, dateLimit, 'day', '[]');
    });
}

/**
 * Formata datas para um formato especificado (padrão: 'DD/MM/YYYY')
 * @param {string|Date} date - Data em formato string ou Date
 * @param {string} format - Formato desejado (opcional, padrão: 'DD/MM/YYYY')
 * @returns {string|null} - Data formatada ou null se não houver data
 */
export function formatDate(date, format) {
    return date ? moment.utc(date).format(format) : null;
}

/**
 * Ordena uma lista de objetos com datas pelo mês e dia (ignora o ano)
 * @param {Array} dataList - Lista de objetos com a propriedade de data
 * @param {string} dateField - Nome do campo que contém a data
 * @returns {Array} - Lista ordenada
 */
export function sortByMonthAndDay(dataList, dateField) {
    return dataList.sort((a, b) => {
        const dayA = moment.utc(a[dateField]).date();
        const monthA = moment.utc(a[dateField]).month();
        const dayB = moment.utc(b[dateField]).date();
        const monthB = moment.utc(b[dateField]).month();

        return monthA === monthB ? dayA - dayB : monthA - monthB;
    });
}

/**
 * Ordena uma lista de objetos pela data mais próxima até a mais distante.
 * Campos nulos ou inválidos vão para o final da lista.
 *
 * @param {Array} dataList - Lista de objetos com campo de data
 * @param {string} dateField - Nome do campo de data no objeto
 * @returns {Array} - Lista ordenada
 */
export function sortByNearestDate(dataList, dateField) {
    return dataList.sort((a, b) => {
        const dateA = a[dateField] ? moment(a[dateField]) : null;
        const dateB = b[dateField] ? moment(b[dateField]) : null;

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateA - dateB; // Mais próxima para mais distante
    });
}