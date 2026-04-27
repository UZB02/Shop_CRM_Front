<template>
  <div class="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-w-0">
    
    <!-- Table Header Control -->
    <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/40">
      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{{ $t('warehouse.bulk.products_list') }}</h4>
      </div>
      <button 
        @click="$emit('add')"
        class="h-9 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
      >
        <i class="pi pi-plus text-[9px]"></i>
        {{ $t('warehouse.bulk.add_row') }}
      </button>
    </div>

    <!-- Real Compact Scrollable Table -->
    <div class="flex-1 overflow-auto relative custom-scrollbar">
      <table class="w-full text-left border-collapse table-fixed">
        <thead>
          <tr class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[45%]">{{ $t('warehouse.bulk.col_product') }}</th>
            <th class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-36">{{ $t('warehouse.bulk.col_quantity') }}</th>
            <th v-if="movementType === 'in'" class="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-48">{{ $t('warehouse.bulk.col_price') }}</th>
            <th class="px-6 py-4 w-16 text-center"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <tr v-for="(item, index) in items" :key="index" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200">
            <td class="px-6 py-3">
  <Select
    v-model="item.product"
    :options="products"
    optionLabel="name"
    filter
    :loading="loadingProducts"
    @filter="onProductFilter"
    :placeholder="$t('warehouse.bulk.product_ph')"
    class="!w-full !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !h-11 !text-[13px] !shadow-none"
    panelClass="!rounded-xl !shadow-2xl"
  >
<template #value="slotProps">
  <div v-if="slotProps.value" class="flex items-center gap-2">
    <span class="text-[13px] font-bold text-slate-700 dark:text-slate-100 truncate max-w-[200px]">
      {{ getProductLabel(slotProps.value) }}
    </span>
    <template v-if="getSelectedProduct(slotProps.value)?.has_tur">
       <span class="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-widest shrink-0">
          {{ getSelectedProduct(slotProps.value)?.tur_name }}
       </span>
       <span v-if="getSelectedProduct(slotProps.value)?.tur_color" class="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-widest shrink-0">
          {{ getSelectedProduct(slotProps.value)?.tur_color }}
       </span>
    </template>
  </div>
  <span v-else class="text-slate-400 opacity-60">{{ $t('warehouse.bulk.product_ph') }}</span>
</template>

<template #option="slotProps">
  <div class="flex items-center gap-3 py-1.5">
    <div class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-105">
      <img v-if="slotProps.option.image" :src="slotProps.option.image" class="w-full h-full object-cover" />
      <i v-else class="pi pi-image text-slate-200 dark:text-slate-600 text-sm"></i>
    </div>
    <div class="flex flex-col min-w-0 flex-1">
      <div class="flex items-center flex-wrap gap-2">
        <span class="text-[12px] font-black text-slate-700 dark:text-slate-200 truncate leading-tight">{{ slotProps.option.name }}</span>
        <div v-if="slotProps.option.has_tur" class="flex items-center gap-1">
          <span class="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 uppercase tracking-widest leading-none">
            {{ slotProps.option.tur_name }}
          </span>
          <span v-if="slotProps.option.tur_color" class="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-slate-50/50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 uppercase tracking-widest leading-none">
            {{ slotProps.option.tur_color }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">{{ slotProps.option.barcode || $t('warehouse.bulk.no_barcode') }}</span>
        <span v-if="slotProps.option.category_name" class="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest truncate before:content-['•'] before:mr-1.5">
          {{ slotProps.option.category_name }}
        </span>
      </div>
    </div>
  </div>
</template>
              </Select>
            </td>
            <td class="px-4 py-3">
              <InputNumber 
                v-model="item.quantity" 
                mode="decimal" 
                :minFractionDigits="0" 
                placeholder="0"
                class="w-full h-11"
                inputClass="!rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !px-3 font-black !text-[13px] !text-center outline-none focus:!border-emerald-500"
              />
            </td>
            <td v-if="movementType === 'in'" class="px-4 py-3">
              <InputNumber 
                v-model="item.unit_cost" 
                mode="currency" 
                currency="UZS" 
                locale="uz-UZ"
                placeholder="0"
                class="w-full h-11"
                inputClass="!rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !px-3 font-black !text-[13px] !text-right uppercase outline-none focus:!border-emerald-500"
              />
            </td>
            <td class="px-6 py-3 text-center">
              <button 
                @click="$emit('remove', index)"
                v-if="items.length > 1"
                class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all border border-transparent"
              >
                <i class="pi pi-trash text-xs"></i>
              </button>
            </td>
          </tr>
          <!-- Empty Row Footer trigger -->
          <tr v-if="items.length < 5" class="bg-slate-50/20 dark:bg-slate-900/10">
            <td colspan="4" class="px-6 py-10 text-center">
              <button 
                @click="$emit('add')"
                class="text-[10px] font-black text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-[0.2em]"
              >
                <i class="pi pi-plus-circle mr-2"></i>
                {{ $t('warehouse.bulk.new_product_tip') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>{{ $t('warehouse.bulk.enter_to_add') }}</span>
        <span>{{ $t('warehouse.bulk.total_ready', { count: validCount }) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  items: Array,
  products: Array,
  loadingProducts: Boolean,
  movementType: String,
  validCount: Number
})

const emit = defineEmits(['add', 'remove', 'search'])

let searchTimeout = null
const onProductFilter = (event) => {
  const query = event.value
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', query)
  }, 400)
}

// Helper to find the product object from the list
const getSelectedProduct = (val) => {
  if (!val) return null
  // If val is an object (new behavior)
  if (typeof val === 'object') return val
  // Fallback for ID (old behavior)
  return props.products.find(p => p.id === val)
}

// Helper to get formatted label for the selected value
const getProductLabel = (val) => {
  const p = getSelectedProduct(val)
  return p ? p.name : ''
}
</script>
