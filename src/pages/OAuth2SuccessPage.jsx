import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../Redux/userSlice.js';
// Функція для розбору JWT без зовнішніх бібліотек
function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

export default function OAuth2SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        // 1) Зберігаємо JWT у sessionStorage
        sessionStorage.setItem('jwtToken', token);
  
        // 2) Розбираємо payload токена
        const decoded = parseJwt(token);
        const email = decoded?.email || decoded?.sub || '';
        const userRole = decoded?.authorities?.[0] || 'ROLE_STUDENT';
  
        // 3) Оновлюємо Redux-сховище
        dispatch(loginSuccess({ token, user: email, role: userRole }));
  
        // 4) Редірект за роллю
        if (userRole === 'ROLE_TEACHER') navigate('/teacher');
        else navigate('/student');
      }
    }, [location.search, dispatch, navigate]);
  
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Обробка аутентифікації... Будь ласка, зачекайте.</p>
      </div>
    );
  }
  