/**
 * usePOS — Asosiy POS composable
 *
 * Bu fayl uchta mustaqil composable ni birlashtiradi:
 *  - useShift   → Smena boshqaruvi
 *  - useCart    → Savat, multi-order va mijozlar
 *  - useCheckout → Savdoni yakunlash va chek yuklab olish
 *
 * Yangi logika qo'shilganda tegishli composable faylga kiriting.
 */

import { useShift }    from '@/composables/pos/useShift'
import { useCart }     from '@/composables/pos/useCart'
import { useCheckout } from '@/composables/pos/useCheckout'

export function usePOS() {
    const shift    = useShift()
    const cart     = useCart()
    const checkout = useCheckout()

    // performCheckout wrapper — cart va customer ma'lumotlarini
    // avtomatik uzatib, muvaffaqiyatda aktiv orderni olib tashlaydi
    const performCheckout = async (paymentData) => {
        return checkout.performCheckout(
            paymentData,
            cart.cart.value,
            cart.selectedCustomer.value,
            () => {
                const idx = cart.activeOrderIndex.value
                cart.removeOrder(idx)
            }
        )
    }

    return {
        // --- Shift ---
        activeShift:      shift.activeShift,
        shiftLoading:     shift.shiftLoading,
        fetchShiftStatus: shift.fetchShiftStatus,
        openShift:        shift.openShift,
        closeShift:       shift.closeShift,

        // --- Cart / Orders ---
        orders:             cart.orders,
        activeOrderIndex:   cart.activeOrderIndex,
        cart:               cart.cart,
        discountAmount:     cart.discountAmount,
        selectedCustomer:   cart.selectedCustomer,
        customers:          cart.customers,
        customerGroups:     cart.customerGroups,
        cartTotals:         cart.cartTotals,
        createNewOrder:     cart.createNewOrder,
        switchOrder:        cart.switchOrder,
        removeOrder:        cart.removeOrder,
        addToCart:          cart.addToCart,
        removeFromCart:     cart.removeFromCart,
        updateQty:          cart.updateQty,
        updateItemDiscount: cart.updateItemDiscount,
        clearCart:          cart.clearCart,
        scanAndAdd:         cart.scanAndAdd,
        fetchCustomers:     cart.fetchCustomers,
        fetchCustomerGroups:cart.fetchCustomerGroups,

        // --- Checkout ---
        posLoading:      checkout.posLoading,
        performCheckout,
        downloadReceipt: checkout.downloadReceipt,
    }
}
