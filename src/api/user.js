// src/api/user.js
import axios from './axios';

/**
 * Підвантажує дані поточного користувача
 */
export async function getProfile() {
  const res = await axios.get('/api/profile');
  return res.data; 
}

/**
 * Оновлює імʼя/прізвище та/або пароль
 * @param {{ firstName: string, lastName: string, currentPassword?: string, newPassword?: string }} data
 */
export async function updateProfile(data) {
  const res = await axios.put('/api/profile', data);
  return res.data;
}