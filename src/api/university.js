// src/api/university.js
import axios from './axios';

/**
 * Отримати список університетів
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export async function getUniversities() {
  const response = await axios.get('api/university');
  return response.data;
}
