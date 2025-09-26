import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, FormHelperText, Select, MenuItem, InputLabel, FormControl, Autocomplete } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';

// imports do projeto
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReturnButton from 'components/buttons/ReturnButton';

const CadastroUsuarios = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  // Estados para os dados dos dropdowns
  const [colaboradores, setColaboradores] = useState([]);
  const [permissoes, setPermissoes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [isNewColaborador, setIsNewColaborador] = useState(false);

  const [initialValues, setInitialValues] = useState({
    colaborador_id: '',
    permissao_id: '',
    disciplina_id: '',
    senha: '',
    acesso: true,
    nome: '',
    email_interno: '',
    data_nascimento: ''
  });

  // useEffect para buscar os dados dos dropdowns na montagem do componente
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [colaboradoresRes, permissoesRes, disciplinasRes] = await Promise.all([
          api.get('/api/colaboradores/ativos'),
          api.get('/api/permissoes'),      
          api.get('/api/disciplinas')
        ]);
        setColaboradores([{ id: 'new', nome: 'Novo Colaborador (+)' }, ...colaboradoresRes.data]);
        setPermissoes(permissoesRes.data);
        setDisciplinas(disciplinasRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados para os formulários:', error);
      }
    };
    fetchDropdownData();
  }, []);

  // useEffect para buscar os dados do usuário em modo de edição
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await api.get(`/api/usuarios/${id}`);
          const { colaborador_id, permissao_id, acesso, disciplina_id_colaborador } = response.data;
          setInitialValues({
            colaborador_id,
            permissao_id,
            acesso,
            disciplina_id: disciplina_id_colaborador,
            senha: '',
            nome: '',
            email_interno: '',
            data_nascimento: ''
          });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      };
      fetchData();
    }
  }, [id]);

  return (
    <MainCard 
      title={id ? 'Editar Usuário' : 'Cadastrar Novo Usuário'} 
      secondary={<ReturnButton onClick={() => navigate('/cadastros/usuarios')} />}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          colaborador_id: Yup.mixed().required('O colaborador é obrigatório'),
          permissao_id: Yup.number().required('A permissão é obrigatória'),
          disciplina_id: Yup.number().required('A disciplina é obrigatória'),
          // A senha só é obrigatória ao criar um novo usuário
          senha: id ? Yup.string() : Yup.string().required('A senha é obrigatória'),
          nome: isNewColaborador ? Yup.string().required('O nome é obrigatório') : Yup.string(),
          email_interno: isNewColaborador ? Yup.string().email('Email inválido').required('O email é obrigatório') : Yup.string(),
          data_nascimento: isNewColaborador ? Yup.date().required('A data de nascimento é obrigatória') : Yup.date(),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            let colaboradorId = values.colaborador_id;

            if (isNewColaborador) {
              try {
                const novoColaborador = {
                  nome: values.nome,
                  email_interno: values.email_interno,
                  data_nascimento: values.data_nascimento,
                  status: true,
                };
                const response = await api.post('/api/colaboradores', novoColaborador);
                colaboradorId = response.data.id;
              } catch (error) {
                if (error.response && error.response.data && error.response.data.message.includes('Este colaborador já existe no sistema!')) {
                  setErrors({ submit: 'Este colaborador já existe no sistema!' });
                } else {
                  setErrors({ submit: 'Erro ao criar novo colaborador.' });
                }
                setSubmitting(false);
                return;
              }
            }

            const finalValues = {
              colaborador_id: colaboradorId,
              permissao_id: values.permissao_id,
              disciplina_id: values.disciplina_id,
              senha: values.senha,
              acesso: values.acesso,
            };

            if (!finalValues.senha) {
              delete finalValues.senha;
            }
            
            if (id) {
              await api.put(`/api/usuarios/${id}`, finalValues);
              alert('Usuário atualizado com sucesso!');
            } else {
              await api.post('/api/usuarios', finalValues);
              alert('Usuário cadastrado com sucesso!');
            }
            navigate('/cadastros/usuarios');
          } catch (error) {
            console.error(error);
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            {errors.submit && (
              <Box sx={{ mb: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={Boolean(touched.colaborador_id && errors.colaborador_id)}>
                  <Autocomplete
                    id="colaborador_id"
                    options={colaboradores}
                    getOptionLabel={(option) => option.nome}
                    value={colaboradores.find(c => c.id === values.colaborador_id) || null}
                    onChange={(event, newValue) => {
                      if (newValue && newValue.id === 'new') {
                        setIsNewColaborador(true);
                        setFieldValue('colaborador_id', 'new');
                      } else if (newValue && newValue.id) {
                        setFieldValue('colaborador_id', newValue.id);
                        setIsNewColaborador(false);
                      } else {
                        setFieldValue('colaborador_id', '');
                        setIsNewColaborador(false);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Colaborador"
                        onBlur={handleBlur}
                        name="colaborador_id"
                        error={Boolean(touched.colaborador_id && errors.colaborador_id)}
                      />
                    )}
                  />
                  {touched.colaborador_id && errors.colaborador_id && <FormHelperText error>{errors.colaborador_id}</FormHelperText>}
                </FormControl>
              </Grid>

              {isNewColaborador && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome Novo Colaborador"
                      name="nome"
                      value={values.nome}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.nome && errors.nome)}
                      helperText={touched.nome && errors.nome}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Interno"
                      name="email_interno"
                      type="email"
                      value={values.email_interno}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.email_interno && errors.email_interno)}
                      helperText={touched.email_interno && errors.email_interno}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Data de Nascimento"
                      name="data_nascimento"
                      type="date"
                      value={values.data_nascimento}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={Boolean(touched.data_nascimento && errors.data_nascimento)}
                      helperText={touched.data_nascimento && errors.data_nascimento}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={Boolean(touched.permissao_id && errors.permissao_id)}>
                  <InputLabel>Tipo de Permissão</InputLabel>
                  <Select
                    name="permissao_id"
                    value={values.permissao_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {permissoes.map((permissao) => (
                      <MenuItem key={permissao.id} value={permissao.id}>
                        {permissao.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.permissao_id && errors.permissao_id && <FormHelperText error>{errors.permissao_id}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={Boolean(touched.disciplina_id && errors.disciplina_id)}> 
                  <InputLabel>Disciplina</InputLabel>
                  <Select
                    name="disciplina_id"
                    value={values.disciplina_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {disciplinas.map((disciplina) => (
                      <MenuItem key={disciplina.id} value={disciplina.id}>
                        {disciplina.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.disciplina_id && errors.disciplina_id && <FormHelperText error>{errors.disciplina_id}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  type="password"
                  value={values.senha}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={id ? 'Deixe em branco para não alterar' : ''}
                  error={Boolean(touched.senha && errors.senha)}
                  helperText={touched.senha && errors.senha}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                 <FormControl fullWidth error={Boolean(touched.acesso && errors.acesso)}>
                  <InputLabel>Acesso</InputLabel>
                  <Select
                    name="acesso"
                    value={values.acesso}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value={true}>Permitido</MenuItem>
                    <MenuItem value={false}>Restrito</MenuItem>
                  </Select>
                  {touched.acesso && errors.acesso && <FormHelperText error>{errors.acesso}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {id ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </AnimateButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default CadastroUsuarios;
