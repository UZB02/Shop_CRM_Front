import { ref } from 'vue'
import { salesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useCheckout() {
    const toast = useToast()
    const { t } = useI18n()

    const posLoading = ref(false)

    /**
     * Savdoni yakunlash
     * @param {Object} paymentData - To'lov ma'lumotlari
     * @param {Array}  cartItems   - Savat mahsulotlari
     * @param {Object|null} customer - Tanlangan mijoz
     * @param {Function} onSuccess  - Muvaffaqiyatli callback
     */
    const performCheckout = async (paymentData, cartItems, customer, onSuccess) => {
        if (!cartItems.length) return null

        posLoading.value = true
        try {
            const payload = {
                customer: customer?.id || null,
                items: cartItems.map(item => ({
                    product: item.id,
                    quantity: parseFloat(item.qty) || 1,
                    unit_price: parseFloat(item.sale_price || item.price) || 0,
                    ...(item.item_discount_pct > 0 && {
                        original_price: parseFloat(item.original_sale_price || item.sale_price || item.price) || 0,
                        item_discount_pct: parseFloat(item.item_discount_pct) || 0
                    })
                })),
                payment_type: paymentData.payment_type,
                paid_amount: paymentData.paid_amount,
                description: paymentData.description || ''
            }

            // discount_amount faqat 0 dan katta bo'lsa yuboriladi
            if ((paymentData.discount_amount || 0) > 0) {
                payload.discount_amount = paymentData.discount_amount
            }

            // To'lov turiga qarab amount maydonlarini qo'shish
            if (paymentData.payment_type === 'mixed') {
                payload.cash_amount = paymentData.cash_amount
                payload.card_amount = paymentData.card_amount
            } else if (paymentData.payment_type === 'card') {
                payload.card_amount = paymentData.paid_amount
            } else if (paymentData.payment_type === 'cash') {
                payload.cash_amount = paymentData.paid_amount
            } else if (paymentData.payment_type === 'debt') {
                payload.cash_amount = paymentData.cash_amount
                payload.card_amount = paymentData.card_amount
            }

            console.log('🛒 CHECKOUT PAYLOAD (POST /sales/):', JSON.stringify(payload, null, 2))
            const res = await salesAPI.create(payload)

            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Savdo muvaffaqiyatli yakunlandi',
                life: 3000
            })

            if (typeof onSuccess === 'function') onSuccess()

            return res.data?.data || res.data
        } catch (error) {
            const errData = error.response?.data
            let detail = 'Savdoni yakunlashda xatolik'

            if (errData) {
                if (errData.detail) detail = errData.detail
                else if (errData.message) detail = errData.message
                else if (errData.error) detail = errData.error
                else if (typeof errData === 'object') {
                    const fields = Object.keys(errData)
                    if (fields.length > 0) {
                        const firstField = fields[0]
                        let fieldError = errData[firstField]
                        if (Array.isArray(fieldError)) fieldError = fieldError[0]
                        if (typeof fieldError === 'object' && fieldError !== null) {
                            const subFields = Object.keys(fieldError)
                            if (subFields.length > 0) {
                                let subVal = fieldError[subFields[0]]
                                if (Array.isArray(subVal)) subVal = subVal[0]
                                fieldError = subVal
                            }
                        }
                        detail = typeof fieldError === 'string' ? fieldError : `${firstField} xatoligi`
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
            return null
        } finally {
            posLoading.value = false
        }
    }

    const downloadReceipt = async (saleId) => {
        try {
            const res = await salesAPI.getReceipt(saleId)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `receipt-${saleId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error downloading receipt:', error)
            toast.add({
                severity: 'error',
                summary: 'Xatolik',
                detail: "Chekni yuklab bo'lmadi",
                life: 3000
            })
        }
    }

    return {
        posLoading,
        performCheckout,
        downloadReceipt
    }
}
