import dashboardService from '../services/dashboardService.js';
import AlocacoesService from '../services/alocacoesService.js';
import db from '../repositories/db.js';


const getDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchDashboardData();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in dashboardController:', error.message);
    next(error);
  }
};

const getTotalMonthlyHours = async (req, res, next) => {
  try {
    const totalHours = await AlocacoesService.getTotalMonthlyHours(req.user);
    res.status(200).json({ totalHours });
  } catch (error) {
    console.error('Error in getTotalMonthlyHours controller:', error.message);
    next(error);
  }
};

export default { getDashboardData, getTotalMonthlyHours };