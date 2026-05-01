import { ref, onMounted } from 'vue'
import { branchesAPI } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

export function useBranchIncoming(branchId) {
    const { t } = useI18n()
    const toast = useToast()

    const incomingHistory = ref([])
    const incomingTotal = ref(0)
    const incomingPage = ref(0)
    const incomingRows = ref(10)
    const loading = ref(false)

    const fetchIncoming = async (page = 0) => {
        if (!branchId) return
        
        try {
            loading.value = true
            incomingPage.value = page
            const res = await branchesAPI.getIncoming(branchId, { 
                page: page + 1, 
                size: incomingRows.value 
            })
            
            incomingHistory.value = res.data.results || res.data
            incomingTotal.value = res.data.count || (Array.isArray(res.data) ? res.data.length : 0)
        } catch (err) {
            console.error('Error fetching incoming history:', err)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('common.error_message'),
                life: 3000
            })
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchIncoming(0)
    })

    return {
        incomingHistory,
        incomingTotal,
        incomingPage,
        incomingRows,
        loading,
        fetchIncoming
    }
}


