import api from './axios'

export const supportAPI = {
    getAll: (params) => api.get('/support/tickets/', { params }),
    getById: (id) => api.get(`/support/tickets/${id}/`),
    create: (data) => api.post('/support/tickets/', data),
    sendReply: (id, data) => api.post(`/support/tickets/${id}/reply/`, data)
}
