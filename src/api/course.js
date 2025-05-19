// src/api/course.js
import axios from './axios';

/**
 * Створити новий курс
 * @param {{ uniId: number; name: string; description: string }} courseData
 * @returns {Promise<Object>}
 */
export async function createCourse(courseData) {
  const response = await axios.post('/api/courses/create', courseData);
  return response.data;
}

export async function getTeacherCourses() {
  const response = await axios.get('/api/courses/teacher');
  return response.data;
}

/**
 * Видалити курс за ID
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteCourse(id) {
  await axios.delete(`/api/courses/${id}`);
}

export async function updateCourse(id, courseData) {
  const response = await axios.put(`/api/courses/${id}`, courseData);
  return response.data;
}

export async function getCourseStudents(courseId) {
  const res = await axios.get(`/api/courses/${courseId}/students`);
  return res.data; // [{ id, firstName, lastName, … }, …]
}

export async function getStudentCourses() {
  const res = await axios.get('/api/student/courses');
  return res.data; 
}

export async function deleteStudentCourse(courseId) {
  await axios.delete(`/api/courses/student/${courseId}`);
  
}



export async function getCoursesByTeacher(teacherId) {
  const res = await axios.get(
    `/api/courses/teacher/${teacherId}`
  );
  return res.data; 
}


export async function enrollCourse(courseId) {
  const res = await axios.post(`/api/student/courses/enroll/${courseId}`,);
  return res.data;
}
