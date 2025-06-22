import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка списка сотрудников
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data.employees);
    } catch (error) {
      toast.error('Не удалось загрузить список сотрудников');
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
  }

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      work: { text: 'Работает', color: '#51BE3F', bgColor: '#d4ffe3' },
      sick: { text: 'Болеет', color: '#FF6C59', bgColor: '#ffe9e6' },
      vacation: { text: 'Отпуск', color: '#727272', bgColor: '#f1f1f1' },
      default: { text: 'Не активен', color: '#727272', bgColor: '#f1f1f1' },
    };
    const currentStatus = statusStyles[status] || statusStyles.default;

    return (
      <span style={{ color: currentStatus.color, backgroundColor: currentStatus.bgColor }} className="px-[10px] py-[4px] rounded-full text-[12px] font-medium">
        {currentStatus.text}
      </span>
    )
  }

  return (
    <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px]">
      <div className="mb-[30px] flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-gray-900 leading-[32px]">Сотрудники</h1>
          <p className="text-[14px] text-[#727272]">Управление сотрудниками компании</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-[16px] py-[10px] bg-[#101010] text-white text-[14px] font-semibold rounded-[30px] hover:bg-gray-800 transition-colors"
        >
          + Пригласить сотрудника
        </button>
      </div>

      {/* Список сотрудников */}
      {employees.length > 0 ? (
        <div className="flex flex-col gap-[3px]">
          <div className="grid grid-cols-4 gap-[22px] px-[22px] py-[10px] text-[12px] text-[#727272] font-semibold uppercase">
              <div>Имя</div>
              <div>Статус</div>
              <div>Время работы</div>
              <div>Действия</div>
          </div>
          {employees.map((employee) => (
            <div key={employee.id} className="bg-[#f8f8f8] rounded-[16px] p-[22px] grid grid-cols-4 gap-[22px] items-center text-[14px] font-medium">
              <div>{employee.name}</div>
              <div><StatusBadge status={employee.todayStatus} /></div>
              <div>
                {employee.todayStartTime ? 
                  `${format(new Date(employee.todayStartTime), 'HH:mm')} - ${employee.todayEndTime ? format(new Date(employee.todayEndTime), 'HH:mm') : 'сейчас'}`
                  : '-'}
              </div>
              <div>
                <button 
                  onClick={() => window.location.href = `/employees/${employee.id}`}
                  className="text-accent hover:underline"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#f8f8f8] rounded-[16px] p-[22px] text-center text-[#727272]">
           <p>Пока нет сотрудников. Пригласите первого!</p>
        </div>
      )}

      {/* Модальное окно приглашения */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-[19px] p-[22px] w-full max-w-md">
            <h2 className="text-[20px] font-semibold mb-[20px]">Пригласить сотрудника</h2>
            
            {!inviteLink ? (
              <form onSubmit={handleInvite}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя сотрудника
                  </label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Введите имя"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Отмена
                  </button>
                  <button type="submit" disabled={isLoading} className="px-4 py-2 bg-[#101010] text-white rounded-[16px] hover:bg-gray-800 disabled:opacity-50">
                    {isLoading ? 'Создание...' : 'Создать приглашение'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="mb-2 text-sm text-gray-600">
                  Отправьте эту ссылку сотруднику:
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[16px]"
                  />
                  <button onClick={copyInviteLink} className="p-2 bg-gray-200 rounded-[16px] hover:bg-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
                <div className="flex justify-end">
                  <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Закрыть
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees; 