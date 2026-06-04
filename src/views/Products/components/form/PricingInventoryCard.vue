<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
        <i class="pi pi-wallet text-white text-[12px]"></i>
      </div>
      <div>
        <h2 class="text-[12px] font-black tracking-widest text-slate-800 dark:text-slate-100">{{ $t('products.form.pricing_inventory') }}</h2>
      </div>
    </div>

    <div class="p-6 space-y-6 overflow-y-auto">
      <!-- Currency Selection -->
      <div class="flex flex-col gap-2 pb-2">
        <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.currency') }}</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="curr in currencies" 
            :key="curr.id"
            type="button"
            @click="$emit('update:modelValue', { ...modelValue, price_currency: curr.id })"
            class="flex-1 h-10 rounded-xl text-[12px] font-black transition-all border flex items-center justify-center gap-2"
            :class="modelValue.price_currency === curr.id 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50'"
          >
            <span>{{ curr.name }}</span>
            <span class="opacity-50 text-[10px]">{{ curr.symbol }}</span>
          </button>
        </div>
      </div>

      <!-- Pricing Grid -->
      <div class="grid grid-cols-1 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.sale_price') }}</label>
          <div class="relative group">
            <input
              :value="formatPrice(modelValue.sale_price)"
              @input="handlePriceInput"
              type="text"
              inputmode="numeric"
              placeholder="0"
              class="w-full h-11 px-4 pr-14 rounded-xl text-[14px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono shadow-sm"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded shadow-lg shadow-emerald-500/20 ">{{ $t('products.form.sale_label') }}</span>
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-50 dark:bg-slate-800/50"></div>

      <!-- Inventory Grid -->
      <div class="grid grid-cols-1 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.unit') }}</label>
          <div class="relative group">
            <Select
              :modelValue="modelValue.unit"
              @update:modelValue="$emit('update:modelValue', { ...modelValue, unit: $event })"
              :options="units"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              pt:root:class="!h-11 !rounded-xl !border-[1.5px] !border-slate-200 dark:!border-slate-700/60 !bg-slate-50 dark:!bg-slate-800/40 !shadow-none focus:!border-emerald-500 focus:!ring-4 focus:!ring-emerald-500/10 !transition-all !duration-300"
              pt:label:class="!text-[12px] !font-black !!tracking-widest !text-slate-700 dark:!text-slate-200 !py-0 !flex !items-center !h-full"
            >
              <template #value="slotProps">
                <span v-if="slotProps.value" class="text-[12px] font-black tracking-widest text-slate-700 dark:text-slate-200">
                  {{ $t('units.' + slotProps.value) }}
                </span>
                <span v-else class="text-[12px] text-slate-400 font-medium italic lowercase tracking-normal">{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <span class="text-[12px] font-black tracking-widest">{{ $t('units.' + slotProps.option.value) }}</span>
              </template>
            </Select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'

const props = defineProps({
  modelValue: Object,
  units: Array,
  currencies: Array
})

const emit = defineEmits(['update:modelValue'])

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return ''
  return value.toString().replace(/\s/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const handlePriceInput = (event) => {
  let rawStr = event.target.value.replace(/\s/g, '')
  rawStr = rawStr.replace(/[^\d]/g, '')
  
  const numValue = rawStr ? Number(rawStr) : null
  
  emit('update:modelValue', { ...props.modelValue, sale_price: numValue })
  event.target.value = formatPrice(rawStr)
}
</script>


