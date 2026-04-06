import { ref, computed, watch } from 'vue'
import { shiftsAPI, salesAPI, customersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'

export function usePOS() {
    const toast = useToast()
    const { t } = useI18n()
    const authStore = useAuthStore()

    // --- State ---
    const activeShift = ref(null)
    const shiftLoading = ref(false)
    const posLoading = ref(false)

    // --- Multi-Order State & Persistence ---
    const savedOrders = localStorage.getItem('pos_orders')
    const orders = ref(savedOrders ? JSON.parse(savedOrders) : [
        { id: Date.now(), name: 'Savat 1', cart: [], selectedCustomer: null, discountAmount: 0 }
    ])
    
    const savedActiveIndex = localStorage.getItem('pos_active_order_index')
    const activeOrderIndex = ref(savedActiveIndex ? parseInt(savedActiveIndex) : 0)

    // Sync to localStorage
    watch(orders, (newOrders) => {
        localStorage.setItem('pos_orders', JSON.stringify(newOrders))
    }, { deep: true })

    watch(activeOrderIndex, (newIndex) => {
        localStorage.setItem('pos_active_order_index', newIndex.toString())
    })

    const activeOrder = computed(() => orders.value[activeOrderIndex.value] || orders.value[0])
    
    // Computed aliases for backward compatibility with existing components
    const cart = computed({
        get: () => activeOrder.value.cart,
        set: (val) => { activeOrder.value.cart = val }
    })
    const selectedCustomer = computed({
        get: () => activeOrder.value.selectedCustomer,
        set: (val) => { activeOrder.value.selectedCustomer = val }
    })
    const discountAmount = computed({
        get: () => activeOrder.value.discountAmount,
        set: (val) => { activeOrder.value.discountAmount = val }
    })

    const customers = ref([])

    // --- Order Tab Management ---
    const createNewOrder = () => {
        const nextId = orders.value.length + 1
        orders.value.push({
            id: Date.now(),
            name: `Savat ${nextId}`,
            cart: [],
            selectedCustomer: null,
            discountAmount: 0
        })
        activeOrderIndex.value = orders.value.length - 1
    }

    const switchOrder = (index) => {
        if (index >= 0 && index < orders.value.length) {
            activeOrderIndex.value = index
        }
    }

    const removeOrder = (index) => {
        if (orders.value.length <= 1) {
            clearCart() // Just clear if it's the last one
            return
        }
        orders.value.splice(index, 1)
        if (activeOrderIndex.value >= orders.value.length) {
            activeOrderIndex.value = orders.value.length - 1
        }
    }
    
    // --- Shift Logic ---
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
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : 'Smenani ochishda xatolik')
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
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : 'Smenani yopishda xatolik')
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

    // --- Cart Logic ---
    const addToCart = (product) => {
        const existing = cart.value.find(item => item.id === product.id)
        if (existing) {
            existing.qty++
        } else {
            // Determine effective price: promotion price takes priority
            const effectivePrice = product.active_promotion?.discounted_price || product.sale_price || product.price || 0
            
            cart.value.push({
                ...product,
                sale_price: effectivePrice, // Override sale_price with promo price
                original_sale_price: product.sale_price, // Store original if needed
                qty: 1,
                item_discount_pct: 0
            })
        }
    }

    const removeFromCart = (productId) => {
        const index = cart.value.findIndex(item => item.id === productId)
        if (index !== -1) {
            cart.value.splice(index, 1)
        }
    }

    const updateQty = (productId, qty) => {
        const item = cart.value.find(item => item.id === productId)
        if (item) {
            item.qty = Math.max(1, qty)
        }
    }

    const updateItemDiscount = (productId, pct) => {
        const item = cart.value.find(item => item.id === productId)
        if (item) {
            item.item_discount_pct = Math.min(100, Math.max(0, pct))
        }
    }

    const scanAndAdd = async (barcode) => {
        if (!barcode) return
        posLoading.value = true
        try {
            const res = await salesAPI.scanProduct(barcode)
            if (res.data) {
                addToCart(res.data)
                return true
            }
        } catch (error) {
            toast.add({
                severity: 'warn',
                summary: 'Topilmadi',
                detail: 'Mahsulot topilmadi yoki omborda yo\'q',
                life: 2000
            })
        } finally {
            posLoading.value = false
        }
    }

    const clearCart = () => {
        activeOrder.value.cart = []
        activeOrder.value.discountAmount = 0
        activeOrder.value.selectedCustomer = null
    }

    // --- Totals ---
    const cartTotals = computed(() => {
        let subtotal = 0
        let itemsDiscountTotal = 0
        
        cart.value.forEach(item => {
            const price = item.sale_price || item.price || 0
            const itemTotal = price * item.qty
            const discount = (itemTotal * (item.item_discount_pct || 0)) / 100
            subtotal += itemTotal
            itemsDiscountTotal += discount
        })

        const totalAfterItemsDiscount = subtotal - itemsDiscountTotal
        const finalTotal = Math.max(0, totalAfterItemsDiscount - (discountAmount.value || 0))
        
        return {
            subtotal,
            itemsDiscountTotal,
            globalDiscount: discountAmount.value || 0,
            totalDiscount: itemsDiscountTotal + (discountAmount.value || 0),
            finalTotal,
            totalQty: cart.value.reduce((acc, item) => acc + item.qty, 0)
        }
    })

    // --- Customer Logic ---
    const fetchCustomers = async (query = '') => {
        try {
            const res = await customersAPI.getAll({ search: query, limit: 20 })
            customers.value = res.data.results || res.data
        } catch (error) {
            console.error('Error fetching customers:', error)
        }
    }

    // --- Checkout Logic ---
    const performCheckout = async (paymentData) => {
        if (!cart.value.length) return
        
        posLoading.value = true
        try {
            const payload = {
                customer: selectedCustomer.value?.id || null,
                items: cart.value.map(item => ({
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
                // Debt: qisman to'langan bo'lsa cash_amount yuboriladi
                if (paymentData.paid_amount > 0) {
                    payload.cash_amount = paymentData.paid_amount
                }
            }

            console.log('🛒 CHECKOUT PAYLOAD (POST /sales/):', JSON.stringify(payload, null, 2))
            const res = await salesAPI.create(payload)
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Savdo muvaffaqiyatli yakunlandi',
                life: 3000
            })
            
            // On successful checkout, remove the order and create/switch to another
            const indexToRemove = activeOrderIndex.value
            removeOrder(indexToRemove)
            
            return res.data?.data || res.data
        } catch (error) {
            const errData = error.response?.data
            let detail = 'Savdoni yakunlashda xatolik'
            
            if (errData) {
                if (errData.detail) detail = errData.detail
                else if (errData.message) detail = errData.message
                else if (errData.error) detail = errData.error // Add support for .error field
                else if (typeof errData === 'object') {
                    const fields = Object.keys(errData)
                    if (fields.length > 0) {
                        const firstField = fields[0]
                        let fieldError = errData[firstField]
                        if (Array.isArray(fieldError)) fieldError = fieldError[0]
                        
                        // Handle one more level of nested object if it's not a string yet
                        if (typeof fieldError === 'object' && fieldError !== null) {
                            const subFields = Object.keys(fieldError)
                            if (subFields.length > 0) {
                                let subVal = fieldError[subFields[0]]
                                if (Array.isArray(subVal)) subVal = subVal[0]
                                fieldError = subVal
                            }
                        }
                        
                        // Fallback to field name if message is still not a string
                        detail = typeof fieldError === 'string' ? fieldError : `${firstField} xatoligi`
                    }
                } else if (typeof errData === 'string') {
                    detail = errData
                }
            }

            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: detail,
                life: 5000 // Increased persistence for complex error messages
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
                detail: 'Chekni yuklab bo\'lmadi',
                life: 3000
            })
        }
    }

    return {
        activeShift,
        shiftLoading,
        posLoading,
        orders,
        activeOrderIndex,
        cart,
        discountAmount,
        selectedCustomer,
        customers,
        cartTotals,
        createNewOrder,
        switchOrder,
        removeOrder,
        fetchShiftStatus,
        openShift,
        closeShift,
        addToCart,
        removeFromCart,
        updateQty,
        updateItemDiscount,
        scanAndAdd,
        clearCart,
        fetchCustomers,
        performCheckout,
        downloadReceipt
    }
}
