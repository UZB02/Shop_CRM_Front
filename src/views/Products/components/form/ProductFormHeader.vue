<template>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="text-left">
        <div class="flex items-center gap-2 mb-0.5">
          <router-link to="/dashboard/products" class="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
            {{ $t('products.title') }}
          </router-link>
          <i class="pi pi-chevron-right text-[7px] text-slate-300 dark:text-slate-700"></i>
          <span class="text-[9px] font-black uppercase tracking-widest text-slate-500">
            {{ isEdit ? $t('products.form.edit') : $t('products.form.new') }}
          </span>
        </div>
        <h1 class="text-sm font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter">
          {{ isEdit ? product?.name || $t('products.form.edit') : $t('products.form.add') }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Button 
        :label="isEdit ? $t('products.form.save') : $t('products.form.add')" 
        icon="pi pi-check" 
        @click="$emit('save')" 
        :loading="saving"
        class="!rounded-lg !bg-emerald-500 hover:!bg-emerald-600 !border-none !px-4 !h-8 !text-[9px] !font-black !uppercase !tracking-widest !text-white !shadow-lg !shadow-emerald-500/20 transition-all active:scale-95 !flex !items-center !gap-1.5"
        pt:icon:class="!text-[9px]"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'

const props = defineProps({
  isEdit: Boolean,
  saving: Boolean,
  product: Object
})

defineEmits(['save'])
</script>
