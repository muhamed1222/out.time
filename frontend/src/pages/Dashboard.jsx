import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import ApiTest from '../components/common/ApiTest';

const WorkingTodayIcon = () => (
    <div className="bg-[#d4ffe3] relative rounded-lg w-[32px] h-[32px] flex items-center justify-center">
        <svg width="20" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1588 1.96745C13.8644 6.62991 6.37997 6.62991 1.9629 1.96745" stroke="url(#grad1)" strokeWidth="3.92629" strokeLinecap="round"/>
            <g transform="translate(0, 8) scale(1, -1)">
                <path d="M18.1588 1.96745C13.8644 6.62991 6.37997 6.62991 1.9629 1.96745" stroke="url(#grad1)" strokeWidth="3.92629" strokeLinecap="round"/>
            </g>
            <defs>
                <linearGradient id="grad1" x1="1.9629" y1="3.83154" x2="18.1588" y2="3.83154" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#B3E0A9"/><stop offset="1" stopColor="#B3E0A9" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const WorkingTodayCard = ({ working, total }) => (
  <div className="bg-[#f8f8f8] rounded-[30px] p-[22px] flex flex-col justify-between h-[165px]">
    <div><WorkingTodayIcon /></div>
    <div>
      <p className="text-[14px] text-gray-500 leading-[20px]">Работают сегодня</p>
      <p className="text-[26px] font-semibold text-black tracking-[-1.04px]">
        {working}/{total}
      </p>
    </div>
  </div>
);

const ReportsTodayIcon = () => (
    <div className="bg-[#e6eeff] relative rounded-lg w-[32px] h-[32px] flex items-center justify-center">
        <svg width="20" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1586 1.96745C13.8642 6.62991 6.37972 6.62991 1.96265 1.96745" stroke="url(#grad2)" strokeWidth="3.92629" strokeLinecap="round"/>
            <g transform="translate(0, 8) scale(1, -1)">
                <path d="M18.1586 1.96745C13.8642 6.62991 6.37972 6.62991 1.96265 1.96745" stroke="url(#grad2)" strokeWidth="3.92629" strokeLinecap="round"/>
            </g>
            <defs>
                <linearGradient id="grad2" x1="1.96265" y1="3.83154" x2="18.1586" y2="3.83154" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5D8FF4" stopOpacity="0.55"/><stop offset="1" stopColor="#5D8FF4" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const ReportsTodayCard = ({ count }) => (
  <div className="bg-[#f8f8f8] rounded-[30px] p-[22px] flex flex-col justify-between h-[165px]">
    <div><ReportsTodayIcon /></div>
    <div>
      <p className="text-[14px] text-gray-500 leading-[20px]">Отчеты сегодня</p>
      <p className="text-[26px] font-semibold text-black tracking-[-1.04px]">
        {count}
      </p>
    </div>
  </div>
);

const AverageDurationIcon = () => (
    <div className="bg-[#d4f3fb] relative rounded-lg w-[32px] h-[32px] flex items-center justify-center">
        <svg width="20" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1586 1.96745C13.8642 6.62991 6.37972 6.62991 1.96265 1.96745" stroke="url(#grad3)" strokeWidth="3.92629" strokeLinecap="round"/>
            <g transform="translate(0, 8) scale(1, -1)">
                <path d="M18.1586 1.96745C13.8642 6.62991 6.37972 6.62991 1.96265 1.96745" stroke="url(#grad3)" strokeWidth="3.92629" strokeLinecap="round"/>
            </g>
            <defs>
                <linearGradient id="grad3" x1="1.96265" y1="3.83154" x2="18.1586" y2="3.83154" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10BBED" stopOpacity="0.55"/><stop offset="1" stopColor="#10BBED" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const AverageDurationCard = ({ duration }) => (
    <div className="bg-[#f8f8f8] rounded-[30px] p-[22px] flex flex-col justify-between h-[165px]">
      <div><AverageDurationIcon /></div>
      <div>
        <p className="text-[14px] text-gray-500 leading-[20px]">Средняя</p>
        <p className="text-[14px] text-gray-500 leading-[20px]">продолжительность</p>
        <p className="text-[26px] font-semibold text-black tracking-[-1.04px]">
          {duration}ч
        </p>
      </div>
    </div>
);

const AbsentIcon = () => (
    <div className="bg-[#ffe9e6] relative rounded-lg w-[32px] h-[32px] flex items-center justify-center">
        <svg width="20" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1586 1.96745C13.8642 6.62991 6.37972 6.62991 1.96265 1.96745" stroke="url(#grad4)" strokeWidth="3.92629" strokeLinecap="round"/>
            <g transform="translate(0, 8) scale(1, -1)">
                <path d="M18.1586 1.96745C13.8642 6.62991 6.37972 6.62991 1.96265 1.96745" stroke="url(#grad4)" strokeWidth="3.92629" strokeLinecap="round"/>
            </g>
            <defs>
                <linearGradient id="grad4" x1="1.96265" y1="3.83154" x2="18.1586" y2="3.83154" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF6C59" stopOpacity="0.55"/><stop offset="1" stopColor="#FF6C59" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const AbsentCard = ({ count }) => (
    <div className="bg-[#f8f8f8] rounded-[30px] p-[22px] flex flex-col justify-between h-[165px]">
      <div><AbsentIcon /></div>
      <div>
        <p className="text-[14px] text-gray-500 leading-[20px]">Отсутствуют на работе</p>
        <p className="text-[26px] font-semibold text-black tracking-[-1.04px]">
          {count}
        </p>
      </div>
    </div>
);

const RecentReportItem = ({ report }) => (
    <div className="bg-[#f8f8f8] rounded-[30px] p-[22px]">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[16px] font-semibold text-black tracking-[-0.32px]">{report.employeeName}</p>
                <p className="text-[14px] text-gray-500">{report.content}</p>
            </div>
            <div className="text-right">
                <p className="text-[14px] text-gray-500">{format(new Date(report.date), 'dd.MM.yyyy')}</p>
                <p className="text-[12px] text-gray-500">{format(new Date(report.createdAt), 'HH:mm:ss')}</p>
            </div>
        </div>
    </div>
);

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Компонент для отладки API */}
      <ApiTest />
      
      <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px] mb-[23px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 leading-[32px]">Дашборд</h1>
          <p className="text-[14px] text-[#727272]">Общая статистика по компании</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3px]">
          <WorkingTodayCard 
              working={dashboardData.todayStats.workingToday} 
              total={dashboardData.todayStats.totalEmployees} 
          />
          <ReportsTodayCard count={dashboardData.todayStats.reportsToday} />
          <AverageDurationCard duration={dashboardData.todayStats.averageWorkHours} />
          <AbsentCard count={dashboardData.todayStats.sickToday + dashboardData.todayStats.vacationToday} />
        </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px]">
        <h3 className="text-[20px] font-semibold text-gray-900 mb-[20px]">Последние отчеты</h3>
        <div className="flex flex-col gap-[3px]">
          {dashboardData.recentReports.length > 0 ? (
            dashboardData.recentReports.map((report) => (
              <RecentReportItem key={report.id} report={report} />
            ))
          ) : (
            <div className="bg-[#f8f8f8] rounded-[30px] p-[22px] text-center">
              <p className="text-gray-500">Нет отчетов за сегодня</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard; 