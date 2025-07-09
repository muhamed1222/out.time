import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/reportsService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  DataTable,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  LoadingSkeleton,
  Badge
} from '../components/ui';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await reportsService.getReports(filters);
      setReports(data.reports);
    } catch (error) {
      toast.error('Не удалось загрузить отчеты');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await reportsService.exportReports(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${filters.startDate}_${filters.endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Отчет успешно экспортирован');
    } catch (error) {
      toast.error('Не удалось экспортировать отчеты');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Конфигурация столбцов для таблицы
  const columns = [
    {
      key: 'employeeName',
      title: 'Сотрудник',
      render: (value) => (
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
      key: 'content',
      title: 'Содержание отчета',
      render: (value) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-700 line-clamp-3">
            {value}
          </p>
        </div>
      ),
      className: 'w-1/2'
    },
    {
      key: 'date',
      title: 'Дата',
      render: (_, report) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {format(new Date(report.date), 'dd MMM yyyy', { locale: ru })}
          </p>
          <p className="text-xs text-gray-500">
            {format(new Date(report.createdAt), 'HH:mm', { locale: ru })}
          </p>
        </div>
      ),
      className: 'text-right'
    },
    {
      key: 'status',
      title: 'Статус',
      render: (_, report) => {
        // Определяем статус на основе времени создания
        const now = new Date();
        const reportDate = new Date(report.date);
        const isToday = reportDate.toDateString() === now.toDateString();
        
        return (
          <Badge 
            variant={isToday ? 'success' : 'gray'}
            size="sm"
          >
            {isToday ? 'Сегодня' : 'Архив'}
          </Badge>
        );
      },
      sortable: false
    }
  ];

  // Подготовка данных для таблицы
  const tableData = reports.map(report => ({
    ...report,
    searchableContent: `${report.employeeName} ${report.content}` // Для поиска
  }));

  return (
    <div className="space-content">
      {/* Заголовок и фильтры */}
      <Card className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-heading">Отчеты</h1>
            <p className="text-caption">Отчеты сотрудников за выбранный период</p>
          </div>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            disabled={isLoading || reports.length === 0}
            className="shrink-0"
          >
            {isExporting ? 'Экспорт...' : 'Экспорт в Excel'}
          </Button>
        </div>

        {/* Фильтры по датам */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Начальная дата"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <Input
            label="Конечная дата"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          
          {/* Статистика */}
          <div className="flex flex-col justify-end">
            <p className="text-caption">Всего отчетов</p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? '...' : reports.length}
            </p>
          </div>
          
          <div className="flex flex-col justify-end">
            <p className="text-caption">За сегодня</p>
            <p className="text-2xl font-bold text-primary-600">
              {isLoading ? '...' : reports.filter(r => {
                const today = new Date().toDateString();
                const reportDate = new Date(r.date).toDateString();
                return today === reportDate;
              }).length}
            </p>
          </div>
        </div>
      </Card>

      {/* Таблица отчетов */}
      <Card className="fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle>Все отчеты</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton type="table" rows={8} columns={4} />
            </div>
          ) : (
            <DataTable
              data={tableData}
              columns={columns}
              searchable={true}
              sortable={true}
              paginated={true}
              itemsPerPage={15}
              emptyMessage="За выбранный период отчетов не найдено"
              className="border-0 shadow-none"
            />
          )}
        </CardContent>
      </Card>

      {/* Дополнительная статистика (если есть данные) */}
      {!isLoading && reports.length > 0 && (
        <Card className="fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Статистика по сотрудникам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                reports.reduce((acc, report) => {
                  acc[report.employeeName] = (acc[report.employeeName] || 0) + 1;
                  return acc;
                }, {})
              )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-semibold text-sm">
                          {name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{name}</span>
                    </div>
                    <Badge variant="primary" size="sm">
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports; 