import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { format, parseISO } from 'date-fns';
import { getGridDateOperators } from '@mui/x-data-grid';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // para a visão de semana/dia
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Select, MenuItem, FormControl, InputLabel, Box, IconButton, Typography } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import CustomPage from '../../components/pages/CustomPage';
import CreateButton from '../../components/buttons/CreateButton';
import { api } from 'services/api';

const ProjetosAlocados = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('table');
  const [dailyTotals, setDailyTotals] = useState({});
  // --- 1. NOVO ESTADO PARA GUARDAR OS EVENTOS DO CALENDÁRIO ---
  const [calendarEvents, setCalendarEvents] = useState([]);

  const calendarStyles = {
    '.fc': {
      '--fc-border-color': '#1A4A68',
      '--fc-today-bg-color': 'rgba(234, 234, 234, 0.1)',
      '--fc-page-bg-color': '#0B2738',
      '--fc-neutral-bg-color': '#0B2738',
      '--fc-event-bg-color': '#266E99', // Cor de fundo do evento
      '--fc-event-border-color': '#1E587A', // Cor da borda do evento
      fontFamily: 'inherit',
      color: '#EAEAEA',
    },
    '.fc-header-toolbar': { color: '#EAEAEA' },
    '.fc-toolbar-title': { color: '#EAEAEA', fontSize: '1.5em' },
    '.fc-button': {
      backgroundColor: '#051A27',
      color: '#EAEAEA',
      border: '1px solid #1A4A68',
      textTransform: 'none',
      '&:hover': { backgroundColor: '#1E587A' },
    },
    '.fc-button-primary:not(:disabled).fc-button-active': {
      backgroundColor: '#266E99',
      borderColor: '#266E99',
    },
    '.fc-col-header-cell-cushion': { color: '#EAEAEA', fontWeight: 500 },
    '.fc-daygrid-day-number': { color: '#B0B0B0', position: 'relative', zIndex: 2 },
    '.fc-daygrid-day': {
      position: 'relative',
    },
    '.daily-summary': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      zIndex: 1,
    },
    '.summary-hours': {
      display: 'block',
      fontSize: '2em',
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadow: '0 0 6px rgba(0, 0, 0, 0.7)',
    },
    '.summary-text': {
      display: 'block',
      fontSize: '0.8em',
      color: '#E0E0E0',
    },
  };

  useEffect(() => {
    const fetchAllocationsForCalendar = async () => {
      try {
        const response = await api.get('/api/alocacoes/all-allocated-projects-hours');
        const data = response.data.rows || response.data;

        // --- 2. LÓGICA ATUALIZADA PARA PROCESSAR OS DADOS ---
        const totals = {};
        const events = data.map(alloc => {
          const dateKey = alloc.data.substring(0, 10);
          const hours = parseFloat(alloc.horas) || 0;
          
          // lógica de totalização para a visão mensal
          if (totals[dateKey]) {
            totals[dateKey] += hours;
          } else {
            totals[dateKey] = hours;
          }

          // Cria o objeto de evento para o FullCalendar
          return {
            title: `${alloc.cliente_nome || 'Alocação'} (${alloc.horas}h)`,
            start: `${dateKey}T${alloc.horario_inicial}`,
            end: `${dateKey}T${alloc.horario_final}`,
            // adicionar mais dados aqui se precisar
            extendedProps: {
                id: alloc.id,
                disciplina: alloc.disciplina_nome,
                cliente: alloc.cliente_nome
            }
          };
        });

        setDailyTotals(totals);
        setCalendarEvents(events); // Atualiza o estado dos eventos
      } catch (error) {
        console.error('Falha ao buscar alocações para o calendário:', error);
      }
    };
    fetchAllocationsForCalendar();
  }, []);

 const handleDayCellMount = (arg) => {
    // Só adiciona o resumo na visão de mês para não poluir a visão de semana
    if (arg.view.type === 'dayGridMonth') {
        // Cria a chave 'YYYY-MM-DD' manualmente para evitar problemas de fuso horário com toISOString()
        const date = arg.date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        const total = dailyTotals[dateKey];

        if (total > 0) {
            const summaryEl = document.createElement('div');
            summaryEl.className = 'daily-summary';

            // Arredonda o total para evitar casas decimais longas
            const roundedTotal = Math.round(total * 100) / 100;
            const timeString = `${roundedTotal}h`.replace('.', ','); // Opcional: formata para vírgula

            summaryEl.innerHTML = `<span class="summary-hours">${timeString}</span>`;
            arg.el.appendChild(summaryEl);
        }
    }
 };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta alocação?')) {
      try {
        await api.delete(`/api/alocacoes/${id}`);
        window.location.reload();
      } catch (error) {
        console.error('Falha ao deletar a alocação:', error);
        alert('Falha ao deletar a alocação.');
      }
    }
  };

  const handleCadastro = () => {
    navigate('/cadastro_alocacoes');
  };

  let columns = [
    {
      field: 'data',
      headerName: 'Data',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      type: 'date',
      valueGetter: (value) => (value ? parseISO(value) : null),
      valueFormatter: (value) => (value ? format(value, 'dd/MM/yyyy') : 'N/A'),
      filterOperators: getGridDateOperators(true).map((operator) => ({
          ...operator,
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) { return null; }
            return (cellValue) => {
              if (!cellValue) return false;
              const cellDate = new Date(cellValue);
              const filterDate = new Date(filterItem.value);
              const utcCellDate = new Date(Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()));
              const utcFilterDate = new Date(Date.UTC(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()));
              utcCellDate.setHours(0, 0, 0, 0);
              utcFilterDate.setHours(0, 0, 0, 0);
              switch (operator.value) {
                case 'is': return utcCellDate.getTime() === utcFilterDate.getTime();
                case 'not': return utcCellDate.getTime() !== utcFilterDate.getTime();
                case 'after': return utcCellDate > utcFilterDate;
                case 'onOrAfter': return utcCellDate >= utcFilterDate;
                case 'before': return utcCellDate < utcFilterDate;
                case 'onOrBefore': return utcCellDate <= utcFilterDate;
                case 'isEmpty': return !cellValue;
                case 'isNotEmpty': return !!cellValue;
                default: return true;
              }
            };
          }
      }))
    },
    { field: 'local', headerName: 'Local', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'tipo', headerName: 'Tipo', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'cliente_nome', headerName: 'Cliente', flex: 1, headerAlign: 'center', align: 'center', valueGetter: (value, row) => (row.tipo === 'Administrativo' && value && value.startsWith('Administrativo') && value !== 'Administrativo' ? 'Administrativo' : value) },
    { field: 'disciplina_nome', headerName: 'Disciplina', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'horas', headerName: 'Horas', flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: 'usuario_nome', headerName: 'Usuário', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'deletar', headerName: 'Deletar', flex: 0.5, headerAlign: 'center', align: 'center', sortable: false, renderCell: (params) => (<IconButton color="success" aria-label="deletar" onClick={() => handleDelete(params.row.id)}><IconTrash size="1.25rem" /></IconButton>)}
  ];

  if (user && user.role === 'usuario') {
    columns = columns.filter((column) => column.field !== 'usuario_nome');
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* ... cabeçalho com dropdown de visualização ... */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            Projetos Alocados
          </Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="view-mode-label">Visualização</InputLabel>
            <Select
              labelId="view-mode-label"
              id="view-mode-select"
              value={viewMode}
              label="Visualização"
              onChange={(e) => setViewMode(e.target.value)}
            >
              <MenuItem value="table">Tabela</MenuItem>
              <MenuItem value="calendar">Calendário</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <CreateButton onClick={handleCadastro} />
      </Box>

      {viewMode === 'table' ? (
        <CustomPage
          endpoint="/api/alocacoes/all-allocated-projects-hours"
          deleteEndpoint="/api/alocacoes"
          columns={columns}
          queryParams={{}}
        />
      ) : (
        <Box sx={{ ...calendarStyles, height: '65vh' }}>
          <FullCalendar
            height="95%"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek', 
            }}
            // --- 3. PASSANDO OS EVENTOS PARA O CALENDÁRIO ---
            events={calendarEvents}
            locales={[ptBrLocale]}
            locale="pt-br"
            dayCellDidMount={handleDayCellMount} // Para o resumo na visão mensal
            eventContent={(arg) => {
              if (arg.view.type === 'dayGridMonth') {
                return null; // Oculta eventos individuais na visão mensal
              }
              return true; // Usa renderização padrão para outras visões
            }}
            // Garante que o evento ocupe o dia todo se não tiver hora
            allDaySlot={false} 
            // Define o horário de funcionamento para focar a visão
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjetosAlocados;