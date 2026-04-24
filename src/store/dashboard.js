import { defineStore } from 'pinia'
import { dashboardAPI } from '@/services/api'

export const useDashboardStore = defineStore('dashboard', {
    state: () => {
        // Default to current month start and today
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const formatDate = (date) => {
            const d = new Date(date)
            let month = '' + (d.getMonth() + 1)
            let day = '' + d.getDate()
            const year = d.getFullYear()

            if (month.length < 2) month = '0' + month
            if (day.length < 2) day = '0' + day

            return [year, month, day].join('-')
        }

        return {
            data: null,
            loading: false,
            filters: {
                date_from: formatDate(firstDay),
                date_to: formatDate(now),
                branch: null,
                worker: null,
                category: null,
                warehouse: null,
                limit: 10
            },
            error: null,
            lastUpdated: null
        }
    },
    
    getters: {
        sales: (state) => state.data?.sales || {},
        products: (state) => state.data?.products || {},
        customers: (state) => state.data?.customers || {},
        expenses: (state) => state.data?.expenses || {},
        suppliers: (state) => state.data?.suppliers || {},
        branches: (state) => state.data?.branches || [],
        workers: (state) => state.data?.workers || {},
        currentSmena: (state) => state.data?.current_smena || {},
        chartData: (state) => state.data?.chart_data || {},
        period: (state) => state.data?.period || {}
    },

    actions: {
        async fetchDashboard() {
            this.loading = true
            this.error = null
            try {
                // Ensure date_from and date_to are strings
                const params = { ...this.filters }
                if (params.date_from instanceof Date) params.date_from = params.date_from.toISOString().split('T')[0]
                if (params.date_to instanceof Date) params.date_to = params.date_to.toISOString().split('T')[0]

                const response = await dashboardAPI.getData(params)
                this.data = response.data
                this.lastUpdated = new Date()
                return { success: true }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
                this.error = err.response?.data?.detail || 'Ma\'lumotlarni yuklashda xatolik yuz berdi'
                return { success: false, error: this.error }
            } finally {
                this.loading = false
            }
        },

        updateFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters }
            return this.fetchDashboard()
        },

        resetFilters() {
            const now = new Date()
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            
            const formatDate = (date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
            }

            this.filters = {
                date_from: formatDate(firstDay),
                date_to: formatDate(now),
                branch: null,
                worker: null,
                category: null,
                warehouse: null,
                limit: 10
            }
            return this.fetchDashboard()
        }
    }
})
