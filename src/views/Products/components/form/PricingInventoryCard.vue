<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="flex items-center gap-2.5 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800">
      <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
        <i class="pi pi-wallet text-blue-500 text-xs"></i>
      </div>
      <h2 class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{{ $t('products.form.pricing') }} & {{ $t('products.form.inventory') }}</h2>
    </div>

    <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.purchase_price') }}</label>
          <div class="relative">
            <input
              :value="modelValue.purchase_price"
              @input="$emit('update:modelValue', { ...modelValue, purchase_price: Number($event.target.value) })"
              type="number"
              placeholder="0"
              class="w-full h-10 px-4 pr-11 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
            />
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">UZS</span>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.sale_price') }}</label>
          <div class="relative">
            <input
              :value="modelValue.sale_price"
              @input="$emit('update:modelValue', { ...modelValue, sale_price: Number($event.target.value) })"
              type="number"
              placeholder="0"
              class="w-full h-10 px-4 pr-11 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
            />
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-500">UZS</span>
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.unit') }}</label>
          <div class="relative">
            <select
              :value="modelValue.unit"
              @change="$emit('update:modelValue', { ...modelValue, unit: $event.target.value })"
              class="w-full h-10 px-3 pr-8 rounded-xl text-[11px] sm:text-xs font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
            >
              <option v-for="u in units" :key="u" :value="u">{{ $t('units.' + u) }}</option>
            </select>
            <i class="pi pi-angle-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.amount') }}</label>
          <input
            :value="modelValue.amount"
            @input="$emit('update:modelValue', { ...modelValue, amount: Number($event.target.value) })"
            type="number"
            min="0"
            placeholder="0"
            class="w-full h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.min_limit') }}</label>
          <input
            :value="modelValue.lowStockThreshold"
            @input="$emit('update:modelValue', { ...modelValue, lowStockThreshold: Number($event.target.value) })"
            type="number"
            min="0"
            placeholder="10"
            class="w-full h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
          />
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
