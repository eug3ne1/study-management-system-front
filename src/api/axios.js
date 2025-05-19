import axios from 'axios';

// Конфігурація базового URL для всіх запитів
const instance = axios.create({
  baseURL: 'http://localhost:8080', // зміни, якщо бекенд на іншому URL
});

// Додаємо JWT-токен у всі запити, якщо він є в localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
