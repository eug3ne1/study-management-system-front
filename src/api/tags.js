// src/api/tags.js
import axios from './axios';

/**
 * Отримати список доступних тегів
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export async function getTags() {
  const response = await axios.get('/api/tags');
  return response.data;
}
