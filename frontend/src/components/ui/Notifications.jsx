import React, { useState, useEffect, useRef } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Bell, User, AlertTriangle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const NotificationIcon = ({ type }) => {
    switch (type) {
        case 'late':
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'no_report':
            return <User className="w-5 h-5 text-red-500" />;
        case 'new_employee':
            return <UserPlus className="w-5 h-5 text-green-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};


const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen && notifications.length === 0) {
            fetchNotifications();
        }
    };
    
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await dashboardService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center"
            >
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-[19px] shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">Уведомления</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center">Загрузка...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div key={notif.id} className="flex items-start p-4 border-b hover:bg-gray-50">
                                    <div className="mr-3 pt-1">
                                        <NotificationIcon type={notif.type} />
                                    </div>
                                    <div>
                                        <p className="text-sm">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true, locale: ru })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Нет новых уведомлений
                            </div>
                        )}
                    </div>
                     <div className="p-2 bg-gray-50 rounded-b-[19px] text-center">
                        <button onClick={fetchNotifications} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Обновить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications; 