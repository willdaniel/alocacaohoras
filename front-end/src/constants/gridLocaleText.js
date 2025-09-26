// src/constants/gridLocaleText.js

export const GRID_DEFAULT_LOCALE_TEXT = {
    // Root
    noRowsLabel: 'Nenhuma linha disponível',
    noResultsOverlayLabel: 'Nenhum resultado encontrado',
  
    // Botões da barra de ferramentas (Toolbar)
    toolbarDensity: 'Tamanho',
    toolbarDensityLabel: 'Tamanho',
    toolbarDensityCompact: 'Compacto',
    toolbarDensityStandard: 'Padrão',
    toolbarDensityComfortable: 'Confortável',
  
    toolbarColumns: 'Colunas',
    toolbarColumnsLabel: 'Selecionar colunas',
  
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Mostrar filtros',
    toolbarFiltersTooltipHide: 'Ocultar filtros',
    toolbarFiltersTooltipShow: 'Mostrar filtros',
    toolbarFiltersTooltipActive: (count) =>
      count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
  
    // Campo de busca rápida
    toolbarQuickFilterPlaceholder: 'Buscar…',
    toolbarQuickFilterLabel: 'Buscar',
    toolbarQuickFilterDeleteIconLabel: 'Limpar',
  
    // Exportação
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Baixar como CSV',
    toolbarExportPrint: 'Imprimir',
    toolbarExportExcel: 'Baixar como Excel',
  
    // Gerenciamento de Colunas
    columnsManagementSearchTitle: 'Buscar',
    columnsManagementNoColumns: 'Nenhuma coluna disponível',
    columnsManagementShowHideAllText: 'Mostrar/Ocultar todas',
    columnsManagementReset: 'Redefinir',
    columnsManagementDeleteIconLabel: 'Limpar',
  
    // Painel de filtros
    filterPanelAddFilter: 'Adicionar filtro',
    filterPanelRemoveAll: 'Remover todos',
    filterPanelDeleteIconLabel: 'Excluir',
    filterPanelLogicOperator: 'Operador lógico',
    filterPanelOperator: 'Operador',
    filterPanelOperatorAnd: 'E',
    filterPanelOperatorOr: 'OU',
    filterPanelColumns: 'Colunas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor do filtro',
  
    // Operadores de Filtros
    filterOperatorContains: 'contém',
    filterOperatorDoesNotContain: 'não contém',
    filterOperatorEquals: 'é igual a',
    filterOperatorDoesNotEqual: 'não é igual a',
    filterOperatorStartsWith: 'começa com',
    filterOperatorEndsWith: 'termina com',
    filterOperatorIs: 'é',
    filterOperatorNot: 'não é',
    filterOperatorAfter: 'é após',
    filterOperatorOnOrAfter: 'é em ou após',
    filterOperatorBefore: 'é antes',
    filterOperatorOnOrBefore: 'é em ou antes',
    filterOperatorIsEmpty: 'está vazio',
    filterOperatorIsNotEmpty: 'não está vazio',
    filterOperatorIsAnyOf: 'é qualquer um de',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
  
    // Operadores de Filtros no Cabeçalho
    headerFilterOperatorContains: 'Contém',
    headerFilterOperatorDoesNotContain: 'Não contém',
    headerFilterOperatorEquals: 'É igual a',
    headerFilterOperatorDoesNotEqual: 'Não é igual a',
    headerFilterOperatorStartsWith: 'Começa com',
    headerFilterOperatorEndsWith: 'Termina com',
    headerFilterOperatorIs: 'É',
    headerFilterOperatorNot: 'Não é',
    headerFilterOperatorAfter: 'É após',
    headerFilterOperatorOnOrAfter: 'É em ou após',
    headerFilterOperatorBefore: 'É antes',
    headerFilterOperatorOnOrBefore: 'É em ou antes',
    headerFilterOperatorIsEmpty: 'Está vazio',
    headerFilterOperatorIsNotEmpty: 'Não está vazio',
    headerFilterOperatorIsAnyOf: 'É qualquer um de',
    'headerFilterOperator=': 'Igual a',
    'headerFilterOperator!=': 'Diferente de',
    'headerFilterOperator>': 'Maior que',
    'headerFilterOperator>=': 'Maior ou igual a',
    'headerFilterOperator<': 'Menor que',
    'headerFilterOperator<=': 'Menor ou igual a',
  
    // Valores de Filtros
    filterValueAny: 'qualquer',
    filterValueTrue: 'verdadeiro',
    filterValueFalse: 'falso',
  
    // Menu de Colunas
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Exibir colunas',
    columnMenuManageColumns: 'Gerenciar colunas',
    columnMenuFilter: 'Filtrar',
    columnMenuHideColumn: 'Ocultar coluna',
    columnMenuUnsort: 'Remover ordenação',
    columnMenuSortAsc: 'Ordenar Ascendente',
    columnMenuSortDesc: 'Ordenar Descendente',
  
    // Cabeçalho de Colunas
    columnHeaderFiltersTooltipActive: (count) =>
      count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
    columnHeaderFiltersLabel: 'Mostrar filtros',
    columnHeaderSortIconLabel: 'Ordenar',
  
    // Rodapé (Linhas Selecionadas)
    footerRowSelected: (count) =>
      count !== 1
        ? `${count.toLocaleString()} linhas selecionadas`
        : `${count.toLocaleString()} linha selecionada`,
  
    footerTotalRows: 'Total de Linhas:',
  
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
  
    // Seleção por Checkbox
    checkboxSelectionHeaderName: 'Seleção por caixa de seleção',
    checkboxSelectionSelectAllRows: 'Selecionar todas as linhas',
    checkboxSelectionUnselectAllRows: 'Desmarcar todas as linhas',
    checkboxSelectionSelectRow: 'Selecionar linha',
    checkboxSelectionUnselectRow: 'Desmarcar linha',
  
    // Valores Booleanos
    booleanCellTrueLabel: 'sim',
    booleanCellFalseLabel: 'não',
  
    // Mais ações na célula
    actionsCellMore: 'mais',
  
    // Fixar Colunas
    pinToLeft: 'Fixar à esquerda',
    pinToRight: 'Fixar à direita',
    unpin: 'Desafixar',
  
    // Dados em Árvore
    treeDataGroupingHeaderName: 'Grupo',
    treeDataExpand: 'ver filhos',
    treeDataCollapse: 'ocultar filhos',
  
    // Agrupamento
    groupingColumnHeaderName: 'Grupo',
    groupColumn: (name) => `Agrupar por ${name}`,
    unGroupColumn: (name) => `Desagrupar por ${name}`,
  
    // Detalhes
    detailPanelToggle: 'Alternar painel de detalhes',
    expandDetailPanel: 'Expandir',
    collapseDetailPanel: 'Recolher',
  
    // Reordenação de Linhas
    rowReorderingHeaderName: 'Reordenar linhas',
  
    // Agregação
    aggregationMenuItemHeader: 'Agregação',
    aggregationFunctionLabelSum: 'soma',
    aggregationFunctionLabelAvg: 'média',
    aggregationFunctionLabelMin: 'mínimo',
    aggregationFunctionLabelMax: 'máximo',
    aggregationFunctionLabelSize: 'tamanho',

    // Paginação
    MuiTablePagination: {
        labelRowsPerPage: 'Linhas por página:',
        labelDisplayedRows: ({ from, to, count }) =>
        `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
    },

  };
  