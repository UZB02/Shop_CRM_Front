<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div class="flex items-center gap-4">
      <button 
        @click="$router.back()"
        class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-sm active:scale-95"
      >
        <i class="pi pi-arrow-left text-xs"></i>
      </button>
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <router-link to="/dashboard/products" class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">{{ $t('products.title') }}</router-link>
          <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
          <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-300">{{ isEdit ? $t('products.form.edit') : $t('products.form.new') }}</span>
        </div>
        <h1 class="text-xl font-black text-slate-800 dark:text-white leading-tight">
          {{ isEdit ? $t('products.form.edit') : $t('products.form.add') }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        @click="$router.back()"
        class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        {{ $t('products.form.cancel') }}
      </button>
      <Button 
        :label="isEdit ? $t('products.form.save') : $t('products.form.add')" 
        icon="pi pi-check" 
        @click="$emit('save')" 
        :loading="saving"
        class="!rounded-2xl !bg-emerald-500 hover:!bg-emerald-600 !border-none !px-8 !h-12 !text-sm !font-black !text-white !shadow-lg !shadow-emerald-500/20 transition-all active:scale-95"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'

defineProps({
  isEdit: Boolean,
  saving: Boolean
})

defineEmits(['save'])
</script>
