import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// material-ui
import { IconArrowBackUp } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { useNavigate } from 'react-router-dom';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReturnButton from 'components/buttons/ReturnButton';

export default function RegistrarClientes({ ...others }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Pega os parâmetros da URL
  const id = searchParams.get('id'); // Obtém o valor do parâmetro `id` da URL

  const [initialValues, setInitialValues] = useState({
    nome_fantasia: '',
    razao_social: '',
    cnpj: '',
    email: '',
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const handleRetorno = () => {
    navigate('/clientes');
  };

  // Efeito para buscar os dados do cliente se o ID estiver presente
  useEffect(() => {
    const fetchClientData = async () => {
      if (id) {
        try {
          const response = await api.get(`/clientes/${id}`);
          console.log('Dados do cliente:', response.data); // Log para verificação
          setInitialValues(response.data); // Preenche os campos com os dados do cliente
        } catch (error) {
          console.error('Erro ao buscar dados do cliente:', error);
          alert('Erro ao buscar dados do cliente');
        }
      }
    };

    fetchClientData();
  }, [id]);

  return (
    <MainCard title="Cadastro de Clientes" secondary={<ReturnButton onClick={handleRetorno}/>}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Formik
            initialValues={initialValues}
            enableReinitialize // Permite atualizar os valores iniciais quando `initialValues` muda
            validationSchema={Yup.object().shape({
              nome_fantasia: Yup.string().required('Nome fantasia é obrigatório'),
              razao_social: Yup.string().required('Razão social é obrigatória'),
              cnpj: Yup.string().matches(/^[0-9]{14}$/, 'CNPJ deve conter apenas 14 dígitos numéricos').required('CNPJ é obrigatório'),
              email: Yup.string().email('Deve ser um email válido').max(255).required('Email é obrigatório'),
              cep: Yup.string().required('CEP é obrigatório'),
              endereco: Yup.string().required('Endereço é obrigatório'),
              bairro: Yup.string().required('Bairro é obrigatório'),
              cidade: Yup.string().required('Cidade é obrigatória'),
              estado: Yup.string().required('Estado é obrigatório'),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log('Valores do formulário:', values); // Log para verificação
              try {
                if (id) {
                  // Se houver ID, atualizar o cliente
                  const response = await api.put(`/clientes/${id}`, values);
                  console.log(response.data);
                  alert('Cliente atualizado com sucesso!');
                } else {
                  // Se não houver ID, criar um novo cliente
                  const response = await api.post("/clientes", values);
                  console.log(response.data);
                  alert('Cliente cadastrado com sucesso!');
                }
                resetForm();
              } catch (error) {
                console.error('Erro ao cadastrar ou atualizar cliente:', error.response?.data || error.message);
                alert('Erro ao cadastrar ou atualizar cliente');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} {...others}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Informações Cadastrais</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={4}>
                        <TextField
                          fullWidth
                          label="Nome fantasia"
                          margin="normal"
                          name="nome_fantasia"
                          type="text"
                          value={values.nome_fantasia}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ ...theme.typography.customInput }}
                          error={Boolean(touched.nome_fantasia && errors.nome_fantasia)}
                          helperText={touched.nome_fantasia && errors.nome_fantasia}
                        />
                      </Grid>
                      <Grid item xs={4} sm={4}>
                        <TextField
                          fullWidth
                          label="Razão social"
                          margin="normal"
                          name="razao_social"
                          type="text"
                          value={values.razao_social}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ ...theme.typography.customInput }}
                          error={Boolean(touched.razao_social && errors.razao_social)}
                          helperText={touched.razao_social && errors.razao_social}
                        />
                      </Grid>
                      <Grid item xs={4} sm={4}>
                        <TextField
                          fullWidth
                          label="CNPJ"
                          margin="normal"
                          name="cnpj"
                          type="text"
                          value={values.cnpj}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ ...theme.typography.customInput }}
                          error={Boolean(touched.cnpj && errors.cnpj)}
                          helperText={touched.cnpj && errors.cnpj}
                        />
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
                          <InputLabel htmlFor="outlined-adornment-email-register">Email</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-email-register"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text--register">
                              {errors.email}
                            </FormHelperText>
                          )}
                        </FormControl>
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
                          value={values.endereco}
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
                          value={values.bairro}
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
                          value={values.cidade}
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
                          label="Estado"
                          margin="normal"
                          name="estado"
                          type="text"
                          value={values.estado}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ ...theme.typography.customInput }}
                          error={Boolean(touched.estado && errors.estado)}
                          helperText={touched.estado && errors.estado}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Integração</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={4}>
                        <TextField
                          fullWidth
                          label="Validade Integração"
                          margin="normal"
                          name="validade_integracao"
                          type="text"
                          value={values.validade_integracao}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ ...theme.typography.customInput }}
                          error={Boolean(touched.validade_integracao && errors.validade_integracao)}
                          helperText={touched.validade_integracao && errors.validade_integracao}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        {id ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </MainCard>
  );
}
