import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, FormHelperText, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material'; 
import * as Yup from 'yup';
import { Formik } from 'formik';
import { api } from 'services/api.js';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReturnButton from 'components/buttons/ReturnButton';

const CadastroDisciplinas = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [initialValues, setInitialValues] = useState({ nome: '', lider_resp: '' });
    const [lideres, setLideres] = useState([]);
    const [loading, setLoading] = useState(true); 

    // Busca a lista de líderes APENAS UMA VEZ
    useEffect(() => {
        const fetchLideres = async () => {
            try {
                const { data } = await api.get('/api/usuarios/managers');
                setLideres(data);
            } catch (error) {
                console.error('Erro ao buscar líderes:', error);
            }
        };
        fetchLideres();
    }, []);

    // Busca os dados da disciplina se houver um 'id'
    useEffect(() => {
        if (id) {
            setLoading(true); 
            const fetchData = async () => {
                try {
                    const response = await api.get(`/api/disciplinas/${id}`);
                    setInitialValues(response.data);
                } catch (error) {
                    console.error('Erro ao buscar dados da disciplina:', error);
                } finally {
                    setLoading(false); 
                }
            };
            fetchData();
        } else {
            setLoading(false); 
        }
    }, [id]);

    // Exibe o indicador de carregamento
    if (loading) {
        return (
            <MainCard title="Carregando...">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    return (
        <MainCard 
            title={id ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina'} 
            secondary={<ReturnButton onClick={() => navigate('/cadastros/disciplinas')} />}
        >
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    nome: Yup.string().max(255).required('O nome da disciplina é obrigatório'),
                    lider_resp: Yup.string().max(255).required('O líder é obrigatório')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (id) {
                            await api.put(`/api/disciplinas/${id}`, values);
                            alert('Disciplina atualizada com sucesso!');
                        } else {
                            await api.post('/api/disciplinas', values);
                            alert('Disciplina cadastrada com sucesso!');
                        }
                        navigate('/cadastros/disciplinas');
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
                                    inputProps={{ style: { textAlign: 'center' } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={Boolean(touched.lider_resp && errors.lider_resp)}>
                                    <InputLabel>Líder Responsável</InputLabel>
                                    <Select
                                        label="Líder Responsável"
                                        name="lider_resp"
                                        value={values.lider_resp}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    >
                                        {lideres
                                            .slice()
                                            .sort((a, b) => a.nome.localeCompare(b.nome))
                                            .map((lider) => (
                                                <MenuItem key={lider.id} value={lider.nome}>
                                                    {lider.nome}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    {touched.lider_resp && errors.lider_resp && (
                                        <FormHelperText>{errors.lider_resp}</FormHelperText>
                                    )}
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

export default CadastroDisciplinas;