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
  EmptyState,
  Badge,
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
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-48 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-64 rounded"></div>
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
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-40 rounded"></div>
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
          <h1 className="text-heading dark:text-white">Дашборд</h1>
          <p className="text-caption dark:text-gray-400">Общая статистика по компании</p>
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
          <CardTitle className="dark:text-white">Последние отчеты</CardTitle>
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
                      <h4 className="text-subheading text-gray-900 dark:text-white">
                        {report.employeeName}
                      </h4>
                      <p className="text-body mt-1 dark:text-gray-300">
                        {report.content}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-caption dark:text-gray-400">
                        {format(new Date(report.date), 'dd.MM.yyyy')}
                      </p>
                      <p className="text-caption text-gray-400 dark:text-gray-500">
                        {format(new Date(report.createdAt), 'HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Нет отчетов за сегодня"
              description="Отчеты будут отображаться здесь по мере их поступления"
              icon="📊"
              action={{
                label: "Посмотреть все отчеты",
                href: "/reports"
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Дополнительная статистика (если есть данные) */}
      {dashboardData.employeeStats?.length > 0 && (
        <Card className="fade-in" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="dark:text-white">Топ активных сотрудников</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.employeeStats.slice(0, 3).map((employee, index) => (
                <Card 
                  key={employee.id}
                  variant="flat"
                  className="hover-lift"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-semibold">
                      {employee.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <h5 className="text-subheading text-gray-900 dark:text-white">
                      {employee.name}
                    </h5>
                    <p className="text-caption dark:text-gray-400">
                      {employee.totalReports} отчетов
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-2"
                    >
                      #{index + 1}
                    </Badge>
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