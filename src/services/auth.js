import axios from 'axios'
import api from './axios'

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://shopcrmsystem-production.up.railway.app/api/v1"

export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    logout: (data) => api.post('/auth/logout/', data),
    tokenRefresh: (data) => axios.post(`${API_BASE_URL}/auth/token/refresh/`, data),
    register: (userData) => api.post('/auth/register/', userData),
    getMe: () => api.get('/auth/me'),
    changePassword: (data) => api.post('/auth/change-password/', data),
    sendResetEmail: (data) => api.post('/auth/send-reset-email/', data),
    resetPassword: (uid, token, data) => api.post(`/auth/reset-password/${uid}/${token}/`, data)
}


