export const colunas = {
    cadastros: ['id', 'nome'],
    clientes: ['id', 'nome', 'descricao', 'nome_cliente', 'nome_coordenador'],
    disciplinas: ['id', 'nome', 'lider_resp'],
    aniversariantes: ['id', 'nome', 'disciplina_id', 'data_nascimento', 'status'],
    crachas: ['id', 'nome', 'disciplina_id', 'cracha', 'status'],
    integracoes: ['id', 'colaborador_id', 'cliente_id', 'data_integracao'],
    cpst: ['id', 'colaborador_id', 'data_renovacao', 'status'],
    exames: ['id', 'nome', 'disciplina_id', 'data_aso', 'status'],
    nrs: ['id', 'nome', 'disciplina_id', 'data_nr_06', 'data_nr_10', 'data_sep', 'data_nr_20', 'data_nr_33', 'data_nr_35', 'data_pta_geral', 'data_apr_charqueadas', 'data_apr_sapucaia', 'status'],
    pcmso: ['id', 'nome', 'disciplina_id', 'data_pcmso', 'status'],
    pgr: ['id', 'nome', 'disciplina_id', 'data_pgr', 'status'],
    cnh: ['id', 'nome', 'disciplina_id', 'data_cnh', 'status'],
    salarios: ['id', 'nome', 'disciplina_id', 'valor', 'status'],
  };
  