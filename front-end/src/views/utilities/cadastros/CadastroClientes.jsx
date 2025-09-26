import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import { Button, TextField, Grid, Box, FormHelperText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReturnButton from 'components/buttons/ReturnButton';
import Loader from 'ui-component/Loader';

// ==============================|| PÁGINA DE CADASTRO DE CLIENTES ||============================== //

const CadastroClientes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [initialValues, setInitialValues] = useState({ nome: '', descricao: '', nome_cliente: '', nome_coordenador: '' });
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Always fetch collaborators
      try {
        const response = await api.get('/api/colaboradores');
        if (response.data && Array.isArray(response.data.data)) {
            setColaboradores(response.data.data);
        } else if (Array.isArray(response.data)) {
            setColaboradores(response.data);
        }
      } catch(e) {
        console.error("Erro ao buscar colaboradores:", e);
      }

      // Fetch client only if in edit mode
      if (id) {
        try {
          const response = await api.get(`/api/clientes/${id}`);
          const clientData = response.data?.data || response.data;
          
          if (clientData && typeof clientData === 'object') {
            setInitialValues({ ...clientData, nome_coordenador: clientData.nome_coordenador || '' });
          }
        } catch (e) {
          console.error("Erro ao buscar dados do cliente:", e);
        }
      }
      setLoading(false);
    };

    setLoading(!!id);
    fetchData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <MainCard 
      title={id ? 'Editar Cliente' : 'Cadastrar Novo Cliente'} 
      secondary={<ReturnButton onClick={() => navigate('/cadastros/clientes')} />}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          nome: Yup.string().max(255).required('O nome do cliente é obrigatório'),
          descricao: Yup.string().max(255),
          nome_cliente: Yup.string().max(255),
          nome_coordenador: Yup.string().max(255).required('O coordenador do projeto é obrigatório'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (id) {
              await api.put(`/api/clientes/${id}`, values);
              alert('Cliente atualizado com sucesso!');
            } else {
              await api.post('/api/clientes', values);
              alert('Cliente cadastrado com sucesso!');
            }
            navigate('/cadastros/clientes');
          } catch (error) {
            console.error(error);
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={values.nome}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.nome && errors.nome)}
                  helperText={touched.nome && errors.nome}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Cliente"
                  name="nome_cliente"
                  value={values.nome_cliente}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.nome_cliente && errors.nome_cliente)}
                  helperText={touched.nome_cliente && errors.nome_cliente}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={values.descricao}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.descricao && errors.descricao)}
                  helperText={touched.descricao && errors.descricao}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.nome_coordenador && errors.nome_coordenador)}>
                  <InputLabel>Coordenador do Projeto</InputLabel>
                  <Select
                    label="Coordenador do Projeto"
                    name="nome_coordenador"
                    value={values.nome_coordenador}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    {colaboradores.map((colaborador) => (
                      <MenuItem key={colaborador.id} value={colaborador.nome_bh}>
                        {colaborador.nome_bh}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.nome_coordenador && errors.nome_coordenador && <FormHelperText error>{errors.nome_coordenador}</FormHelperText>}
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
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default CadastroClientes;