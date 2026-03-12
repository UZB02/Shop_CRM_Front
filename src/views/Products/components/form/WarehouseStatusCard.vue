<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden shrink-0">
    <div class="p-6 space-y-5 text-left">
      <div class="flex flex-col gap-2">
        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.warehouse') }}</label>
        <Select
          :modelValue="modelValue.warehouse"
          @update:modelValue="$emit('update:modelValue', { ...modelValue, warehouse: $event })"
          :options="warehouses"
          optionLabel="name"
          :optionValue="(o) => o._id || o.id"
          :placeholder="$t('products.warehouse_placeholder')"
          class="w-full h-11"
          pt:root:class="!h-11 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800/40 !shadow-sm focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500"
          pt:label:class="!text-[11px] !font-bold !text-slate-700 dark:!text-white !flex !items-center !px-4"
        />
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 transition-all group">
        <div class="flex flex-col">
          <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">{{ $t('products.form.status') }}</span>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Faol</span>
        </div>
        <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {{ $t('products.form.active') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'

defineProps({
  modelValue: Object,
  warehouses: Array
})

defineEmits(['update:modelValue'])
</script>
