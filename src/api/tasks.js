import axios from './axios';


export async function getTask(taskId) {
  const res = await axios.get(`/api/tasks/${taskId}`);
  return res.data;
}

  export async function getTasks(courseId) {
    const response = await axios.get(`/api/tasks/course/${courseId}`);
    return response.data;
  }

  export async function createTask(task, files) {
    const formData = new FormData();
  
    // додаємо JSON-поле як Blob
    formData.append(
      'task',
      new Blob([JSON.stringify(task)], { type: 'application/json' })
    );
  
    // додаємо файли, якщо вони є
    if (files && files.length) {
      files.forEach((file) => formData.append('file', file));
    }
  
    const response = await axios.post(
      `/api/tasks/create`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  
    return response.data;
  }


  export async function updateTask(taskId, task, files) {
    const formData = new FormData();
    formData.append(
      'task',
      new Blob([JSON.stringify(task)], { type: 'application/json' })
    );
    if (files && files.length) {
      files.forEach((file) => formData.append('file', file));
    }
    console.log(formData)
    const response = await axios.put(
      `/api/tasks/${taskId}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }


  export async function deleteTask(taskId) {
    await axios.delete(`/api/tasks/${taskId}`);
  }

  export async function deleteTaskFile(taskId, fileId) {
    await axios.delete(`/api/tasks/${taskId}/file/${fileId}`);
  }
  
