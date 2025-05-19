// src/components/TeacherHeader.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import accountImg from '../assets/account.png';

export default function TeacherHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // якщо є додаткові дані користувача, їх теж слід видалити
    navigate('/');
  };

  const navLinks = [
    { to: '/teacher', label: 'Головна' },
    { to: '/teacher/create-course', label: 'Створити курс' },
    { to: '/teacher/courses', label: 'Мої курси' },
    { to: '/teacher/students', label: 'Студенти' },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Логотип */}
      <NavLink to="/teacher">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          DeepDiveStudy
        </h1>
      </NavLink>

      {/* Навігація */}
      <nav className="space-x-6">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Сповіщення та аватар */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
               src={accountImg}
              alt="Avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              Профіль
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>
              Вийти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
);
}
