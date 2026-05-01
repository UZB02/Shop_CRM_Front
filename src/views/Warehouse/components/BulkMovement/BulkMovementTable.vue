<template>
  <div class="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-w-0">
    
    <!-- Table Header Control -->
    <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/40">
      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-widest">{{ $t('warehouse.bulk.products_list') }}</h4>
      </div>
      <button 
        @click="$emit('add')"
        class="h-9 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all flex items-center gap-2 text-[12px] font-black tracking-widest"
      >
        <i class="pi pi-plus text-[11px]"></i>
        {{ $t('warehouse.bulk.add_row') }}
      </button>
    </div>

    <!-- Real Compact Scrollable Table -->
    <div class="flex-1 overflow-auto relative custom-scrollbar">
      <table class="w-full text-left border-collapse table-fixed">
        <thead>
          <tr class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <th class="px-6 py-4 text-[12px] font-black text-slate-400 tracking-widest w-[45%]">{{ $t('warehouse.bulk.col_product') }}</th>
            <th class="px-4 py-4 text-[12px] font-black text-slate-400 tracking-widest text-center w-36">{{ $t('warehouse.bulk.col_quantity') }}</th>
            <th v-if="movementType === 'in'" class="px-4 py-4 text-[12px] font-black text-slate-400 tracking-widest text-right w-48">{{ $t('warehouse.bulk.col_price') }}</th>
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
                dataKey="id"
                filter
                :loading="loadingProducts"
                @filter="onProductFilter"
                :placeholder="$t('warehouse.bulk.product_ph')"
                class="!w-full !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !h-11 !text-[15px] !shadow-none"
                panelClass="!rounded-xl !shadow-2xl"
                pt:label:class="!flex !items-center !py-0 !h-full"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <span class="text-[15px] font-bold text-slate-700 dark:text-slate-100 truncate max-w-[200px]">
                      {{ slotProps.value.name }}
                    </span>
                    <TurBadge :tur-name="slotProps.value.tur_name" :tur-color="slotProps.value.tur_color" />
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
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[14px] font-black text-slate-700 dark:text-slate-200 truncate leading-tight">{{ slotProps.option.name }}</span>
                        <TurBadge :tur-name="slotProps.option.tur_name" :tur-color="slotProps.option.tur_color" />
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-[11px] font-bold text-slate-400 tracking-widest italic opacity-60">{{ slotProps.option.barcode || $t('warehouse.bulk.no_barcode') }}</span>
                        <span v-if="slotProps.option.category_name" class="text-[11px] font-bold text-slate-300 dark:text-slate-600 tracking-widest truncate before:content-['•'] before:mr-1.5">
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
                inputClass="!rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !px-3 font-black !text-[15px] !text-center outline-none focus:!border-emerald-500"
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
                inputClass="!rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !px-3 font-black !text-[15px] !text-right outline-none focus:!border-emerald-500"
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
                class="text-[12px] font-black text-slate-400 hover:text-blue-500 transition-colors tracking-[0.2em]"
              >
                <i class="pi pi-plus-circle mr-2"></i>
                {{ $t('warehouse.bulk.new_product_tip') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-[12px] font-bold text-slate-400 tracking-widest">
        <span>{{ $t('warehouse.bulk.enter_to_add') }}</span>
        <span>{{ $t('warehouse.bulk.total_ready', { count: validCount }) }}</span>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import TurBadge from '@/components/common/TurBadge.vue'

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
</script>


