<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="flex items-center gap-3 px-7 py-5 border-b border-slate-100 dark:border-slate-800">
      <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
        <i class="pi pi-building text-amber-500 text-sm"></i>
      </div>
      <h2 class="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{{ $t('products.form.warehouse') }} & {{ $t('products.form.status') }}</h2>
    </div>

    <div class="p-7 space-y-4">
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.warehouse') }}</label>
        <Select
          :modelValue="modelValue.warehouse"
          @update:modelValue="$emit('update:modelValue', { ...modelValue, warehouse: $event })"
          :options="warehouses"
          optionLabel="name"
          :optionValue="(o) => o._id || o.id"
          :placeholder="$t('products.warehouse_placeholder')"
          class="w-full"
          pt:root:class="!h-11 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800"
          pt:label:class="!text-sm !font-medium !text-slate-700 dark:!text-white"
        />
      </div>
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('products.form.status') }}</span>
        <span class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
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
