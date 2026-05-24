import { ref, computed, watch, onMounted } from 'vue'
import { useSupportStore } from '@/store/support'

export function useSupport() {
    const supportStore = useSupportStore()

    const search = ref('')
    const selectedStatus = ref('all')
    const selectedPriority = ref('all')

    const activeTicket = ref(null)
    const replyMessage = ref('')

    const showCreateDialog = ref(false)
    const submittings = ref(false)
    const newTicket = ref({
        title: '',
        description: '',
        priority: 'medium'
    })

    const tickets = computed(() => supportStore.tickets)
    const replies = computed(() => supportStore.replies)
    const loading = computed(() => supportStore.loading)
    const loadingReplies = computed(() => supportStore.loadingReplies)

    const loadTickets = async () => {
        const params = {}
        if (selectedStatus.value !== 'all') params.status = selectedStatus.value
        if (selectedPriority.value !== 'all') params.priority = selectedPriority.value
        if (search.value.trim()) params.search = search.value.trim()

        await supportStore.fetchTickets(params)
    }

    let searchTimeout = null
    watch(search, () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            loadTickets()
        }, 350)
    })

    watch([selectedPriority, selectedStatus], () => {
        loadTickets()
    })

    onMounted(() => {
        loadTickets()
    })

    const selectTicket = async (ticket) => {
        activeTicket.value = ticket
        try {
            const details = await supportStore.fetchTicketDetails(ticket.id)
            activeTicket.value = { ...activeTicket.value, ...details }
        } catch (_) {
            // Fallback initial detail description if replies block fails or empty
            supportStore.replies = [
                {
                    id: 'initial',
                    message: ticket.description || 'Muammo tavsifi kiritilmagan.',
                    is_admin: false,
                    author_name: 'Men',
                    created_on: ticket.created_on || ticket.created_at
                }
            ]
        }
    }

    const handleSendReply = async () => {
        if (!replyMessage.value.trim() || !activeTicket.value) return
        const text = replyMessage.value.trim()
        replyMessage.value = ''

        try {
            await supportStore.sendReply(activeTicket.value.id, text)
        } catch (_) {
            // Optimistic local push for fallback
            supportStore.replies.push({
                id: Date.now(),
                author_name: 'Men',
                message: text,
                is_admin: false,
                created_on: new Date().toISOString()
            })
        }
    }

    const handleCreateTicket = async () => {
        if (!newTicket.value.title.trim() || !newTicket.value.description.trim()) return
        submittings.value = true
        try {
            const ticket = await supportStore.createTicket({
                title: newTicket.value.title.trim(),
                description: newTicket.value.description.trim(),
                priority: newTicket.value.priority
            })
            showCreateDialog.value = false
            newTicket.value = { title: '', description: '', priority: 'medium' }
            if (ticket) {
                selectTicket(ticket)
            }
        } catch (_) {
        } finally {
            submittings.value = false
        }
    }

    const formatDateTime = (val) => {
        if (!val) return ''
        const dt = new Date(val)
        if (isNaN(dt)) return val
        return dt.toLocaleString('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return {
        search,
        selectedStatus,
        selectedPriority,
        activeTicket,
        replyMessage,
        showCreateDialog,
        newTicket,
        submittings,
        tickets,
        replies,
        loading,
        loadingReplies,
        loadTickets,
        selectTicket,
        handleSendReply,
        handleCreateTicket,
        formatDateTime
    }
}
