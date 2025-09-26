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

// ==============================|| PÁGINA DE CADASTRO DE BANCOS ||============================== //

const CadastroBancos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [initialValues, setInitialValues] = useState({
    nome: ''
  });

  // useEffect para buscar os dados do banco se estivermos no modo de edição
  useEffect(() => {
    if (id) {
      const fetchBancoData = async () => {
        try {
          const response = await api.get(`/api/bancos/${id}`);
          setInitialValues(response.data); // Preenche o formulário com os dados recebidos
        } catch (error) {
          console.error('Erro ao buscar dados do banco:', error);
          alert('Erro ao buscar dados do banco.');
        }
      };
      fetchBancoData();
    }
  }, [id]); // Roda sempre que o ID na URL mudar

  return (
    <MainCard 
      title={id ? 'Editar Banco' : 'Cadastrar Novo Banco'} 
      secondary={<ReturnButton onClick={() => navigate('/cadastros/bancos')} />}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize // Essencial para preencher o formulário com dados da API
        validationSchema={Yup.object().shape({
          nome: Yup.string().max(255).required('O nome do banco é obrigatório')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (id) {
              // Modo de Atualização (PUT)
              await api.put(`/api/bancos/${id}`, values);
              alert('Banco atualizado com sucesso!');
            } else {
              // Modo de Criação (POST)
              await api.post('/api/bancos', values);
              alert('Banco cadastrado com sucesso!');
            }
            // Redireciona de volta para a lista
            navigate('/cadastros/bancos');
          } catch (error) {
            console.error(error);
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
            alert(`Erro ao salvar: ${error.message}`);
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

export default CadastroBancos;