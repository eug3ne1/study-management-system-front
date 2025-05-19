import axios from './axios';

/**
 * Повертає оцінки студентів за тести курсу
 */
export async function getTestGrades(courseId) {
  const res = await axios.get(`/api/grades/test/${courseId}`);
  return res.data;
}

/**
 * Повертає оцінки студентів за завдання курсу
 */
export async function getTaskGrades(courseId) {
  const res = await axios.get(`/api/grades/task/${courseId}`);
  return res.data;
}

export async function getStudentTaskGrades(courseId) {
  const res = await axios.get(`/api/grades/tasks/course/${courseId}/student`);
  return res.data;
}


export async function getStudentTestGrades(courseId) {
  const { data } = await axios.get(`/api/grades/tests/course/${courseId}/student`);
  return data; 
}


