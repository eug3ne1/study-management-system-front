// src/api/tests.js
import axios from './axios';

/**
 * Створити новий тест з повними питаннями
 * @param {Object} testData
 * @param {number|string} courseId
 * @returns {Promise<Object>}
 */
export async function createTest(courseId, testData) {
  const payload = { courseId, ...testData };
  const response = await axios.post('/api/tests/create-full', payload);
  console.log(payload);
  return response.data;
}

export async function getTests(courseId) {
    const response = await axios.get(`/api/tests/course/${courseId}`);
    return response.data;
  }

  export async function getTest(testId) {
    const response = await axios.get(`/api/tests/${testId}`);
    return response.data;
  }

  export async function updateTest(courseId, testId, testData) {
    // бекенд чекає courseId разом із усіма іншими полями
    const payload = { courseId, ...testData };
    const response = await axios.put(
      `/api/teacher/tests/update/${testId}`,  // або /api/teacher/tests/${testId}/update, якщо так налаштовано
      payload
    );
    return response.data;
  }

export async function deleteTest(testId) {
    await axios.delete(`/api/tests/${testId}`);
  }

  export async function submitTest(test) {
    const response = await axios.post(`/api/student/test/submit`, test);
    return response.data
    
  }


  export async function getAttempts(testId) {
    const res = await axios.get(`/api/tests/${testId}/attempts`);
    return res.data; // очікуємо число
  }




