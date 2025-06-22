import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/reportsService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import DatePicker from '../components/ui/DatePicker';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px] mb-[23px]">
        <div className="flex items-center justify-between mb-30px">
            <div>
                <h1 className="text-[24px] font-semibold text-gray-900 leading-[32px]">Отчеты</h1>
                <p className="text-[14px] text-[#727272]">Отчеты сотрудников за выбранный период</p>
            </div>
            <button onClick={handleExport} disabled={isLoading || reports.length === 0}
                className="px-[16px] py-[10px] bg-[#101010] text-white text-[14px] font-semibold rounded-[30px] hover:bg-gray-800 transition-colors disabled:opacity-50">
            Экспорт в Excel
            </button>
        </div>
        <div className="flex gap-4 items-end">
          <DatePicker
            label="Начальная дата"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <DatePicker
            label="Конечная дата"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px]">
        <h3 className="text-[20px] font-semibold text-gray-900 mb-[20px]">Все отчеты</h3>
        {isLoading ? (
          <div className="text-center py-8 text-[#727272]">Загрузка...</div>
        ) : reports.length > 0 ? (
          <div className="flex flex-col gap-[3px]">
             <div className="grid grid-cols-3 gap-[22px] px-[22px] py-[10px] text-[12px] text-[#727272] font-semibold uppercase">
                <div>Сотрудник</div>
                <div>Отчет</div>
                <div>Дата и время</div>
            </div>
            {reports.map((report) => (
               <div key={report.id} className="bg-[#f8f8f8] rounded-[16px] p-[22px] grid grid-cols-3 gap-[22px] items-center text-[14px] font-medium">
                <div>{report.employeeName}</div>
                <div className="whitespace-normal break-words">{report.content}</div>
                <div>{format(new Date(report.createdAt), 'dd MMM, HH:mm', { locale: ru })}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f8f8f8] rounded-[16px] p-[22px] text-center text-[#727272]">
            <p>За выбранный период отчетов не найдено.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports; 