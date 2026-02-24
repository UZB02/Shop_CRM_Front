<template>
  <div class="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
    <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
      <h2 class="font-bold text-lg">Savatcha</h2>
      <Button icon="pi pi-trash" text severity="danger" v-if="cart.length > 0" @click="$emit('clear-cart')" />
    </div>

    <div class="p-4 border-b border-slate-50 dark:border-slate-800 space-y-3">
      <label class="text-[10px] uppercase text-slate-400 font-bold ml-1">Mijozni tanlang</label>
      <Select 
        :model-value="selectedCustomer" 
        @update:model-value="$emit('update:selected-customer', $event)"
        :options="customers" 
        filter 
        optionLabel="name" 
        placeholder="Mijoz (Tanlanmagan)" 
        class="w-full rounded-xl"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-2">
            <i class="pi pi-user text-emerald-500"></i>
            <span>{{ slotProps.value.name }}</span>
          </div>
          <span v-else>{{ slotProps.placeholder }}</span>
        </template>
      </Select>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
        <i class="pi pi-shopping-bag text-5xl mb-4"></i>
        <p>Savatcha bo'sh</p>
      </div>

      <div v-for="(item, index) in cart" :key="index" class="flex gap-3 items-center">
        <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
          <i class="pi pi-box"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold truncate">{{ item.name }}</p>
          <p class="text-[10px] text-slate-500">{{ formatCurrency(item.price) }} x {{ item.qty }}</p>
        </div>
        <div class="flex items-center gap-2">
          <Button icon="pi pi-minus" text size="small" @click="$emit('update-qty', index, -1)" />
          <span class="text-sm font-bold w-4 text-center">{{ item.qty }}</span>
          <Button icon="pi pi-plus" text size="small" @click="$emit('update-qty', index, 1)" />
        </div>
      </div>
    </div>

    <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">Jami mahsulot:</span>
          <span>{{ totalQty }} ta</span>
        </div>
        <div class="flex justify-between text-lg font-bold">
          <span>Umumiy:</span>
          <span class="text-emerald-500">{{ formatCurrency(totalPrice) }}</span>
        </div>
      </div>

      <Button label="Sotuvni yakunlash" icon="pi pi-check" severity="success" class="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/20" 
              :disabled="cart.length === 0" @click="$emit('checkout')" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Select from 'primevue/select'

const props = defineProps({
  cart: Array,
  customers: Array,
  selectedCustomer: Object,
  totalQty: Number,
  totalPrice: Number
})

defineEmits(['update-qty', 'clear-cart', 'checkout', 'update:selected-customer'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>
