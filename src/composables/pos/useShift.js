import { ref } from 'vue'
import { shiftsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useShift() {
    const toast = useToast()
    const { t } = useI18n()

    const activeShift = ref(null)
    const activeXReport = ref(null)
    const shiftLoading = ref(false)
    const posLoading = ref(false)

    const fetchShiftStatus = async () => {
        shiftLoading.value = true
        console.group('🔍 SHIFT DEBUG INFO');
        try {
            // Backend taklifi: ?status=open (ochiqlarni tekshiramiz)
            const res = await shiftsAPI.getAll({ status: 'open' })
            const responseData = res.data.data?.results || res.data.results || res.data.data || res.data
            
            console.log('📡 API CALL: GET /shifts/?status=open');
            console.log('📦 FULL RESPONSE:', res.data);

            if (responseData && (Array.isArray(responseData) ? responseData.length > 0 : !!responseData)) {
                activeShift.value = Array.isArray(responseData) ? responseData[0] : responseData
                // Smena ochiq bo'lsa, x-report (expected_cash miqdori) ni tortamiz
                await fetchXReport(activeShift.value.id)
            } else {
                activeShift.value = null
                activeXReport.value = null
            }
        } catch (error) {
            console.error('❌ SHIFT API ERROR:', error)
        } finally {
            shiftLoading.value = false
            console.groupEnd();
        }
    }

    const fetchXReport = async (shiftId) => {
        if (!shiftId) return
        try {
            const res = await shiftsAPI.getXReport(shiftId)
            activeXReport.value = res.data.x_report || res.data
            console.log('📊 X-REPORT DATA:', activeXReport.value)
        } catch (error) {
            console.warn('⚠️ Could not fetch X-report:', error)
        }
    }

    const openShift = async (branchId, cashStart) => {
        shiftLoading.value = true
        const payload = {
            branch: branchId,
            cash_start: cashStart
        }

        console.group('🚀 SMENA OCHISH DEBUG');
        console.log('📡 API CALL: POST /shifts/');
        console.log('📦 PAYLOAD:', payload);
        console.groupEnd();

        try {
            const res = await shiftsAPI.open(payload)
            activeShift.value = res.data.data || res.data
            await fetchXReport(activeShift.value.id)
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Smena muvaffaqiyatli ochildi',
                life: 3000
            })
            return true
        } catch (error) {
            const errData = error.response?.data
            let detail = "Smenani ochib bo'lmadi"
            if (errData) {
                if (errData.error) detail = errData.error
                else if (errData.detail) detail = errData.detail
                else if (errData.message) detail = errData.message
                else if (typeof errData === 'object') {
                    const firstKey = Object.keys(errData)[0]
                    if (firstKey && errData[firstKey]) {
                        const val = errData[firstKey]
                        detail = Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : detail)
                    }
                } else if (typeof errData === 'string') {
                    detail = errData
                }
            }

            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail,
                life: 5000
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
            // cash_counted -> cash_end (backend talabi)
            await shiftsAPI.close(activeShift.value.id, {
                cash_end: cashCounted
            })
            activeShift.value = null
            activeXReport.value = null
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Smena muvaffaqiyatli yopildi',
                life: 3000
            })
            return true
        } catch (error) {
            const errData = error.response?.data
            let detail = "Smenani yopib bo'lmadi"
            if (errData) {
                if (errData.error) detail = errData.error
                else if (errData.detail) detail = errData.detail
                else if (errData.message) detail = errData.message
                else if (typeof errData === 'object') {
                    const firstKey = Object.keys(errData)[0]
                    if (firstKey && errData[firstKey]) {
                        const val = errData[firstKey]
                        detail = Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : detail)
                    }
                } else if (typeof errData === 'string') {
                    detail = errData
                }
            }

            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail,
                life: 5000
            })
            return false
        } finally {
            posLoading.value = false
        }
    }

    return {
        activeShift,
        activeXReport,
        shiftLoading,
        posLoading,
        fetchShiftStatus,
        fetchXReport,
        openShift,
        closeShift
    }
}


