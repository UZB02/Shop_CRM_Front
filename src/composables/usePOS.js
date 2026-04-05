import { ref, computed, watch } from 'vue'
import { shiftsAPI, salesAPI, customersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function usePOS() {
    const toast = useToast()
    const { t } = useI18n()

    // --- State ---
    const activeShift = ref(null)
    const shiftLoading = ref(false)
    const posLoading = ref(false)

    // --- Multi-Order State ---
    const orders = ref([
        { id: Date.now(), name: 'Savat 1', cart: [], selectedCustomer: null, discountAmount: 0 }
    ])
    const activeOrderIndex = ref(0)

    const activeOrder = computed(() => orders.value[activeOrderIndex.value])
    
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
        try {
            const res = await shiftsAPI.getAll({ status: 'open', limit: 1 })
            const openShifts = res.data.results || res.data
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
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.detail || 'Smenani ochishda xatolik',
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
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.detail || 'Smenani yopishda xatolik',
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
            cart.value.push({
                ...product,
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
                shift: activeShift.value?.id,
                customer: selectedCustomer.value?.id || null,
                items: cart.value.map(item => ({
                    product: item.id,
                    quantity: item.qty,
                    price: item.sale_price || item.price,
                    item_discount_pct: item.item_discount_pct || 0
                })),
                discount_amount: discountAmount.value || 0,
                payment_type: paymentData.payment_type,
                paid_amount: paymentData.paid_amount,
                note: paymentData.note || ''
            }

            if (paymentData.payment_type === 'mixed') {
                payload.cash_amount = paymentData.cash_amount
                payload.card_amount = paymentData.card_amount
            }

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
            
            return res.data
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.detail || 'Savdoni yakunlashda xatolik',
                life: 3000
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
