<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <i class="pi pi-box text-white text-[10px]"></i>
      </div>
      <div>
        <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">{{ $t('products.form.main_info') }}</h2>
      </div>
    </div>

    <div class="p-6 space-y-6 overflow-y-auto">
      <!-- Product Name -->
      <div class="flex flex-col gap-2">
        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
          {{ $t('products.form.name') }} <span class="text-rose-500 ml-0.5">*</span>
        </label>
        <div class="relative group">
          <i class="pi pi-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors text-xs"></i>
          <input
            :value="modelValue.name"
            @input="$emit('update:modelValue', { ...modelValue, name: $event.target.value })"
            type="text"
            maxlength="300"
            :placeholder="$t('products.messages.name_required')"
            class="w-full h-11 pl-11 pr-5 rounded-xl text-[12px] font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
            :class="{ '!border-rose-400 !bg-rose-50/5': submitted && !modelValue.name }"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Category -->
        <div class="flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
            {{ $t('products.form.category') }} <span class="text-rose-500 ml-0.5">*</span>
          </label>
          <Select
            :modelValue="modelValue.category"
            @update:modelValue="$emit('update:modelValue', { ...modelValue, category: $event })"
            :options="categories"
            optionLabel="name"
            :optionValue="(c) => c._id || c.id"
            :placeholder="$t('products.form.select_category')"
            filter
            class="w-full h-11"
            pt:root:class="!h-11 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800/40 !shadow-sm focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500"
            pt:label:class="!text-[11px] !font-bold !text-slate-700 dark:!text-white !flex !items-center !px-4"
            :class="{ '!border-rose-400 !bg-rose-50/5': submitted && !modelValue.category }"
          />
        </div>

        <!-- Subcategory -->
        <div class="flex flex-col gap-2">
          <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
            {{ $t('subcategories.title') }}
          </label>
          <Select
            :modelValue="modelValue.subcategory"
            @update:modelValue="$emit('update:modelValue', { ...modelValue, subcategory: $event })"
            :options="subcategories"
            optionLabel="name"
            :optionValue="(c) => c._id || c.id"
            :placeholder="$t('common.choose')"
            filter
            :disabled="!modelValue.category"
            class="w-full h-11"
            pt:root:class="!h-11 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800/40 !shadow-sm focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500 disabled:opacity-50"
            pt:label:class="!text-[11px] !font-bold !text-slate-700 dark:!text-white !flex !items-center !px-4"
          />
        </div>
      </div>
      
      <!-- Barcode -->
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{{ $t('products.form.barcode') }}</label>
        <div class="relative group">
          <i class="pi pi-barcode absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors text-xs"></i>
          <input
            :value="modelValue.barcode"
            @input="$emit('update:modelValue', { ...modelValue, barcode: $event.target.value })"
            type="text"
            placeholder="00000000000"
            class="w-full h-11 pl-11 pr-5 rounded-xl text-[12px] font-mono font-bold tracking-widest text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'

defineProps({
  modelValue: Object,
  categories: Array,
  subcategories: Array,
  submitted: Boolean
})

defineEmits(['update:modelValue'])
</script>
