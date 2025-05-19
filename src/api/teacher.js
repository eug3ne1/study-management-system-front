// src/api/teacher.js
import axios from './axios';

/**
 * Повертає дані викладача за його ID
 */
export async function getTeacherById(teacherId) {
  const res = await axios.get(`/api/info/teacher/${teacherId}`);
  return res.data; 
}

/**
 * Повертає список викладачів, які викладають в даному університеті
 */
export async function getTeachersByUniversity(universityId) {
  const res = await axios.get(`/api/university/${universityId}/teachers`);
  return res.data; // [{ id, firstName, lastName, … }, …]
} 