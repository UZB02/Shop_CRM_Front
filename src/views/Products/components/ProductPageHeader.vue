<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
    <div class="space-y-0.2">
      <h1 class="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
        <div class="w-1 h-5 sm:h-7 bg-emerald-500 rounded-full"></div>
        {{ $t('products.title_header') || 'Mahsulotlar Boshqaruvi' }}
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-bold ml-3 sm:ml-4">
        {{ $t('products.subtitle', { count: totalProducts }) }}
      </p>
    </div>
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <Button 
        :label="$t('categories.title')" 
        icon="pi pi-folder" 
        text 
        severity="secondary" 
        @click="router.push('/dashboard/products/categories')" 
        class="!rounded-lg !px-3 !text-[11px] sm:!text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold flex-1 sm:flex-none" 
      />
      <Button 
        :label="$t('products.new_product')" 
        icon="pi pi-plus" 
        severity="success" 
        @click="router.push('/dashboard/products/create')" 
        class="!rounded-lg !px-4 !text-[11px] sm:!text-xs shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-95 transition-all font-black flex-1 sm:flex-none" 
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
