import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000', timeout: 15000 })
export const getHealth = () => api.get('/health')
export const getMetrics = () => api.get('/metrics')
export const postPredict = (payload) => api.post('/predict', payload)
export const postPredictFile = (formData) => api.post('/predict-file', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export default api