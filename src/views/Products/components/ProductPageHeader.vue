<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
    <div class="space-y-0.5">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
        <div class="w-1 h-6 sm:w-1.5 sm:h-8 bg-emerald-500 rounded-full"></div>
        {{ $t('products.title') }}
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium ml-3.5 sm:ml-4">
        {{ $t('products.subtitle', { count: totalProducts }) }}
      </p>
    </div>
    <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <Button 
        :label="$t('products.new_category')" 
        icon="pi pi-folder-plus" 
        text 
        severity="secondary" 
        @click="$emit('add-category')" 
        class="!rounded-xl !px-3 sm:!px-4 !text-xs sm:!text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold flex-1 sm:flex-none" 
      />
      <Button 
        :label="$t('products.new_product')" 
        icon="pi pi-plus" 
        severity="success" 
        @click="router.push('/dashboard/products/create')" 
        class="!rounded-xl !px-4 sm:!px-6 !text-xs sm:!text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all font-bold flex-1 sm:flex-none" 
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

defineProps({
  totalProducts: Number
})

defineEmits(['add-category', 'add-product'])
</script>
