import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import { Button, TextField, Grid, Box, FormHelperText } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReturnButton from 'components/buttons/ReturnButton';

// ==============================|| PÁGINA DE CADASTRO DE CONTRATOS ||============================== //

const CadastroContratos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [initialValues, setInitialValues] = useState({ nome: '' });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await api.get(`/api/contratos/${id}`);
          setInitialValues(response.data);
        } catch (error) {
          console.error('Erro ao buscar dados do contrato:', error);
        }
      };
      fetchData();
    }
  }, [id]);

  return (
    <MainCard 
      title={id ? 'Editar Contrato' : 'Cadastrar Novo Contrato'} 
      secondary={<ReturnButton onClick={() => navigate('/cadastros/contratos')} />}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          nome: Yup.string().max(255).required('O nome do contrato é obrigatório')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (id) {
              await api.put(`/api/contratos/${id}`, values);
              alert('Contrato atualizado com sucesso!');
            } else {
              await api.post('/api/contratos', values);
              alert('Contrato cadastrado com sucesso!');
            }
            navigate('/cadastros/contratos');
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

export default CadastroContratos;