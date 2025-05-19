import axios from "axios";

const API_URL = "http://localhost:8080/auth"; 

export async function register(data) {
  const response = await axios.post(`${API_URL}/signup`, data);
  return response.data;
}

export async function login(data) {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
}
