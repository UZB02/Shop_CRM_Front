import axios from 'axios'

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.siriuspos.uz/api/v1"

let _memToken = null

export const setApiToken = (token) => { _memToken = token }
export const clearApiToken = () => { _memToken = null }
export const resetRefreshState = () => {
    isRefreshing = false
    refreshQueue = []
}

let isRefreshing = false
let refreshQueue = []

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Start global loading bar
        if (!config.silent && typeof window !== 'undefined' && window.startLoader) window.startLoader()

        const token = _memToken || localStorage.getItem('access')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor to handle errors and warnings
api.interceptors.response.use(
    (response) => {
        // Stop global loading bar
        if (!response.config.silent && typeof window !== 'undefined' && window.stopLoader) window.stopLoader()

        // Log all incoming API data to console for monitoring
        console.log(`🌐 API RESPONSE [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.data)

        // Check for subscription warning
        const warning = response.headers['x-subscription-warning']
        if (warning) {
            window.dispatchEvent(new CustomEvent('subscription-warning', { detail: warning }))
        }
        return response
    },
    async (error) => {
        // Stop global loading bar
        if (!error.config?.silent && typeof window !== 'undefined' && window.stopLoader) window.stopLoader()

        console.error(`❌ API ERROR [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, error.response?.data || error.message)
        
        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            window.dispatchEvent(new CustomEvent('network-error', {
                detail: "Internet bilan aloqa yo'q yoki serverga ulanib bo'lmadi. Iltimos, ulanishni tekshiring."
            }))
        }

        const status = error.response?.status
        const original = error.config

        if (status === 401 && !original._retry) {
            original._retry = true

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject })
                }).then(token => {
                    original.headers.Authorization = `Bearer ${token}`
                    return api(original)
                })
            }

            isRefreshing = true

            try {
                const refresh = localStorage.getItem('refresh')
                if (!refresh) throw new Error('No refresh token')

                const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh })
                const newAccess = res.data.access
                const newRefresh = res.data.refresh

                localStorage.setItem('access', newAccess)
                if (newRefresh) localStorage.setItem('refresh', newRefresh)
                setApiToken(newAccess)

                refreshQueue.forEach(p => p.resolve(newAccess))
                refreshQueue = []
                original.headers.Authorization = `Bearer ${newAccess}`
                return api(original)
            } catch (refreshError) {
                refreshQueue.forEach(p => p.reject(refreshError))
                refreshQueue = []

                clearApiToken()
                const preservedKeys = ['theme', 'lang']
                Object.keys(localStorage).forEach(key => {
                    if (!preservedKeys.includes(key)) localStorage.removeItem(key)
                })

                const router = (await import('@/router')).default
                router.push({ name: 'login' })
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        } else if (status === 429) {
            console.log('🔘 Dispatching rate-limit-error event')
            window.dispatchEvent(new CustomEvent('rate-limit-error', {
                detail: error.response?.data?.detail || "So'rovlar soni limitdan oshdi. Biroz kuting va qayta urinib ko'ring."
            }))
        }
        
        return Promise.reject(error)
    }
)

export const getErrorMessage = (error, fallback = "Xatolik yuz berdi") => {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        return "Internet bilan aloqa yo'q yoki serverga ulanib bo'lmadi. Iltimos, ulanishni tekshiring."
    }

    const data = error.response?.data
    if (!data) return error.message || fallback

    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    
    // Handle DRF validation errors: { "field_name": ["error message"] }
    if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        if (firstKey) {
            const err = data[firstKey]
            const message = Array.isArray(err) ? err[0] : err
            // If message is still an object, try to get its first value
            if (typeof message === 'object') {
                const subKey = Object.keys(message)[0]
                return message[subKey]
            }
            return message
        }
    }
    
    return fallback
}

export default api


