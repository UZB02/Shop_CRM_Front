<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="flex items-center gap-3 px-7 py-5 border-b border-slate-100 dark:border-slate-800">
      <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
        <i class="pi pi-file-edit text-emerald-500 text-sm"></i>
      </div>
      <h2 class="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{{ $t('products.form.name') }} & {{ $t('products.form.category') }}</h2>
    </div>

    <div class="p-7 space-y-6">
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {{ $t('products.form.name') }} <span class="text-rose-500 ml-0.5">*</span>
        </label>
        <input
          :value="modelValue.name"
          @input="$emit('update:modelValue', { ...modelValue, name: $event.target.value })"
          type="text"
          :placeholder="$t('products.messages.name_required')"
          class="w-full h-11 px-4 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          :class="{ '!border-rose-400 !bg-rose-50/5': submitted && !modelValue.name }"
        />
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.category') }}</label>
          <Select
            :modelValue="modelValue.category"
            @update:modelValue="$emit('update:modelValue', { ...modelValue, category: $event })"
            :options="categories"
            optionLabel="name"
            :optionValue="(c) => c._id || c.id"
            :placeholder="$t('products.form.select_category')"
            class="w-full h-11"
            pt:root:class="!h-11 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800 !text-sm"
            pt:label:class="!text-sm !font-medium !text-slate-700 dark:!text-white"
            :class="{ '!border-rose-400 !bg-rose-50/5': submitted && !modelValue.category }"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.barcode') }}</label>
          <div class="relative">
            <i class="pi pi-barcode absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-sm"></i>
            <input
              :value="modelValue.barcode"
              @input="$emit('update:modelValue', { ...modelValue, barcode: $event.target.value })"
              type="text"
              placeholder="00000000000"
              class="w-full h-11 pl-10 pr-4 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>
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
  submitted: Boolean
})

defineEmits(['update:modelValue'])
</script>
