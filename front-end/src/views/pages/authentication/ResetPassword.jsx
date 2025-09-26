import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';

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

const ResetPassword = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('Token de redefinição não encontrado. Por favor, verifique o link ou solicite um novo.');
    }
  }, [searchParams]);

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
                        Redefinir Senha
                      </Typography>
                      <Typography variant="subtitle1" color="first.main">
                        Por favor, insira sua nova senha.
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Form */}  
                  <Grid item xs={12}>
                    {token ? (
                      <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={Yup.object().shape({
                          password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
                          confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
                            .required('A confirmação de senha é obrigatória')
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                          setMessage('');
                          setError('');
                          try {
                            const response = await api.post('/api/auth/reset-password', {
                              token,
                              newPassword: values.password
                            });
                            setMessage(response.data.message + ' Você será redirecionado para o login.');
                            setTimeout(() => navigate('/login'), 3000);
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
                              label="Nova Senha"
                              margin="normal"
                              name="password"
                              type="password"
                              value={values.password}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              error={Boolean(touched.password && errors.password)}
                              helperText={touched.password && errors.password}
                            />
                            <TextField
                              fullWidth
                              label="Confirmar Nova Senha"
                              margin="normal"
                              name="confirmPassword"
                              type="password"
                              value={values.confirmPassword}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                              helperText={touched.confirmPassword && errors.confirmPassword}
                            />

                            {message && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" color="success.main">{message}</Typography>
                              </Box>
                            )}
                            
                            {/* Display general error inside the form */}
                            {!message && error && (
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
                                  color="secondary"
                                >
                                  Redefinir Senha
                                </Button>
                              </AnimateButton>
                            </Box>
                          </form>
                        )}
                      </Formik>
                    ) : (
                      <Typography color="error" align="center">{error}</Typography>
                    )}
                  </Grid>

                   {/* Back to Login Link */}
                   <Grid item xs={12}>
                    <Typography variant="body1" color="primary.dark" align="center" sx={{ mt: 2 }}>
                      <RouterLink to="/login" style={{ textDecoration: 'none', color: '#43a047' }}>
                        Voltar para o login
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

export default ResetPassword;