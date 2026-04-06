import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 60000, // 60s for AI calls
});

export const ideasApi = {
  getAll: () => api.get('/ideas').then(r => r.data),
  getById: (id) => api.get(`/ideas/${id}`).then(r => r.data),
  create: (title, description) => api.post('/ideas', { title, description }).then(r => r.data),
  delete: (id) => api.delete(`/ideas/${id}`).then(r => r.data),
};

export default api;
