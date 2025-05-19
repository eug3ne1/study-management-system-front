// src/api/taskSubmissions.js
import axios from './axios';

/**
 * Повертає масив TaskSubmission для конкретного завдання
 */
export async function getCourseSubmissions(courseId) {
  const res = await axios.get(`/api/task-submission/${courseId}`);
  return res.data; // масив { id, task, student, grade, filesUrl }
}

/**
 * Виставляє оцінку конкретній подачі
 */
export async function gradeTaskSubmission(subId, grade) {
  // PUT /api/tasks-submission/{subId}/grade?grade=...
  const res = await axios.put(`/api/task-submission/${subId}/grade`, null, {
    params: { grade }
  });
  return res.data;
}


export async function submitTask(taskId, filesArray) {
  const formData = new FormData()
  filesArray.forEach(f => formData.append('file', f))
  const { data } = await axios.post(
    `/api/task-submission/${taskId}/create`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}


export async function getStudentSubmission(taskId) {
  const res = await axios.get(`/api/task-submission/${taskId}/student`); 
  return res.data; // або null
}

