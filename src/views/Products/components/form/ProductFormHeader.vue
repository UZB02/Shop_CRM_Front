<template>
  <div class="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 lg:border-none lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 -mx-4 lg:mx-0 flex items-center justify-between gap-4 transition-all">
    <div class="flex items-center gap-3">
      <!-- Mobile Back Button -->
      <button @click="router.push('/dashboard/products')" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 active:scale-95 transition-transform shadow-sm">
        <i class="pi pi-arrow-left text-sm"></i>
      </button>

      <div class="text-left">
        <!-- Desktop breadcrumbs -->
        <div class="hidden lg:flex items-center gap-2 mb-2">
          <router-link to="/dashboard/products" class="text-[11px] font-black tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
            {{ $t('products.title') }}
          </router-link>
          <i class="pi pi-chevron-right text-[9px] text-slate-300 dark:text-slate-700"></i>
          <span class="text-[11px] font-black tracking-widest text-slate-500">
            {{ isEdit ? $t('products.form.edit') : $t('products.form.new') }}
          </span>
        </div>
        
        <h1 class="text-base lg:text-sm font-black text-slate-900 dark:text-white leading-none tracking-tighter truncate max-w-[200px] sm:max-w-md">
          {{ isEdit ? product?.name || $t('products.form.edit') : $t('products.form.add') }}
        </h1>
        
        <!-- Mobile subtitle -->
        <span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
           {{ isEdit ? $t('products.form.edit') : $t('products.form.new') }}
        </span>
      </div>
    </div>

    <!-- Desktop Save Button (Hidden on Mobile) -->
    <div class="hidden lg:flex items-center gap-2">
      <Button 
        :label="isEdit ? $t('products.form.save') : $t('products.form.add')" 
        icon="pi pi-check" 
        @click="$emit('save')" 
        :loading="saving"
        class="!rounded-lg !bg-emerald-500 hover:!bg-emerald-600 !border-none !px-4 !h-8 !text-[11px] !font-black !!tracking-widest !text-white !shadow-lg !shadow-emerald-500/20 transition-all active:scale-95 !flex !items-center !gap-1.5"
        pt:icon:class="!text-[11px]"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

const props = defineProps({
  isEdit: Boolean,
  saving: Boolean,
  product: Object
})

defineEmits(['save'])
</script>


