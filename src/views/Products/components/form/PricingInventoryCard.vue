<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="flex items-center gap-3 px-7 py-5 border-b border-slate-100 dark:border-slate-800">
      <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
        <i class="pi pi-wallet text-blue-500 text-sm"></i>
      </div>
      <h2 class="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{{ $t('products.form.pricing') }} & {{ $t('products.form.inventory') }}</h2>
    </div>

    <div class="p-7 space-y-6">
      <div class="grid grid-cols-2 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.purchase_price') }}</label>
          <div class="relative">
            <input
              :value="modelValue.purchase_price"
              @input="$emit('update:modelValue', { ...modelValue, purchase_price: Number($event.target.value) })"
              type="number"
              placeholder="0"
              class="w-full h-11 px-4 pr-12 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">UZS</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.sale_price') }}</label>
          <div class="relative">
            <input
              :value="modelValue.sale_price"
              @input="$emit('update:modelValue', { ...modelValue, sale_price: Number($event.target.value) })"
              type="number"
              placeholder="0"
              class="w-full h-11 px-4 pr-12 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-500">UZS</span>
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

      <div class="grid grid-cols-3 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.unit') }}</label>
          <div class="relative">
            <select
              :value="modelValue.unit"
              @change="$emit('update:modelValue', { ...modelValue, unit: $event.target.value })"
              class="w-full h-11 px-4 pr-9 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
            >
              <option v-for="u in units" :key="u" :value="u">{{ $t('units.' + u) }}</option>
            </select>
            <i class="pi pi-angle-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"></i>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.amount') }}</label>
          <input
            :value="modelValue.amount"
            @input="$emit('update:modelValue', { ...modelValue, amount: Number($event.target.value) })"
            type="number"
            min="0"
            placeholder="0"
            class="w-full h-11 px-4 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.min_limit') }}</label>
          <input
            :value="modelValue.lowStockThreshold"
            @input="$emit('update:modelValue', { ...modelValue, lowStockThreshold: Number($event.target.value) })"
            type="number"
            min="0"
            placeholder="10"
            class="w-full h-11 px-4 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
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
