<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-3">
      <button 
        @click="$router.back()"
        class="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-sm active:scale-95"
      >
        <i class="pi pi-arrow-left text-[10px]"></i>
      </button>
      <div>
        <div class="flex items-center gap-1 mb-0.5">
          <router-link to="/dashboard/products" class="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">{{ $t('products.title') }}</router-link>
          <i class="pi pi-chevron-right text-[7px] text-slate-300"></i>
          <span class="text-[9px] font-bold uppercase tracking-widest text-slate-300">{{ isEdit ? $t('products.form.edit') : $t('products.form.new') }}</span>
        </div>
        <h1 class="text-lg font-black text-slate-800 dark:text-white leading-tight">
          {{ isEdit ? $t('products.form.edit') : $t('products.form.add') }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        @click="$router.back()"
        class="px-4 py-2 rounded-lg text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        {{ $t('products.form.cancel') }}
      </button>
      <Button 
        :label="isEdit ? $t('products.form.save') : $t('products.form.add')" 
        icon="pi pi-check" 
        @click="$emit('save')" 
        :loading="saving"
        class="!rounded-xl !bg-emerald-500 hover:!bg-emerald-600 !border-none !px-6 !h-10 !text-xs !font-black !text-white !shadow-lg !shadow-emerald-500/10 transition-all active:scale-95"
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
