import React from 'react';
import AccordionItem from '../components/ui/AccordionItem';

const Faq = () => {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[23px]">
      <div className="mb-[20px]">
        <h1 className="text-[24px] font-semibold text-gray-900 leading-[32px]">Часто задаваемые вопросы (FAQ)</h1>
        <p className="text-[14px] text-[#727272]">Ответы на популярные вопросы о работе сервиса.</p>
      </div>

      <div className="bg-[#f8f8f8] rounded-[16px] p-2">
            <AccordionItem title="Как пригласить нового сотрудника?">
                <p>Перейдите на страницу "Сотрудники", нажмите кнопку "+ Пригласить сотрудника", введите его имя и отправьте ему сгенерированную ссылку. После перехода по ссылке и регистрации в Telegram-боте, сотрудник появится в вашем списке.</p>
            </AccordionItem>
            <AccordionItem title="Как посмотреть отчеты за определенный период?">
                <p>На странице "Отчеты" вы можете выбрать начальную и конечную дату в календарях и список отчетов обновится автоматически. Вы также можете экспортировать отчеты за выбранный период в формате Excel.</p>
            </AccordionItem>
            <AccordionItem title="Как изменить время отправки уведомлений?">
                <p>Перейдите в "Настройки" через выпадающее меню в правом верхнем углу. На странице настроек вы можете изменить время утренних и вечерних уведомлений для всех сотрудников.</p>
            </AccordionItem>
        </div>
    </div>
  );
};

export default Faq; 