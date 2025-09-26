import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditButton from 'components/buttons/EditButton';
import { api } from 'services/api.js';
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import { ptBR } from 'date-fns/locale/pt-BR';
import { parseISO, format } from 'date-fns';


const AlocarHoras = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    local: 'Presencial',
    tipo: 'Projeto',
    cliente_id: '',
    disciplina_id: '',
    horas: '',
    startTime: '',
    endTime: '',
    comments: ''
  });

  const [clientes, setClientes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [nomeOptions, setNomeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasLunchBreak, setHasLunchBreak] = useState(false);
  const [allocatedHours, setAllocatedHours] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentAllocationId, setCurrentAllocationId] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [retroactivePermissions, setRetroactivePermissions] = useState([]);
  const [localMessage, setLocalMessage] = useState('');

  const calculateHours = useCallback(() => {
    const { startTime, endTime } = formData;
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      let diff = (end - start) / 1000 / 60 / 60;

      if (hasLunchBreak) {
        diff -= 1;
      }

      if (diff > 0) {
        setFormData((prev) => ({ ...prev, horas: diff.toFixed(2) }));
      } else {
        setFormData((prev) => ({ ...prev, horas: '0.00' }));
      }
    }
  }, [formData.startTime, formData.endTime, hasLunchBreak]);

  const fetchAllocatedHours = useCallback(async (manageLoading = true) => {
    try {
      if (manageLoading) setLoading(true);
      const response = await api.get('/api/alocacoes/last');
    
      const lastAllocation = Array.isArray(response.data) ? response.data[response.data.length - 1] : response.data;
      const dataToSet = lastAllocation ? [lastAllocation] : [];
      setAllocatedHours(dataToSet);
      console.log('Data received from API and set to allocatedHours:', dataToSet);
    } catch (err) {
      console.error("Failed to fetch allocated hours:", err);
      if (err.response && err.response.status !== 404) {
        setError("Failed to load allocated hours. Please try again later.");
      } else if (!err.response) {
        setError("Failed to load allocated hours. Please check your network connection.");
      }
    } finally {
      if (manageLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return; 

    if (user.disciplina_id) {
      setFormData((prev) => ({ ...prev, disciplina_id: user.disciplina_id }));
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const formPromise = (async () => {
          const [clientesRes, disciplinasRes, orcamentosRes, permissionsRes] = await Promise.all([
            api.get('/api/clientes'),
            api.get('/api/disciplinas'),
            api.get('/api/orcamentos'),
            api.get('/api/solicitacoes/retroactive-permission')
          ]);
          setClientes(clientesRes.data);
          const sortedDisciplinas = disciplinasRes.data.sort((a, b) => a.nome.localeCompare(b.nome));
          setDisciplinas(sortedDisciplinas);
          const orcamentosData = orcamentosRes.data;
          if (Array.isArray(orcamentosData.rows)) {
            setOrcamentos(orcamentosData.rows);
          } else if (Array.isArray(orcamentosData)) {
            setOrcamentos(orcamentosData);
          } else if (orcamentosData && Array.isArray(orcamentosData.orcamentos)) {
            setOrcamentos(orcamentosData.orcamentos);
          } else {
            setOrcamentos([]);
            console.error('orcamentos data is not in expected format: ', orcamentosData);
          }
          setRetroactivePermissions(permissionsRes.data);
        })();

        const lastAllocPromise = fetchAllocatedHours(false);

        await Promise.all([formPromise, lastAllocPromise]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data for the form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, fetchAllocatedHours]);

  useEffect(() => {
    calculateHours();
  }, [calculateHours]);

  useEffect(() => {
    const messages = {
      'Presencial': 'Horas de trabalho realizadas no escritório de forma presencial;',
      'Home-office': 'Horas de trabalho realizadas de casa;',
      'Levantamento de campo': 'Horas de trabalho realizadas dentro do cliente;',
      'Viagem': 'Horas de viagem com pernoite, incluindo deslocamento, devem ser lançadas como viagem;'
    };
    setLocalMessage(messages[formData.local] || '');
  }, [formData.local]);

  useEffect(() => {
    if (loading) return;

    let options = [];
    switch (formData.tipo) {
      case 'Administrativo': {
        const adminTaskNames = ['Administrativo', 'ASO', 'BIM', 'Documentação', 'Geral/Estudo', 'Integração', 'Planejamento', 'PPRA', 'Sixa', 'Férias'];
        options = adminTaskNames.map((name) => {
          const cliente = clientes.find((c) => c.nome.toLowerCase() === name.toLowerCase());
          return { id: cliente ? cliente.id : name, nome: name };
        });
        break;
      }
      case 'Orçamento':
        if (Array.isArray(orcamentos)) {
          options = orcamentos.map((o) => ({ id: o.ax_id, nome: o.nome || o.ax_id, descricao: o.descricao, nome_coordenador: o.nome_coordenador }));
        }
        break;
      case 'SEG': {
        const segCliente = clientes.find((c) => c.nome.toLowerCase() === 'seg');
        options = segCliente ? [{ id: segCliente.id, nome: 'SEG' }] : [{ id: 'SEG', nome: 'SEG' }];
        break;
      }
      case 'RH': {
        const rhCliente = clientes.find((c) => c.nome.toLowerCase() === 'rh');
        options = rhCliente ? [{ id: rhCliente.id, nome: 'RH' }] : [{ id: 'RH', nome: 'RH' }];
        break;
      }
      case 'Projeto':
      default: {
        let projectOptions = [];
        // Nomes de clientes que não são considerados projetos e têm seu próprio tipo de alocação.
        const nonProjectClientNames = ['Administrativo', 'ASO', 'BIM', 'Documentação', 'Geral/Estudo', 'Integração', 'Planejamento', 'PPRA', 'Sixa', 'Férias', 'SEG', 'RH'];
        
        // Filtra a lista de clientes para incluir apenas projetos.
        const projectClients = clientes.filter(
          (c) => !nonProjectClientNames.some(name => name.toLowerCase() === c.nome.toLowerCase())
        );

        if (Array.isArray(orcamentos)) {
          // Mapeia orçamentos para o formato de opção, usando o nome do orçamento ou o ax_id como fallback.
          projectOptions = orcamentos.map((o) => ({ id: o.ax_id, nome: o.nome || o.ax_id, descricao: o.descricao, nome_coordenador: o.nome_coordenador }));
        }
        options = [...projectClients, ...projectOptions];
        break;
      }
    }

    const uniqueOptions = Array.from(new Map(options.map((item) => [item.id, item])).values());
    setNomeOptions(uniqueOptions);
  }, [formData.tipo, clientes, orcamentos, loading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    if (name === 'tipo') {
        newFormData.cliente_id = '';
        setDescricao('');
        setCoordenador('');
    }
    setFormData(newFormData);
  };

  const handleLunchChange = (event) => {
    setHasLunchBreak(event.target.checked);
  };

  const handleEdit = (allocation) => {
    setEditMode(true);
    setCurrentAllocationId(allocation.id);
    setFormData({
      date: allocation.date ? allocation.date.split('T')[0] : '',
      local: allocation.local,
      tipo: allocation.tipo,
      cliente_id: allocation.cliente_id || '',
      disciplina_id: allocation.disciplina_id || '',
      horas: allocation.horas,
      startTime: allocation.startTime,
      endTime: allocation.endTime,
      comments: allocation.comments || ''
    });
    setHasLunchBreak(allocation.hasLunchBreak || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // No empty hours
    if (!formData.horas || parseFloat(formData.horas) <= 0) {
      setError('As horas alocadas não podem ser zero ou vazias.');
      return;
    }

    // Allocate only in the current week
    const isDateInCurrentWeek = (dateString) => {
        const date = new Date(dateString.replace(/-/g, '/'));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayOfWeek = today.getDay();
        const firstDayOfWeek = new Date(today);
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        firstDayOfWeek.setDate(diff);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

        if (date >= firstDayOfWeek && date <= lastDayOfWeek) {
            return true;
        }

        // se for segunda, permite alocar para a semana passada
        if (dayOfWeek === 1) {
            const firstDayOfLastWeek = new Date(firstDayOfWeek);
            firstDayOfLastWeek.setDate(firstDayOfWeek.getDate() - 7);
            const lastDayOfLastWeek = new Date(lastDayOfWeek);
            lastDayOfLastWeek.setDate(lastDayOfWeek.getDate() - 7);
            if (date >= firstDayOfLastWeek && date <= lastDayOfLastWeek) {
                return true;
            }
        }

        return false;
    };

    const isDateInPermittedRange = (dateString) => {
      if (retroactivePermissions.length === 0) {
        return false;
      }
      const date = new Date(dateString.replace(/-/g, '/'));
      date.setHours(0, 0, 0, 0);

      return retroactivePermissions.some(permission => {
        const startDate = parseISO(permission.data_inicio);
        const endDate = parseISO(permission.data_fim);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return date >= startDate && date <= endDate;
      });
    };

    const isDateAllowed = isDateInCurrentWeek(formData.date) || isDateInPermittedRange(formData.date);
    if (!isDateAllowed) {
      setError('Atenção! Apenas alocações para a semana atual são permitidas. Às segundas-feiras, também é permitido alocar horas para a semana anterior, ou dentro de um período retroativo aprovado (válido por 24h).');
      return;
    }

    if (!formData.cliente_id || !formData.disciplina_id) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validation for 'Administrativo'
    const selectedNome = nomeOptions.find(o => o.id === formData.cliente_id)?.nome;
    if (formData.tipo === 'Administrativo' && selectedNome === 'Administrativo' && (!formData.comments || formData.comments.trim() === '')) {
      setError('Por favor, justifique nos comentários!');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const submissionData = {
        ...formData,
        usuario_id: user.usuario_id
      };

      const selectedNome = nomeOptions.find(o => o.id === formData.cliente_id)?.nome;
      if (formData.tipo === 'Administrativo' && selectedNome === 'Administrativo') {
        submissionData.nome = 'Administrativo';
      }

      if (editMode) {
        await api.put(`/api/alocacoes/${currentAllocationId}`, submissionData);
        setSuccess('Alocação atualizada com sucesso!');
      } else {
        await api.post('/api/alocacoes', submissionData);
        setSuccess('Horas Cadastradas com Sucesso!');
      }

      setFormData({
        date: new Date().toISOString().split('T')[0],
        local: 'Presencial',
        tipo: 'Projeto',
        cliente_id: '',
        disciplina_id: '',
        horas: '',
        startTime: '',
        endTime: '',
        comments: ''
      });
      setHasLunchBreak(false);
      setEditMode(false);
      setCurrentAllocationId(null);
      fetchAllocatedHours(); // Refresh the list after submit/update
    } catch (err) {
      console.error("Failed to submit form:", err);
      setError(err.response?.data?.message || "Failed to submit the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user && user.cargo && user.cargo.toLowerCase() === 'mkt') {
    return (
      <MainCard title="Alocar">
        <Alert severity="error">Você não tem permissão para alocar horas!</Alert>
      </MainCard>
    );
  }

  return (
    <MainCard title="Alocar">
      {console.log('Rendering AlocarHoras. allocatedHours:', allocatedHours)}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      {retroactivePermissions.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Você tem permissão temporária (24h) para lançar horas retroativas nos seguintes períodos:
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            {retroactivePermissions.map((p, i) => (
              <li key={i}>
                {format(parseISO(p.data_inicio), 'dd/MM/yyyy')} a {format(parseISO(p.data_fim), 'dd/MM/yyyy')}
              </li>
            ))}
          </ul>
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data"
                  value={new Date(formData.date.replace(/-/g, '/'))}
                  onChange={(newValue) => {
                    if (newValue) {
                      const year = newValue.getFullYear();
                      const month = String(newValue.getMonth() + 1).padStart(2, '0');
                      const day = String(newValue.getDate()).padStart(2, '0');
                      const formattedDate = `${year}-${month}-${day}`;
                      handleChange({
                        target: {
                          name: 'date',
                          value: formattedDate
                        }
                      });
                    }
                  }}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  name="local"
                  label="Local"
                  value={formData.local}
                  onChange={handleChange}
                  helperText={localMessage}
                  FormHelperTextProps={{
                    sx: { color: 'white'}
                  }}
                >
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Home-office">Home-office</MenuItem>
                  <MenuItem value="Levantamento de campo">Levantamento de campo</MenuItem>
                   <MenuItem value="Viagem">Viagem</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  name="tipo"
                  label="Tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <MenuItem value="Projeto">Projeto</MenuItem>
                  <MenuItem value="Administrativo">Administrativo</MenuItem>
                  <MenuItem value="RH">RH</MenuItem>
                  <MenuItem value="Orçamento">Orçamento</MenuItem>
                  <MenuItem value="SEG">SEG</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={nomeOptions}
                  getOptionLabel={(option) => option.nome || ''}
                  value={nomeOptions.find(option => option.id === formData.cliente_id) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: 'cliente_id',
                        value: newValue ? newValue.id : ''
                      }
                    });
                    if (newValue && (formData.tipo === 'Projeto' || formData.tipo === 'Orçamento')) {
                        const selectedOption = nomeOptions.find(option => option.id === newValue.id);
                        if (selectedOption) {
                            setDescricao(selectedOption.descricao || '');
                            setCoordenador(selectedOption.nome_coordenador || '');
                        }
                    } else {
                        setDescricao('');
                        setCoordenador('');
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Nome"
                    />
                  )}
                />
              </Grid>

              {(formData.tipo === 'Projeto' || formData.tipo === 'Orçamento') && formData.cliente_id && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="descricao"
                      label="Descrição"
                      value={descricao}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="coordenador"
                      label="Coordenador do Projeto"
                      value={coordenador}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  name="disciplina_id"
                  label="Disciplina"
                  value={formData.disciplina_id}
                  onChange={handleChange}
                >
                  {disciplinas.map((disciplina) => (
                    <MenuItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="horas"
                  label="Horas (Preenchido automaticamente)"
                  type="number"
                  value={formData.horas}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="startTime"
                  label="Horário Inicial"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="endTime"
                  label="Horário Final"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={hasLunchBreak} onChange={handleLunchChange} name="hasLunchBreak" />}
                  label="Intervalo"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="comments"
                  label="Comentários"
                  value={formData.comments}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                  {submitting ? <CircularProgress size={24} /> : (editMode ? 'Atualizar' : 'Cadastrar')}
                </Button>
                {editMode && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditMode(false);
                      setCurrentAllocationId(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        local: 'Presencial',
                        tipo: 'Projeto',
                        cliente_id: '',
                        disciplina_id: '',
                        horas: '',
                        startTime: '',
                        endTime: '',
                        comments: ''
                      });
                      setHasLunchBreak(false);
                    }}
                    sx={{ ml: 2 }}
                  >
                    Cancelar Edição
                  </Button>
                )}
              </Grid>
            </Grid>
          </LocalizationProvider>
        </form>
      </Paper>
      <MainCard title="Último Lançamento" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          {allocatedHours.length === 0 ? (
            <Typography>Nenhuma alocação encontrada.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'black' }}>
                    <TableCell sx={{ textAlign: 'center', color: 'white' }}>Data</TableCell>
                    <TableCell sx={{ textAlign: 'center', color: 'white' }}>Tipo</TableCell>
                    <TableCell sx={{ textAlign: 'center', color: 'white' }}>Nome</TableCell>
                    <TableCell sx={{ textAlign: 'center', color: 'white' }}>Disciplina</TableCell>
                    <TableCell sx={{ textAlign: 'center', color: 'white' }}>Horas</TableCell>
                    <TableCell sx={{ textAlign: 'center', color: 'white' }}>Editar</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log('allocatedHours array:', allocatedHours)}
                  {allocatedHours.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {console.log('allocation.data:', allocation.data)}
                        {allocation.data ? format(parseISO(allocation.data), 'dd/MM/yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{allocation.tipo}</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                        {allocation.tipo === 'Administrativo' && allocation.cliente_nome && allocation.cliente_nome.startsWith('Administrativo') && allocation.cliente_nome !== 'Administrativo'
                          ? 'Administrativo'
                          : allocation.cliente_nome}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{disciplinas.find(d => d.id === allocation.disciplina_id)?.nome || 'N/A'}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{allocation.horas}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <EditButton onClick={() => handleEdit(allocation)} />
                      </TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </MainCard>
    </MainCard>
  );
};

export default AlocarHoras;