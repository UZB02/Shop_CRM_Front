import api from './axios'

export const settingsAPI = {
    getAll: (params) => api.get('/settings/', { params }),
    getById: (id) => api.get(`/settings/${id}/`),
    create: (data) => api.post('/settings/', data),
    update: (id, data) => {
        if (typeof id === 'object' && !data) {
            return api.patch('/settings/', id);
        }
        return api.patch(`/settings/${id}/`, data);
    }
}

export const notificationsAPI = {
    getAll: (params, config = {}) => api.get('/notifications/', { params, ...config }),
    markRead: (config = {}) => api.post('/notifications/mark-read/', {}, config)
}

export const announcementsAPI = {
    getAll: (params) => api.get('/announcements/', { params }),
    markRead: (id) => api.post(`/announcements/${id}/mark-read/`, {}),
    markReadAll: () => api.post('/announcements/mark-read/', {})
}

export const subscriptionAPI = {
    getStatus: (config = {}) => api.get('/subscription/', config),
    extend: (data) => api.post('/subscription/extend/', data),
    changePlan: (data) => api.post('/subscription/plan/', data)
}


