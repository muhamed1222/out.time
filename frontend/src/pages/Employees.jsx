import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
  DataTable,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  WorkStatusBadge,
  LoadingSkeleton
} from '../components/ui';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(true);

  // Загрузка списка сотрудников
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsEmployeesLoading(true);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data.employees);
    } catch (error) {
      toast.error('Не удалось загрузить список сотрудников');
    } finally {
      setIsEmployeesLoading(false);
    }
  };

  // Создание приглашения
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!employeeName.trim()) {
      toast.error('Введите имя сотрудника');
      return;
    }

    setIsLoading(true);
    try {
      const { inviteLink } = await employeeService.createInvite(employeeName.trim());
      setInviteLink(inviteLink);
      toast.success('Приглашение создано');
      loadEmployees();
    } catch (error) {
      toast.error('Не удалось создать приглашение');
    } finally {
      setIsLoading(false);
    }
  };

  // Копирование ссылки
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Ссылка скопирована');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmployeeName('');
    setInviteLink('');
  };

  // Конфигурация столбцов для таблицы
  const columns = [
    {
      key: 'name',
      title: 'Имя сотрудника',
      render: (value, employee) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary-600 font-semibold text-sm">
              {value?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'todayStatus',
      title: 'Статус',
      render: (status) => <WorkStatusBadge status={status} />,
      sortable: false
    },
    {
      key: 'workTime',
      title: 'Время работы',
      render: (_, employee) => {
        if (!employee.todayStartTime) {
          return <span className="text-gray-400">—</span>;
        }
        const start = format(new Date(employee.todayStartTime), 'HH:mm');
        const end = employee.todayEndTime 
          ? format(new Date(employee.todayEndTime), 'HH:mm')
          : 'сейчас';
    return (
          <span className="font-mono text-sm">
            {start} — {end}
      </span>
        );
      },
      className: 'text-gray-600',
      sortable: false
    },
    {
      key: 'actions',
      title: 'Действия',
      render: (_, employee) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = `/employees/${employee.id}`}
        >
          Подробнее
        </Button>
      ),
      sortable: false
    }
  ];

  // Обработчик клика по строке
  const handleRowClick = (employee) => {
    window.location.href = `/employees/${employee.id}`;
  };

  return (
    <div className="space-content">
      {/* Заголовок */}
      <Card className="fade-in">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-heading">Сотрудники</h1>
            <p className="text-caption">Управление сотрудниками компании</p>
        </div>
          <Button
            variant="primary"
          onClick={() => setIsModalOpen(true)}
            className="shrink-0"
        >
          + Пригласить сотрудника
          </Button>
        </div>
      </Card>

      {/* Таблица сотрудников */}
      <Card className="fade-in" style={{ animationDelay: '0.1s' }}>
        {isEmployeesLoading ? (
          <CardContent>
            <LoadingSkeleton type="table" rows={5} columns={4} />
          </CardContent>
        ) : (
          <DataTable
            data={employees}
            columns={columns}
            onRowClick={handleRowClick}
            emptyMessage="Пока нет сотрудников. Пригласите первого!"
            searchable={true}
            sortable={true}
            paginated={true}
            itemsPerPage={10}
          />
      )}
      </Card>

      {/* Модальное окно приглашения */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
          <Card className="w-full max-w-md mx-4 scale-in">
            <CardHeader>
              <CardTitle>Пригласить сотрудника</CardTitle>
            </CardHeader>
            <CardContent>
            {!inviteLink ? (
                <form onSubmit={handleInvite} className="space-form">
                  <Input
                    label="Имя сотрудника"
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Введите имя"
                    required
                    autoFocus
                  />
                  
                  <div className="flex justify-end space-items">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={closeModal}
                    >
                    Отмена
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      loading={isLoading}
                      disabled={!employeeName.trim()}
                    >
                      Создать приглашение
                    </Button>
                </div>
              </form>
            ) : (
                <div className="space-form">
              <div>
                    <label className="text-caption block mb-2">
                  Отправьте эту ссылку сотруднику:
                    </label>
                    <div className="flex items-center space-items">
                      <Input
                    type="text"
                    value={inviteLink}
                    readOnly
                        className="flex-1"
                  />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyInviteLink}
                        className="shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </Button>
                    </div>
                </div>
                  
                <div className="flex justify-end">
                    <Button 
                      variant="primary" 
                      onClick={closeModal}
                    >
                      Готово
                    </Button>
                </div>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Employees; 