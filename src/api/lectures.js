import axios from './axios';



export async function getLecture(courseId, lectureId) {
  const response = await axios.get(`/api/lectures/${lectureId}`);
  return response.data;
}


export async function getLectures(courseId) {
  const response = await axios.get(`/api/lectures/course/${courseId}`);
  return response.data;
}


export async function deleteLectureFile(lectureId, fileId) {
  await axios.delete(`/api/lectures/${lectureId}/file/${fileId}`);
}

export async function deleteLecture(lectureId) {
  await axios.delete(`/api/lectures/${lectureId}`);
}


export async function createLecture(lecture, files) {
  const formData = new FormData();
  formData.append(
    'lecture',
    new Blob([JSON.stringify(lecture)], { type: 'application/json' })
  );
  if (files && files.length) {
    files.forEach((file) => formData.append('file', file));
  }
  console.log(formData)
  const response = await axios.post(
    `/api/lectures/create`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}




export async function updateLecture(lectureId, lecture, files) {
  const formData = new FormData();
  formData.append(
    'lecture',
    new Blob([JSON.stringify(lecture)], { type: 'application/json' })
  );
  if (files && files.length) {
    files.forEach((file) => formData.append('file', file));
  }
  console.log(formData)
  const response = await axios.put(
    `/api/lectures/${lectureId}/update`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}