import { ref } from 'vue'
import { shiftsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useShift() {
    const toast = useToast()
    const { t } = useI18n()

    const activeShift = ref(null)
    const shiftLoading = ref(false)
    const posLoading = ref(false)

    const fetchShiftStatus = async () => {
        shiftLoading.value = true
        console.log('🔄 Checking shift status...')
        try {
            const res = await shiftsAPI.getAll({ status: 'open', limit: 1 })
            const openShifts = res.data.results || res.data
            console.log('📋 Shift API Response Data:', openShifts)

            if (openShifts && openShifts.length > 0) {
                activeShift.value = openShifts[0]
            } else {
                activeShift.value = null
            }
        } catch (error) {
            console.error('Error fetching shift status:', error)
        } finally {
            shiftLoading.value = false
        }
    }

    const openShift = async (branchId, cashStart) => {
        posLoading.value = true
        try {
            const res = await shiftsAPI.open({
                branch: branchId,
                cash_start: cashStart
            })
            activeShift.value = res.data
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Smena muvaffaqiyatli ochildi',
                life: 3000
            })
            return true
        } catch (error) {
            const errorMsg =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : 'Smenani ochishda xatolik')
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: errorMsg,
                life: 3000
            })
            return false
        } finally {
            posLoading.value = false
        }
    }

    const closeShift = async (cashCounted) => {
        if (!activeShift.value) return
        posLoading.value = true
        try {
            await shiftsAPI.close(activeShift.value.id, {
                cash_counted: cashCounted
            })
            activeShift.value = null
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Smena muvaffaqiyatli yopildi',
                life: 3000
            })
            return true
        } catch (error) {
            const errorMsg =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : 'Smenani yopishda xatolik')
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: errorMsg,
                life: 3000
            })
            return false
        } finally {
            posLoading.value = false
        }
    }

    return {
        activeShift,
        shiftLoading,
        posLoading,
        fetchShiftStatus,
        openShift,
        closeShift
    }
}
