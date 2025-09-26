import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Button, TextField, Grid, Box, Typography, Stack, useMediaQuery } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo'; 

const ForgotPassword = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  {/* Logo and System Name */}
                  <Grid item sx={{ mb: 3 }}>
                    <RouterLink to="#" aria-label="logo">
                      <Logo />
                    </RouterLink>
                    <Typography color="first.main" gutterBottom variant="h6" sx={{ textAlign: 'center' }}>
                      Sistema Alocação de Horas
                    </Typography>
                  </Grid>

                  {/* Title and Subtitle */}
                  <Grid item xs={12}>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                        Esqueceu a senha?
                      </Typography>
                      <Typography variant="subtitle1" color="first.main">
                        Digite seu e-mail para continuar
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Form */}
                  <Grid item xs={12}>
                    <Formik
                      initialValues={{ email: '' }}
                      validationSchema={Yup.object().shape({
                        email: Yup.string().email('Deve ser um e-mail válido').max(255).required('O e-mail é obrigatório')
                      })}
                      onSubmit={async (values, { setSubmitting }) => {
                        setMessage('');
                        setError('');
                        try {
                          const response = await api.post('/api/auth/forgot-password', { email: values.email });
                          setMessage(response.data.message);
                        } catch (err) {
                          setError(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                    >
                      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                          <TextField
                            fullWidth
                            label="Endereço de E-mail"
                            margin="normal"
                            name="email"
                            type="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                          />

                          {message && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle1" color="success.main">{message}</Typography>
                            </Box>
                          )}
                          {error && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle1" color="error">{error}</Typography>
                            </Box>
                          )}

                          <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                              <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary" // 
                              >
                                Enviar e-mail
                              </Button>
                            </AnimateButton>
                          </Box>
                        </form>
                      )}
                    </Formik>
                  </Grid>

                  {/* Back to Login Link */}
                  <Grid item xs={12}>
                    <Typography variant="body1" color="primary.dark" align="center" sx={{ mt: 2 }}>
                      Lembrou a senha?{' '}
                      <RouterLink to="/login" style={{ textDecoration: 'none', color: '#43a047' /* Or your theme's secondary color */ }}>
                        Faça o login
                      </RouterLink>
                    </Typography>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotPassword;