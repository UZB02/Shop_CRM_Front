<template>
  <div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
    <!-- Catalog Component -->
    <PosCatalog 
      :products="filteredProducts" 
      v-model:searchQuery="searchQuery"
      @add-to-cart="addToCart"
      @focus-barcode="focusBarcode"
    />

    <!-- Cart Component -->
    <PosCart 
      :cart="cart"
      :customers="customers"
      v-model:selectedCustomer="selectedCustomer"
      :totalQty="totalQty"
      :totalPrice="totalPrice"
      @update-qty="updateQty"
      @clear-cart="cart = []"
      @checkout="checkout"
    />

    <!-- Receipt Component -->
    <PosReceipt 
      v-model:visible="showReceipt"
      :transaction="lastTransaction"
      @close="closeReceipt"
      @print="printReceipt"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PosCatalog from './components/PosCatalog.vue'
import PosCart from './components/PosCart.vue'
import PosReceipt from './components/PosReceipt.vue'

const searchQuery = ref('')
const cart = ref([])
const selectedCustomer = ref(null)
const showReceipt = ref(false)
const lastTransaction = ref(null)

const customers = ref([
  { id: 1, name: "Olim G'aniyev", phone: "+998 90 123 45 67" },
  { id: 2, name: "Mijoz #241", phone: "+998 93 987 65 43" },
  { id: 3, name: "Azizbek Karimov", phone: "+998 99 555 11 22" },
])

const products = ref([
  { id: 1, name: "iPhone 15 Pro", category: "Smartfonlar", barcode: "123456789", amount: 15, unit: "dona", price: 14500000 },
  { id: 2, name: "Samsung Galaxy S24", category: "Smartfonlar", barcode: "987654321", amount: 5, unit: "dona", price: 11200000 },
  { id: 3, name: "MacBook Air M2", category: "Noutbuklar", barcode: "789456123", amount: 8, unit: "dona", price: 15600000 },
  { id: 4, name: "Logitech MX Master 3", category: "Aksessuarlar", barcode: "456123789", amount: 42, unit: "dona", price: 1200000 },
  { id: 5, name: "AirPods Pro 2", category: "Aksessuarlar", barcode: "111222333", amount: 20, unit: "dona", price: 3200000 },
  { id: 6, name: "iPad Pro 11", category: "Planshetlar", barcode: "444555666", amount: 12, unit: "dona", price: 12500000 },
])

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(q) || p.barcode.includes(q))
})

const addToCart = (product) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }
}

const updateQty = (index, delta) => {
  const item = cart.value[index]
  item.qty += delta
  if (item.qty <= 0) {
    cart.value.splice(index, 1)
  }
}

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0))
const totalQty = computed(() => cart.value.reduce((acc, item) => acc + item.qty, 0))

const checkout = () => {
  const customerName = selectedCustomer.value ? selectedCustomer.value.name : 'Noma\'lum mijoz'
  
  lastTransaction.value = {
    id: 'TR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleString(),
    customer: customerName,
    items: [...cart.value],
    total: totalPrice.value
  }

  showReceipt.value = true
  cart.value = []
  selectedCustomer.value = null
}

const printReceipt = () => {
  window.print()
}

const closeReceipt = () => {
  showReceipt.value = false
  lastTransaction.value = null
}

const focusBarcode = () => {
  alert("Barcode skanerlash rejimiga o'tildi (Mock)")
}
</script>
