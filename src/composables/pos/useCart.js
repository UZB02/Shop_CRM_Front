import { ref, computed, watch } from 'vue'
import { salesAPI, customersAPI, customerGroupsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

export function useCart() {
    const toast = useToast()

    // --- Multi-Order State & Persistence ---
    const savedOrders = localStorage.getItem('pos_orders')
    const orders = ref(
        savedOrders
            ? JSON.parse(savedOrders)
            : [{ id: Date.now(), name: 'Savat 1', cart: [], selectedCustomer: null, discountAmount: 0 }]
    )

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

    // Computed aliases for backward compatibility
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
    const customerGroups = ref([])

    const fetchCustomerGroups = async () => {
        try {
            const res = await customerGroupsAPI.getAll()
            customerGroups.value = res.data.results || res.data
        } catch (error) {
            console.error('Error fetching customer groups:', error)
        }
    }

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
            clearCart()
            return
        }
        orders.value.splice(index, 1)
        if (activeOrderIndex.value >= orders.value.length) {
            activeOrderIndex.value = orders.value.length - 1
        }
    }

    // --- Cart CRUD ---
    const addToCart = (product) => {
        const existing = cart.value.find(item => item.id === product.id)
        if (existing) {
            if (existing.quantity === undefined || existing.qty < existing.quantity) {
                existing.qty++
            } else {
                toast.add({
                    severity: 'warn',
                    summary: 'Limit',
                    detail: 'Omborda yetarli mahsulot yo\'q',
                    life: 2000
                })
            }
        } else {
            const effectivePrice = product.active_promotion?.discounted_price || product.sale_price || product.price || 0
            cart.value.push({
                ...product,
                sale_price: effectivePrice,
                original_sale_price: product.sale_price,
                qty: 1,
                item_discount_pct: 0
            })
        }
    }

    const removeFromCart = (productId) => {
        const index = cart.value.findIndex(item => item.id === productId)
        if (index !== -1) cart.value.splice(index, 1)
    }

    const updateQty = (productId, qty) => {
        const item = cart.value.find(item => item.id === productId)
        if (item) {
            let newQty = Math.max(0, qty)
            if (item.quantity !== undefined && newQty > item.quantity) {
                newQty = item.quantity
                toast.add({
                    severity: 'warn',
                    summary: 'Limit',
                    detail: `Omborda faqat ${item.quantity} dona mavjud`,
                    life: 2000
                })
            }
            item.qty = newQty
        }
    }

    const updateItemDiscount = (productId, pct) => {
        const item = cart.value.find(item => item.id === productId)
        if (item) item.item_discount_pct = Math.min(100, Math.max(0, pct))
    }

    const clearCart = () => {
        activeOrder.value.cart = []
        activeOrder.value.discountAmount = 0
        activeOrder.value.selectedCustomer = null
    }

    // --- Barcode Scan ---
    const posLoading = ref(false)

    const scanAndAdd = async (barcode) => {
        if (!barcode) return
        posLoading.value = true
        try {
            const res = await salesAPI.scanProduct(barcode)
            if (res.data) {
                addToCart(res.data)
                return true
            }
        } catch {
            toast.add({
                severity: 'warn',
                summary: 'Topilmadi',
                detail: "Mahsulot topilmadi yoki omborda yo'q",
                life: 2000
            })
        } finally {
            posLoading.value = false
        }
    }

    // --- Totals ---
    const cartTotals = computed(() => {
        let subtotal = 0
        let itemsDiscountTotal = 0
        
        // Determine cart currency
        let dominantCurrency = null
        let isMixed = false

        cart.value.forEach(item => {
            const price = item.sale_price || item.price || 0
            const itemTotal = price * item.qty
            const discount = (itemTotal * (item.item_discount_pct || 0)) / 100
            subtotal += itemTotal
            itemsDiscountTotal += discount
            
            const itemCurr = item.currency_code || item.currency
            if (itemCurr) {
                if (dominantCurrency === null) {
                    dominantCurrency = itemCurr
                } else if (dominantCurrency !== itemCurr) {
                    isMixed = true
                }
            }
        })

        const totalAfterItemsDiscount = subtotal - itemsDiscountTotal
        const finalTotal = Math.max(0, totalAfterItemsDiscount - (discountAmount.value || 0))

        return {
            subtotal,
            itemsDiscountTotal,
            globalDiscount: discountAmount.value || 0,
            totalDiscount: itemsDiscountTotal + (discountAmount.value || 0),
            finalTotal,
            totalQty: cart.value.reduce((acc, item) => acc + item.qty, 0),
            currency: isMixed ? null : dominantCurrency
        }
    })

    // --- Customer ---
    const fetchCustomers = async (query = '') => {
        try {
            const res = await customersAPI.getAll({ search: query, limit: 20 })
            customers.value = res.data.results || res.data
        } catch (error) {
            console.error('Error fetching customers:', error)
        }
    }

    return {
        orders,
        activeOrderIndex,
        activeOrder,
        cart,
        selectedCustomer,
        discountAmount,
        customers,
        customerGroups,
        cartTotals,
        posLoading,
        createNewOrder,
        switchOrder,
        removeOrder,
        addToCart,
        removeFromCart,
        updateQty,
        updateItemDiscount,
        clearCart,
        scanAndAdd,
        fetchCustomers,
        fetchCustomerGroups
    }
}
