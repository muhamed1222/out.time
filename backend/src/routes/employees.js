const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const { authenticateToken, checkEmployeeAccess } = require('../middleware/auth');
const Employee = require('../models/Employee');
const TimeRecord = require('../models/TimeRecord');
const Report = require('../models/Report');

const router = express.Router();

// Защищенные маршруты
router.use(authenticateToken);

// Получение списка сотрудников компании
router.get('/', EmployeeController.getEmployees);

// Создание пригласительной ссылки
router.post('/invite', 
  EmployeeController.validateInvite, 
  EmployeeController.createInvite
);

// Получение детальной информации о сотруднике
router.get('/:id', 
  checkEmployeeAccess, 
  EmployeeController.getEmployeeDetails
);

// Обновление данных сотрудника
router.put('/:id', 
  checkEmployeeAccess, 
  EmployeeController.updateEmployee
);

// Деактивация сотрудника
router.delete('/:id', 
  checkEmployeeAccess, 
  EmployeeController.deactivateEmployee
);

module.exports = router; 