<template>
  <div class="flex-1 flex flex-col gap-4 overflow-hidden">
    <div class="flex gap-4">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <InputText v-model="localSearchQuery" placeholder="Mahsulot nomi yoki barcode..." class="w-full pl-10" @input="$emit('update:searchQuery', localSearchQuery)" />
      </div>
      <Button icon="pi pi-barcode" severity="secondary" @click="$emit('focus-barcode')" />
    </div>

    <div class="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="product in products" :key="product.id" 
           class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer group flex flex-col h-full shadow-sm"
           @click="$emit('add-to-cart', product)">
        <div class="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl mb-3 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
          <i class="pi pi-box text-3xl"></i>
        </div>
        <h3 class="font-semibold text-sm line-clamp-2 mb-1">{{ product.name }}</h3>
        <p class="text-xs text-slate-400 mb-2">{{ product.barcode }}</p>
        <div class="mt-auto flex justify-between items-center">
          <span class="text-emerald-500 font-bold text-sm">{{ formatCurrency(product.price) }}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full" :class="product.amount > 10 ? 'bg-slate-100 text-slate-500' : 'bg-rose-100 text-rose-500'">
            {{ product.amount }} dona
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  products: Array,
  searchQuery: String
})

const emit = defineEmits(['add-to-cart', 'focus-barcode', 'update:searchQuery'])

const localSearchQuery = ref(props.searchQuery)

watch(() => props.searchQuery, (newVal) => {
  localSearchQuery.value = newVal
})

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>
