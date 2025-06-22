import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { toast } from 'react-hot-toast';

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
          <p className="text-gray-600">Управление сотрудниками компании</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Пригласить сотрудника
        </button>
      </div>

      {/* Список сотрудников */}
      {employees.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время работы</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      employee.todayStatus === 'work' ? 'bg-green-100 text-green-800' :
                      employee.todayStatus === 'sick' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.todayStatus === 'work' ? 'Работает' :
                       employee.todayStatus === 'sick' ? 'Болеет' :
                       employee.todayStatus === 'vacation' ? 'Отпуск' : 'Не активен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.todayStartTime && (
                      <span>{new Date(employee.todayStartTime).toLocaleTimeString()} - {
                        employee.todayEndTime ? new Date(employee.todayEndTime).toLocaleTimeString() : 'сейчас'
                      }</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => window.location.href = `/employees/${employee.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Пока нет сотрудников</h3>
            <p className="mt-1 text-sm text-gray-500">
              Пригласите первого сотрудника в вашу команду
            </p>
          </div>
        </div>
      )}

      {/* Модальное окно приглашения */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Пригласить сотрудника</h2>
            
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите имя"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEmployeeName('');
                      setInviteLink('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
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
                    className="w-full px-3 py-2 bg-gray-50 border rounded-lg"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    📋
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEmployeeName('');
                      setInviteLink('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
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