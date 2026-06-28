import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const getAllTasks  = (filters = {}) => API.get('/tasks', { params: filters });
export const getTaskById  = (id)           => API.get(`/tasks/${id}`);
export const createTask   = (data)         => API.post('/tasks', data);
export const updateTask   = (id, data)     => API.put(`/tasks/${id}`, data);
export const deleteTask   = (id)           => API.delete(`/tasks/${id}`);

export default API;
