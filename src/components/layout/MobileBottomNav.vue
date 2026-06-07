<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 lg:hidden pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
    <div class="flex items-center justify-around h-[68px] px-2">
      <router-link to="/dashboard" class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform" active-class="text-emerald-500 dark:text-emerald-400 font-bold">
        <i class="pi pi-home text-[22px] mb-1"></i>
        <span class="text-[10px]">Asosiy</span>
      </router-link>
      <router-link to="/dashboard/pos" class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform" active-class="text-emerald-500 dark:text-emerald-400 font-bold">
        <i class="pi pi-shopping-cart text-[22px] mb-1"></i>
        <span class="text-[10px]">Sotuv</span>
      </router-link>
      <router-link to="/dashboard/products" class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform" active-class="text-emerald-500 dark:text-emerald-400 font-bold">
        <i class="pi pi-box text-[22px] mb-1"></i>
        <span class="text-[10px]">Tovarlar</span>
      </router-link>
      <router-link to="/dashboard/warehouse" class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform" active-class="text-emerald-500 dark:text-emerald-400 font-bold">
        <i class="pi pi-building text-[22px] mb-1"></i>
        <span class="text-[10px]">Ombor</span>
      </router-link>
      <button @click="$emit('open-menu')" class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform">
        <i class="pi pi-bars text-[22px] mb-1"></i>
        <span class="text-[10px]">Menyu</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['open-menu'])
</script>
