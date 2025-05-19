// src/api/stats.js
import axios from './axios'; // ваш налаштований екземпляр axios

export async function getActiveCoursesCount() {
  const res = await axios.get('/api/teacher/courses/count');
  return res.data;
}

export async function getActiveTestsCount() {
  const res = await axios.get('/api/teacher/tests/count');
  return res.data;
}

export async function getStudentsCount() {
  const res = await axios.get('/api/teacher/students/count');
  return res.data;
}