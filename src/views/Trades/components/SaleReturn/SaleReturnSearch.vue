<template>
  <div class="space-y-2">
    <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Mahsulotlarni qidirish</h3>
    <div class="relative group">
      <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
      <input 
        v-model="productQuery"
        type="text"
        placeholder="Nomi yoki barkodi bo'yicha..."
        class="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-white/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500/50 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400"
        @input="onSearchProducts"
      />
      <!-- Search Results Dropdown -->
      <div v-if="searchResults.length" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#131d31] rounded-[16px] shadow-xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
        <div 
          v-for="p in searchResults" 
          :key="p.id"
          @click="addProduct(p)"
          class="p-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer flex justify-between items-center transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
        >
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-800 dark:text-white">{{ p.name }}</span>
              <TurBadge :tur-name="p.tur_name" :tur-color="p.tur_color" />
            </div>
            <span class="text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Qoldiq: {{ p.quantity }} {{ p.unit }}</span>
          </div>
          <span class="text-[11px] font-black text-slate-900 dark:text-emerald-400">{{ formatCurrency(p.selling_price) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  query: String,
  searchResults: Array,
  formatCurrency: Function
})

const emit = defineEmits(['update:query', 'search', 'add'])

const productQuery = computed({
  get: () => props.query,
  set: (val) => emit('update:query', val)
})

const onSearchProducts = () => {
  emit('search')
}

const addProduct = (p) => {
  emit('add', p)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
