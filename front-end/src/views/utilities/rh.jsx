// react
import React from 'react'; // Importando useState
import { Link } from 'react-router-dom';

// material-ui
import { IconArrowBackUp} from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TableCell, TableContainer, Table, TableRow, TableHead, TableBody } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterRH = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const handleRetorno = () => {
    navigate('/rh');
  };

  return (
    <MainCard title="Cadastro de RH" secondary={<SecondaryAction title='Retornar' icon={<IconArrowBackUp size={24}/>} onClick={handleRetorno}/>}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              email: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} {...others}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Aniversariantes do Mês</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Data</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>09/01</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Crachás</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Integrações</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vencimentos de CPST</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vencimentos de Exames</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vencimentos de NRs</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                        <TableContainer>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Disciplina</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>NR</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Willian</TableCell>
                                <TableCell>TI</TableCell>
                                <TableCell>willian@axisengenharia.com.br</TableCell>
                                <TableCell>NR-10</TableCell>
                              </TableRow>                                        
                            </TableBody>
                          </Table>
                        </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vencimentos de PCMSO</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vencimentos de PGR</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vencimentos de PPRA</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell>Disciplina</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Exame</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Willian</TableCell>
                              <TableCell>TI</TableCell>
                              <TableCell>willian@axisengenharia.com.br</TableCell>
                              <TableCell>ASO</TableCell>
                            </TableRow>                                        
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default RegisterRH;
