import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// material-ui - Apenas um import de cada componente necessário
import { 
  useTheme, Box, Button, Checkbox, FormControlLabel, FormGroup, 
  FormHelperText, Grid, IconButton, InputAdornment, InputLabel, 
  OutlinedInput, TextField, Typography, Accordion, AccordionSummary, 
  AccordionDetails, FormControl, Select, MenuItem 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReturnButton from 'components/buttons/ReturnButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function RegistrarColaboradores({ ...others }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  // --- Estados ---
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [generos, setGeneros] = useState([]);
  
  const [initialValues, setInitialValues] = useState({
  // Seção Cadastrais
  nome: '',
  nome_bh: '',
  data_nascimento: '',
  genero_id: '',
  rg: '',
  cpf: '',
  cnpj: '',
  nome_empresarial: '',
  // Seção Contato
  email_pessoal: '',
  numero_telefone: '',
  cep: '',
  endereco: '',
  bairro: '',
  cidade: '',
  telefone_emergencia: '',
  nome_emergencia: '',
  parentesco: '',
  // Seção Bancários
  banco_id: '',
  agencia: '',
  conta: '',
  tipo_chave_pix: '',
  chave_pix: '',
  banco_pix_id: '',
  // Seção Contratuais
  status: true,
  email_interno: '',
  empresa: '',
  cargo: '',
  disciplina_id: '',
  contrato_id: '',
  horas_trabalhadas: '',
  valor: '',
  cracha: '',
  // Seção SSO
  data_aso: '',
  data_pcmso: '',
  data_pgr: '',
  // Seção NRs e outros
  data_nr_06: '',
  data_nr_10: '',
  data_sep: '',
  data_nr_20: '',
  data_nr_33: '',
  data_nr_35: '',
  data_pta_geral: '', 
  data_apr_charqueadas: '', 
  data_apr_sapucaia: '', 
  data_cnh: '',
  // Seção Vacinas
  vacina_hepatite_b: false,
  vacina_tetravalente: false,
  vacina_febre_amarela: false,
  vacina_antitetanica: false,
  vacina_covid: false,
  // Seção Formação
    instituicao: '',
    curso: '',
    ano_conclusao: '',
    cidade_formacao: '',
  // Seção Acesso
  senha: '',
  acesso: false
});

  // --- Funções Handler ---
  const handleRetorno = () => {
    navigate('/colaboradores');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };
  
  const [bancos, setBancos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [tiposContrato, setTiposContrato] = useState([]);

  // --- Efeitos (Carregamento de Dados) ---
  useEffect(() => {
  // Busca dados para os dropdowns
  const fetchDropdownData = async () => {
    try {
      // Capturando todas as 4 respostas da Promise
      const [generosRes, bancosRes, disciplinasRes, tiposContratoRes] = await Promise.all([
        api.get('/api/generos'),
        api.get('/api/bancos'),
        api.get('/api/disciplinas'),
        api.get('/api/contratos') 
      ]);
      
      setGeneros(generosRes.data);
      setBancos(bancosRes.data); 
      setDisciplinas(disciplinasRes.data);
      setTiposContrato(tiposContratoRes.data);

    } catch (error) {
      console.error('Erro ao buscar dados para os dropdowns:', error);
    }
  };
  fetchDropdownData();
}, []);

    useEffect(() => {
    // Busca dados do colaborador se estiver em modo de edição
    if (id) {
      const fetchColaboradorData = async () => {
        try {
          const response = await api.get(`/api/colaboradores/${id}`);
          const data = response.data;
          // Normaliza as datas
          Object.keys(data).forEach(key => {
            if (key === 'ano_conclusao' && data[key]) {
              try {
                data[key] = new Date(data[key]).toISOString().substring(0, 7);
              } catch(e) { data[key] = ''; }
            }
          });
          
          setInitialValues(prev => ({ ...prev, ...data }));

        } catch (error) {
          console.error('Erro ao buscar dados do colaborador:', error);
          
        }
      };
      fetchColaboradorData();
    }
  }, [id]);


  return (
    <MainCard title={id ? 'Editar Colaborador' : 'Cadastrar Colaborador'} secondary={<ReturnButton onClick={handleRetorno} />}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          nome: Yup.string().required('Nome é obrigatório'),
          data_nascimento: Yup.string().required('Data de nascimento é obrigatório'),
          email_pessoal: Yup.string().email('Deve ser um email válido').max(255).required('Email é obrigatório'),
          email_interno: Yup.string().email('Deve ser um email válido').max(255).required('Email é obrigatório'),
          cep: Yup.string().required('CEP é obrigatório'),
          cargo: Yup.string().required('Cargo é obrigatório'),
          disciplina_id: Yup.string().required('Disciplina é obrigatória'),
          contrato_id: Yup.string().required('Tipo de contrato é obrigatório'),
          data_pta_geral: Yup.date().nullable().typeError("Data PTA inválida"),
          data_apr_charqueadas: Yup.date().nullable().typeError("Data APR Charqueadas inválida"),
          data_apr_sapucaia: Yup.date().nullable().typeError("Data APR Sapucaia inválida"),
          instituicao: Yup.string().max(255).nullable(),
          curso: Yup.string().max(255).nullable(),
          ano_conclusao: Yup.string().matches(/^\d{4}-\d{2}$/, 'Formato inválido. Use AAAA-MM').nullable(),
          cidade_formacao: Yup.string().max(255).nullable(),
          nome_emergencia: Yup.string().max(255).nullable()
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const finalValues = { ...values };
            if (id && !finalValues.senha) {
              delete finalValues.senha;
            }

            if (id) {
              await api.put(`/api/colaboradores/${id}`, finalValues);
              alert('Colaborador atualizado com sucesso!');
            } else {
              await api.post('/api/colaboradores', finalValues);
              alert('Colaborador cadastrado com sucesso!');
            }
            navigate('/colaboradores');
          } catch (error) {
            console.error('Erro ao salvar colaborador:', error);
            alert(`Erro ao salvar: ${error.response?.data?.message || error.message}`);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Informações Cadastrais</Typography></AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Nome completo" name="nome" value={values.nome || ''} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.nome && errors.nome)} helperText={touched.nome && errors.nome}/></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Nome no banco de horas" name="nome_bh" value={values.nome_bh || ''} onChange={handleChange} onBlur={handleBlur} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Data de nascimento" name="data_nascimento" type="date" value={values.data_nascimento || ''} onChange={handleChange} onBlur={handleBlur} InputLabelProps={{ shrink: true }} error={Boolean(touched.data_nascimento && errors.data_nascimento)} helperText={touched.data_nascimento && errors.data_nascimento}/></Grid>
                    <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.genero_id && errors.genero_id)}>
                            <InputLabel>Gênero</InputLabel>
                            <Select label="Gênero" name="genero_id" value={values.genero_id || ''} onChange={handleChange} onBlur={handleBlur}>
                                <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                                {generos.map((g) => (<MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>))}
                            </Select>
                            {touched.genero_id && errors.genero_id && <FormHelperText error>{errors.genero_id}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="RG" name="rg" value={values.rg || ''} onChange={handleChange} onBlur={handleBlur} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="CPF" name="cpf" value={values.cpf || ''} onChange={handleChange} onBlur={handleBlur} /></Grid>
                    <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.filhos && errors.filhos)}>
                      <InputLabel>Filhos</InputLabel>
                      <Select
                        label="Filhos"
                        name="filhos"
                        value={values.filhos ?? ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                        <MenuItem value={true}>Sim</MenuItem>
                        <MenuItem value={false}>Não</MenuItem>
                      </Select>
                      {touched.filhos && errors.filhos && <FormHelperText error>{errors.filhos}</FormHelperText>}
                    </FormControl>
                  </Grid>
                    
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Dados de Contato</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="email">Email pessoal</InputLabel>
                      <OutlinedInput
                        id="email_pessoal"
                        type="email"
                        value={values.email_pessoal || ''}
                        name="email_pessoal"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.email_pessoal && errors.email_pessoal && (
                        <FormHelperText error id="standard-weight-helper-text--register">
                          {errors.email_pessoal}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      margin="normal"
                      name="numero_telefone"
                      type="text"
                      value={values.numero_telefone  || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.numero_telefone && errors.numero_telefone)}
                      helperText={touched.numero_telefone && errors.numero_telefone}
                    />
                  </Grid> 
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="CEP"
                      margin="normal"
                      name="cep"
                      type="text"
                      value={values.cep}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.cep && errors.cep)}
                      helperText={touched.cep && errors.cep}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      margin="normal"
                      name="endereco"
                      type="text"
                      value={values.endereco || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.endereco && errors.endereco)}
                      helperText={touched.endereco && errors.endereco}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Bairro"
                      margin="normal"
                      name="bairro"
                      type="text"
                      value={values.bairro  || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.bairro && errors.bairro)}
                      helperText={touched.bairro && errors.bairro}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      margin="normal"
                      name="cidade"
                      type="text"
                      value={values.cidade || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.cidade && errors.cidade)}
                      helperText={touched.cidade && errors.cidade}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Telefone emergência"
                      margin="normal"
                      name="telefone_emergencia"
                      type="text"
                      value={values.telefone_emergencia || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.telefone_emergencia && errors.telefone_emergencia)}
                      helperText={touched.telefone_emergencia && errors.telefone_emergencia}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Nome emergência"
                      margin="normal"
                      name="nome_emergencia"
                      type="text"
                      value={values.nome_emergencia || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.nome_emergencia && errors.nome_emergencia)}
                      helperText={touched.nome_emergencia && errors.nome_emergencia}
                    />
                  </Grid>                
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Parentesco"
                      margin="normal"
                      name="parentesco"
                      type="text"
                      value={values.parentesco || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.parentesco && errors.parentesco)}
                      helperText={touched.parentesco && errors.parentesco}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                <Typography>Dados Bancários</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.banco_id && errors.banco_id)}>
                      <InputLabel>Banco</InputLabel>
                      <Select
                        label="Banco"
                        name="banco_id"
                        value={values.banco_id || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                        {bancos.map((banco) => (
                          <MenuItem key={banco.id} value={banco.id}>
                            {banco.nome}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.banco_id && errors.banco_id && (
                        <FormHelperText error>{errors.banco_id}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Agência"
                      name="agencia"
                      value={values.agencia || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.agencia && errors.agencia)}
                      helperText={touched.agencia && errors.agencia}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Conta"
                      name="conta"
                      value={values.conta || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.conta && errors.conta)}
                      helperText={touched.conta && errors.conta}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Tipo de chave pix"
                      name="tipo_chave_pix"
                      value={values.tipo_chave_pix || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.tipo_chave_pix && errors.tipo_chave_pix)}
                      helperText={touched.tipo_chave_pix && errors.tipo_chave_pix}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                      <FormControl fullWidth error={Boolean(touched.banco_pix_id && errors.banco_pix_id)}>
                          <InputLabel>Banco (Pix)</InputLabel>
                          <Select
                              label="Banco (Pix)"
                              name="banco_pix_id" // Use a chave correta para o banco do pix
                              value={values.banco_pix_id || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                          >
                              <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                              {bancos.map((banco) => (
                                  <MenuItem key={banco.id} value={banco.id}>
                                      {banco.nome}
                                  </MenuItem>
                              ))}
                          </Select>
                          {touched.banco_pix_id && errors.banco_pix_id && (
                            <FormHelperText error>{errors.banco_pix_id}</FormHelperText>
                          )}
                      </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Chave pix"
                      name="chave_pix"
                      value={values.chave_pix || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.chave_pix && errors.chave_pix)}
                      helperText={touched.chave_pix && errors.chave_pix}
                    />
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Dados Contratuais</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        label="Status"
                        value={values.status}
                        onChange={handleChange}
                      >
                        <MenuItem value={true}>Ativo</MenuItem>
                        <MenuItem value={false}>Inativo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.email_interno && errors.email_interno)}>
                        <InputLabel>Email interno</InputLabel>
                        <OutlinedInput
                          name="email_interno"
                          type="email"
                          value={values.email_interno || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Email interno"
                        />
                        {touched.email_interno && errors.email_interno && (
                            <FormHelperText error>{errors.email_interno}</FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Empresa"
                      name="empresa"
                      value={values.empresa || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      name="cargo"
                      value={values.cargo || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.cargo && errors.cargo)}
                      helperText={touched.cargo && errors.cargo}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.disciplina_id && errors.disciplina_id)}>
                      <InputLabel>Disciplina</InputLabel>
                      <Select
                        name="disciplina_id"
                        label="Disciplina"
                        value={values.disciplina_id || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                        {disciplinas.map((d) => (
                          <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>
                        ))}
                      </Select>
                      {touched.disciplina_id && errors.disciplina_id && (
                        <FormHelperText error>{errors.disciplina_id}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.contrato_id && errors.contrato_id)}>
                      <InputLabel>Tipo de contrato</InputLabel>
                      <Select
                        name="contrato_id"
                        label="Tipo de contrato"
                        value={values.contrato_id || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                        {tiposContrato.map((tc) => (
                          <MenuItem key={tc.id} value={tc.id}>{tc.nome}</MenuItem>
                        ))}
                      </Select>
                      {touched.contrato_id && errors.contrato_id && (
                        <FormHelperText error>{errors.contrato_id}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Horas trabalhadas" name="horas_trabalhadas" value={values.horas_trabalhadas || ''} onChange={handleChange} /></Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Valor" name="valor" value={values.valor || ''} onChange={handleChange} /></Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Crachá" name="cracha" value={values.cracha || ''} onChange={handleChange} /></Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="CNPJ" name="cnpj" value={values.cnpj || ''} onChange={handleChange} onBlur={handleBlur} /></Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Nome empresarial" name="nome_empresarial" value={values.nome_empresarial || ''} onChange={handleChange} onBlur={handleBlur} /></Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Saúde e Segurança Ocupacional</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data ASO"
                      margin="normal"
                      name="data_aso"
                      type="date"
                      value={values.data_aso || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_aso && errors.data_aso)}
                      helperText={touched.data_aso && errors.data_aso}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data PCMSO"
                      margin="normal"
                      name="data_pcmso"
                      type="date"
                      value={values.data_pcmso || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_pcmso && errors.data_pcmso)}
                      helperText={touched.data_pcmso && errors.data_pcmso}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data PGR"
                      margin="normal"
                      name="data_pgr"
                      type="date"
                      value={values.data_pgr || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_pgr && errors.data_pgr)}
                      helperText={touched.data_pgr && errors.data_pgr}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Normas Regulamentadoras</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}> {/* Abre o container para todos os itens */}
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data NR 06"
                      margin="normal"
                      name="data_nr_06"
                      type="date"
                      value={values.data_nr_06 || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_nr_06 && errors.data_nr_06)}
                      helperText={touched.data_nr_06 && errors.data_nr_06}
                      InputLabelProps={{ shrink: true }} // Adicionando para consistência
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data NR 10"
                      margin="normal"
                      name="data_nr_10"
                      type="date"
                      value={values.data_nr_10 || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_nr_10 && errors.data_nr_10)}
                      helperText={touched.data_nr_10 && errors.data_nr_10}
                      InputLabelProps={{ shrink: true }} // Adicionando para consistência
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data SEP"
                      margin="normal"
                      name="data_sep"
                      type="date"
                      value={values.data_sep || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_sep && errors.data_sep)}
                      helperText={touched.data_sep && errors.data_sep}
                      InputLabelProps={{ shrink: true }} // Adicionando para consistência
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data NR 20"
                      margin="normal"
                      name="data_nr_20"
                      type="date"
                      value={values.data_nr_20 || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_nr_20 && errors.data_nr_20)}
                      helperText={touched.data_nr_20 && errors.data_nr_20}
                      InputLabelProps={{ shrink: true }} // Adicionando para consistência
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data NR 33"
                      margin="normal"
                      name="data_nr_33"
                      type="date"
                      value={values.data_nr_33 || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_nr_33 && errors.data_nr_33)}
                      helperText={touched.data_nr_33 && errors.data_nr_33}
                      InputLabelProps={{ shrink: true }} // Adicionando para consistência
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data NR 35"
                      margin="normal"
                      name="data_nr_35"
                      type="date"
                      value={values.data_nr_35 || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_nr_35 && errors.data_nr_35)}
                      helperText={touched.data_nr_35 && errors.data_nr_35}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>       
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="PTA"
                      margin="normal"
                      name="data_pta_geral"
                      type="date"
                      value={values.data_pta_geral || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_pta_geral && errors.data_pta_geral)}
                      helperText={touched.data_pta_geral && errors.data_pta_geral}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="APR Charqueadas"
                      margin="normal"
                      name="data_apr_charqueadas" // Nome atualizado
                      type="date"
                      value={values.data_apr_charqueadas || ''} // Nome atualizado
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_apr_charqueadas && errors.data_apr_charqueadas)} // Nome atualizado
                      helperText={touched.data_apr_charqueadas && errors.data_apr_charqueadas} // Nome atualizado
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="APR Sapucaia"
                      margin="normal"
                      name="data_apr_sapucaia" // Nome atualizado
                      type="date"
                      value={values.data_apr_sapucaia || ''} // Nome atualizado
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_apr_sapucaia && errors.data_apr_sapucaia)} // Nome atualizado
                      helperText={touched.data_apr_sapucaia && errors.data_apr_sapucaia} // Nome atualizado
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid> {/* Este </Grid> fecha o <Grid container spacing={2}> */}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Habilitação</Typography>
              </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Data CNH"
                      margin="normal"
                      name="data_cnh"
                      type="date"
                      value={values.data_cnh || ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.data_cnh && errors.data_cnh)}
                      helperText={touched.data_cnh && errors.data_cnh}
                    />
                  </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Vacinas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="vacina_hepatite_b"
                            checked={values.vacina_hepatite_b}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        }
                        label="Vacina Hepatite B"
                      />
                      <FormHelperText error={Boolean(touched.vacina_hepatite_b && errors.vacina_hepatite_b)}>
                        {touched.vacina_hepatite_b && errors.vacina_hepatite_b}
                      </FormHelperText>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="vacina_tetravalente"
                            checked={values.vacina_tetravalente}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        }
                        label="Vacina Tetravalente"
                      />
                      <FormHelperText error={Boolean(touched.vacina_tetravalente && errors.vacina_tetravalente)}>
                        {touched.vacina_tetravalente && errors.vacina_tetravalente}
                      </FormHelperText>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="vacina_febre_amarela"
                            checked={values.vacina_febre_amarela}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        }
                        label="Vacina Febre Amarela"
                      />
                      <FormHelperText error={Boolean(touched.vacina_febre_amarela && errors.vacina_febre_amarela)}>
                        {touched.vacina_febre_amarela && errors.vacina_febre_amarela}
                      </FormHelperText>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="vacina_antitetanica"
                            checked={values.vacina_antitetanica}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        }
                        label="Vacina Antitetânica"
                      />
                      <FormHelperText error={Boolean(touched.vacina_antitetanica && errors.vacina_antitetanica)}>
                        {touched.vacina_antitetanica && errors.vacina_antitetanica}
                      </FormHelperText>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="vacina_covid"
                            checked={values.vacina_covid}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        }
                        label="Vacina Covid"
                      />
                      <FormHelperText error={Boolean(touched.vacina_covid && errors.vacina_covid)}>
                        {touched.vacina_covid && errors.vacina_covid}
                      </FormHelperText>
                    </FormGroup>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Formação</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Instituição"
                      margin="normal"
                      name="instituicao" 
                      type="text"
                      value={values.instituicao || ''} 
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.instituicao && errors.instituicao)} 
                      helperText={touched.instituicao && errors.instituicao} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Curso"
                      margin="normal"
                      name="curso" 
                      type="text"
                      value={values.curso || ''} 
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.curso && errors.curso)} 
                      helperText={touched.curso && errors.curso} 
                    />
                  </Grid> 
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ano de conclusão"
                      margin="normal"
                      name="ano_conclusao" 
                      type="month" 
                      value={values.ano_conclusao || ''} 
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      InputLabelProps={{ shrink: true }} 
                      error={Boolean(touched.ano_conclusao && errors.ano_conclusao)} 
                      helperText={touched.ano_conclusao && errors.ano_conclusao} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      margin="normal"
                      name="cidade_formacao" 
                      type="text"
                      value={values.cidade_formacao || ''} 
                      onBlur={handleBlur}
                      onChange={handleChange}
                      sx={{ ...theme.typography.customInput }}
                      error={Boolean(touched.cidade_formacao && errors.cidade_formacao)} 
                      helperText={touched.cidade_formacao && errors.cidade_formacao} 
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

{/*
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Acesso ao sistema</Typography>
              </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={4} sm={4}>
                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="outlined-adornment-password-register">Senha</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? 'text' : 'password'}
                        value={values.senha || ''}
                        name="senha"
                        label="Senha"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                        }}
                        error={Boolean(touched.senha && errors.senha)}
                        helperText={touched.senha && errors.senha}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        inputProps={{}}
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-register">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </FormControl>

                    {strength !== 0 && (
                      <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                            </Grid>
                            <Grid item>
                              <Typography variant="subtitle1" fontSize="0.75rem">
                                {level?.label}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </FormControl>
                    )}
                  </Grid>
                </AccordionDetails>
            </Accordion>
*/}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  {id ? 'Atualizar Colaborador' : 'Cadastrar'}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
}
      
