import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  StatsCard, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  LoadingSkeleton,
  statsColorSchemes,
  statsIcons
} from '../components/ui';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      totalEmployees: 0,
      workingToday: 0,
      sickToday: 0,
      vacationToday: 0,
      reportsToday: 0,
      averageWorkHours: '0.0'
    },
    recentReports: [],
    employeeStats: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      toast.error('Не удалось загрузить данные дашборда');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-content">
        {/* Заголовок страницы */}
        <Card>
          <div className="mb-6">
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-64 rounded"></div>
          </div>
        </Card>

        {/* Скелетоны статистических карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <LoadingSkeleton key={i} type="stats" />
          ))}
        </div>

        {/* Скелетон последних отчетов */}
        <Card>
          <CardHeader>
            <div className="animate-pulse bg-gray-200 h-6 w-40 rounded"></div>
          </CardHeader>
          <CardContent>
            <LoadingSkeleton type="list" items={3} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { todayStats } = dashboardData;

  return (
    <div className="space-content">
      {/* Заголовок страницы */}
      <Card className="fade-in">
        <div className="mb-6">
          <h1 className="text-heading">Дашборд</h1>
          <p className="text-caption">Общая статистика по компании</p>
        </div>
      </Card>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Работают сегодня */}
        <StatsCard
          icon={statsIcons.users}
          title="Работают сегодня"
          value={`${todayStats.workingToday}/${todayStats.totalEmployees}`}
          color={statsColorSchemes.success}
          trend={todayStats.workingToday > 0 ? 
            Math.round((todayStats.workingToday / todayStats.totalEmployees) * 100) - 80 : 
            null
          }
          className="fade-in"
          style={{ animationDelay: '0.1s' }}
        />

        {/* Отчеты сегодня */}
        <StatsCard
          icon={statsIcons.reports}
          title="Отчеты сегодня"
          value={todayStats.reportsToday}
          color={statsColorSchemes.blue}
          trend={todayStats.reportsToday > 5 ? 15 : todayStats.reportsToday > 2 ? 5 : -10}
          className="fade-in"
          style={{ animationDelay: '0.2s' }}
        />

        {/* Средняя продолжительность */}
        <StatsCard
          icon={statsIcons.clock}
          title="Средняя продолжительность"
          value={`${todayStats.averageWorkHours}ч`}
          subtitle="рабочего дня"
          color={statsColorSchemes.cyan}
          trend={parseFloat(todayStats.averageWorkHours) > 8 ? 8 : -5}
          className="fade-in"
          style={{ animationDelay: '0.3s' }}
        />

        {/* Отсутствуют */}
        <StatsCard
          icon={statsIcons.absent}
          title="Отсутствуют на работе"
          value={todayStats.sickToday + todayStats.vacationToday}
          subtitle={`больничных: ${todayStats.sickToday}, отпусков: ${todayStats.vacationToday}`}
          color={statsColorSchemes.warning}
          trend={todayStats.sickToday + todayStats.vacationToday > 2 ? 25 : -10}
          className="fade-in"
          style={{ animationDelay: '0.4s' }}
        />
      </div>

      {/* Последние отчеты */}
      <Card className="fade-in" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle>Последние отчеты</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recentReports.length > 0 ? (
            <div className="space-items">
              {dashboardData.recentReports.map((report, index) => (
                <Card 
                  key={report.id} 
                  variant="flat" 
                  className="hover-lift"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-subheading text-gray-900">
                        {report.employeeName}
                      </h4>
                      <p className="text-body mt-1">
                        {report.content}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-caption">
                        {format(new Date(report.date), 'dd.MM.yyyy')}
                      </p>
                      <p className="text-caption text-gray-400">
                        {format(new Date(report.createdAt), 'HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                {statsIcons.reports}
              </div>
              <p className="text-caption">Нет отчетов за сегодня</p>
              <p className="text-caption text-gray-400 mt-1">
                Отчеты будут отображаться здесь по мере их поступления
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Дополнительная статистика (если есть данные) */}
      {dashboardData.employeeStats?.length > 0 && (
        <Card className="fade-in" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle>Топ активных сотрудников</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.employeeStats.slice(0, 3).map((employee, index) => (
                <Card 
                  key={employee.id}
                  variant="flat"
                  className="text-center hover-scale"
                >
                  <div className="p-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-600 font-semibold text-lg">
                        {employee.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <h4 className="text-subheading mb-1">{employee.name}</h4>
                    <p className="text-caption">
                      {employee.reportsCount} отчетов
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard; 