<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
        <i class="pi pi-wallet text-white text-[10px]"></i>
      </div>
      <div>
        <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Narxlar va Ombor</h2>
      </div>
    </div>

    <div class="p-6 space-y-6 overflow-y-auto">
      <!-- Pricing Grid -->
      <div class="grid grid-cols-1 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.purchase_price') }}</label>
          <div class="relative group">
            <input
              :value="modelValue.purchase_price"
              @input="$emit('update:modelValue', { ...modelValue, purchase_price: Number($event.target.value) })"
              type="number"
              placeholder="0"
              class="w-full h-11 px-4 pr-14 rounded-xl text-[12px] font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono shadow-sm"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded">UZS</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.sale_price') }}</label>
          <div class="relative group">
            <input
              :value="modelValue.sale_price"
              @input="$emit('update:modelValue', { ...modelValue, sale_price: Number($event.target.value) })"
              type="number"
              placeholder="0"
              class="w-full h-11 px-4 pr-14 rounded-xl text-[12px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono shadow-sm"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded shadow-lg shadow-emerald-500/20 uppercase">Sale</span>
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-50 dark:bg-slate-800/50"></div>

      <!-- Inventory Grid -->
      <div class="grid grid-cols-2 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.unit') }}</label>
          <div class="relative group">
            <select
              :value="modelValue.unit"
              @change="$emit('update:modelValue', { ...modelValue, unit: $event.target.value })"
              class="w-full h-11 px-3 pr-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 outline-none appearance-none cursor-pointer"
            >
              <option v-for="u in units" :key="u" :value="u">{{ $t('units.' + u) }}</option>
            </select>
            <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none transition-colors"></i>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.amount') }}</label>
          <input
            :value="modelValue.amount"
            @input="$emit('update:modelValue', { ...modelValue, amount: Number($event.target.value) })"
            type="number"
            min="0"
            placeholder="0"
            class="w-full h-11 px-4 rounded-xl text-[12px] font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 outline-none font-mono shadow-sm"
          />
        </div>
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.min_limit') }}</label>
          <div class="relative group">
            <i class="pi pi-bell absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-xs"></i>
            <input
              :value="modelValue.lowStockThreshold"
              @input="$emit('update:modelValue', { ...modelValue, lowStockThreshold: Number($event.target.value) })"
              type="number"
              min="0"
              placeholder="10"
              class="w-full h-11 pl-11 pr-4 rounded-xl text-[12px] font-black text-rose-500 dark:text-rose-400 bg-rose-50/20 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 outline-none font-mono shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Object,
  units: Array
})

defineEmits(['update:modelValue'])
</script>
