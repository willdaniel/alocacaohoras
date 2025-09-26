import { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  Box,
  Paper,
  useTheme,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel
} from '@mui/material';
import { IconCake, IconCalendarDue, IconFileExport, IconUsers, IconLicense, IconBuildingSkyscraper, IconClipboardList, IconPlus, IconTrash, IconCheck, IconChartLine, IconClockHour4, IconGraph, IconReceipt, IconReceiptRefund, IconReceiptTax, IconChecks, IconFileInvoice, IconFileImport, IconFileAlert, IconBrandGraphql, IconChartInfographic, IconGraphFilled, IconSun } from '@tabler/icons-react';


import { api } from 'services/api.js';
import MainCard from 'ui-component/cards/MainCard';
import TopProjectsCard from './TopProjectsCard';
import BeautyGraphModal from './BeautyGraphModal';

import KPICard from './KPICard';
import TasksCard from './TasksCard';
import ReportCard from './ReportCard';
import NfsCard from './NfsCard';
import NewsCard from './NewsCard'; // Import the new component
import { formatDate } from '../../utils/date.js';



// ==============================|| DASHBOARD PAGE ||============================== //

const DashboardPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  console.log('User object in DashboardPage:', user);
  const [dashboardData, setDashboardData] = useState(null);
  const [totalMonthlyHours, setTotalMonthlyHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [showBeautyGraphModal, setShowBeautyGraphModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleNfsUpload = async (file) => {
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    const formData = new FormData();
    formData.append('nfs', file);
    formData.append('nome_colaborador', user.nome);

    try {
      await api.post('/api/nfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess('NF enviado com sucesso!');
    } catch (err) {
      console.error('Falha no upload do NF:', err);
      setUploadError('Não foi possível fazer o upload do NF. Verifique o arquivo ou tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleGerarRelatorio = async (format) => {
    setIsReportLoading(true);
    try {
      const params = new URLSearchParams({ format });

      if (user?.role) {
        params.append('scope', user.role);
      }

      const response = await api.get(`/api/relatorios/alocacoes?${params.toString()}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `relatorio_alocacoes.${format}`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Falha ao gerar o relatório:', err);
      setError('Não foi possível gerar o relatório.');
    } finally {
      setIsReportLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/vencimentos');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalMonthlyHours = async () => {
      try {
        const response = await api.get('/api/dashboard/totalMonthlyHours');
        setTotalMonthlyHours(response.data.totalHours);
      } catch (err) {
        console.error('Erro ao buscar total de horas do mês:', err);
      }
    };

    fetchDashboardData();
    fetchTotalMonthlyHours();
  }, []);

  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    }
    if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  };

  return (
    <MainCard 
      title="Dashboard Principal"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard 
            title="Total de Horas do Mês" 
            value={totalMonthlyHours} 
            icon={<IconClockHour4 />} 
            color={theme.palette.background.paper} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <NfsCard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard 
            title={`${getGreeting()},`}
            value={`${user?.nome || ''}!`}
            icon={<IconSun />} 
            color={theme.palette.background.paper} 
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard onGenerate={handleGerarRelatorio} isLoading={isReportLoading} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TasksCard />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TopProjectsCard />
        </Grid>

        {dashboardData?.aniversariantes &&
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, minHeight: '360px' }}>
                    <Box display="flex" alignItems="center" mb={1.5}>
                        <IconCake color={theme.palette.secondary.main} />
                        <Typography variant="h5" sx={{ ml: 1 }}>{`Aniversariantes do mês de ${new Date().toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleString('pt-BR', { month: 'long' }).slice(1)}`}</Typography>
                    </Box>
                    <Divider />
                    <List dense sx={{ maxHeight: 280, overflow: 'auto', pr: 1 }}>
                        {dashboardData.aniversariantes.length > 0 ? (
                            dashboardData.aniversariantes.map((colaborador) => (
                                <ListItem key={colaborador.id} disablePadding>
                                    <ListItemText
                                        primary={colaborador.nome}
                                        secondary={(() => {
                                            const dateOfBirth = new Date(colaborador.data_nascimento);
                                            const dayOfMonth = String(dateOfBirth.getUTCDate()).padStart(2, '0');
                                            const dayOfWeek = dateOfBirth.toLocaleString('pt-BR', { weekday: 'long' });
                                            return `Dia do mês: ${dayOfMonth}, ${dayOfWeek}`;
                                        })()}
                                    />
                                </ListItem>
                            ))
                        ) : ( <ListItem><ListItemText primary="Nenhum aniversariante este mês." /></ListItem> )}
                    </List>
                </Paper>
            </Grid>
        }
        
        

      <Grid item xs={12} md={6}>
        <NewsCard />
      </Grid>

      </Grid>
      <BeautyGraphModal open={showBeautyGraphModal} handleClose={() => setShowBeautyGraphModal(false)} />
    </MainCard>
  );
};

export default DashboardPage;