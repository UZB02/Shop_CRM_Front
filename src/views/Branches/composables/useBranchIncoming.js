import { ref, onMounted } from 'vue'
import { branchesAPI, movementsAPI } from '@/services/api'
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

    // Void states
    const voidingId = ref(null)
    const voidingReason = ref('')
    const voidingLoading = ref(false)
    const voidingDialogVisible = ref(false)

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

    const openVoidDialog = (item) => {
        voidingId.value = item.id
        voidingReason.value = ''
        voidingDialogVisible.value = true
    }

    const confirmVoid = async () => {
        if (!voidingId.value) return
        if (!voidingReason.value.trim()) {
            toast.add({
                severity: 'warn',
                summary: t('common.confirm_title') || 'Ogohlantirish',
                detail: t('warehouse.detail.void_reason_required') || 'Bekor qilish sababini kiriting',
                life: 3000
            })
            return
        }

        try {
            voidingLoading.value = true
            const res = await movementsAPI.void(voidingId.value, {
                reason: voidingReason.value.trim()
            })
            
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: res.data?.detail || t('warehouse.detail.void_success') || 'Kirim muvaffaqiyatli bekor qilindi.',
                life: 3000
            })
            
            voidingDialogVisible.value = false
            await fetchIncoming(incomingPage.value)
        } catch (err) {
            console.error('Error voiding movement:', err)
            const errorMsg = err.response?.data?.detail || t('warehouse.detail.void_error') || 'Bekor qilishda xatolik yuz berdi'
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: errorMsg,
                life: 5000
            })
        } finally {
            voidingLoading.value = false
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
        fetchIncoming,
        
        // Void exports
        voidingId,
        voidingReason,
        voidingLoading,
        voidingDialogVisible,
        openVoidDialog,
        confirmVoid
    }
}


