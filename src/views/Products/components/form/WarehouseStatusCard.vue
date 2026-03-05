<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800">
      <div class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
        <i class="pi pi-building text-amber-500 text-xs"></i>
      </div>
      <h2 class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{{ $t('products.form.warehouse') }} & {{ $t('products.form.status') }}</h2>
    </div>

    <div class="p-4 sm:p-5 space-y-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.warehouse') }}</label>
        <Select
          :modelValue="modelValue.warehouse"
          @update:modelValue="$emit('update:modelValue', { ...modelValue, warehouse: $event })"
          :options="warehouses"
          optionLabel="name"
          :optionValue="(o) => o._id || o.id"
          :placeholder="$t('products.warehouse_placeholder')"
          class="w-full h-10"
          pt:root:class="!h-10 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800"
          pt:label:class="!text-[11px] sm:!text-xs !font-medium !text-slate-700 dark:!text-white"
        />
      </div>
      <div class="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
        <span class="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('products.form.status') }}</span>
        <span class="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {{ $t('products.form.active') }}
        </span>
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
