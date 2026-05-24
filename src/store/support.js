import { defineStore } from 'pinia'
import { supportAPI } from '@/services'

export const useSupportStore = defineStore('support', {
    state: () => ({
        tickets: [],
        replies: [],
        loading: false,
        loadingReplies: false,
        error: null
    }),
    actions: {
        async fetchTickets(params = {}) {
            this.loading = true
            this.error = null
            try {
                const response = await supportAPI.getAll(params)
                if (response.data && Array.isArray(response.data.results)) {
                    this.tickets = response.data.results
                } else {
                    this.tickets = response.data || []
                }
            } catch (err) {
                this.error = err.message || 'Murojaatlarni yuklashda xatolik yuz berdi'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchTicketDetails(ticketId) {
            this.loadingReplies = true
            this.error = null
            try {
                const response = await supportAPI.getById(ticketId)
                if (response.data && Array.isArray(response.data.replies)) {
                    this.replies = response.data.replies
                } else {
                    this.replies = []
                }
                return response.data
            } catch (err) {
                this.error = err.message || 'Murojaat tafsilotlarini yuklashda xatolik'
                throw err
            } finally {
                this.loadingReplies = false
            }
        },

        async createTicket(ticketData) {
            this.loading = true
            this.error = null
            try {
                const response = await supportAPI.create(ticketData)
                if (response.data) {
                    this.tickets.unshift(response.data)
                }
                return response.data
            } catch (err) {
                this.error = err.message || 'Yangi murojaat yaratishda xatolik'
                throw err
            } finally {
                this.loading = false
            }
        },

        async sendReply(ticketId, messageText) {
            try {
                const response = await supportAPI.sendReply(ticketId, { message: messageText })
                this.replies.push({
                    id: Date.now(),
                    author_name: 'Men',
                    message: messageText,
                    is_admin: false,
                    created_on: new Date().toISOString()
                })
                return response.data
            } catch (err) {
                this.error = err.message || 'Javob yuborishda xatolik'
                throw err
            }
        }
    }
})
