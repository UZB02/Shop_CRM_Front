<template>
  <div class="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-8">
    <div class="w-24 h-24 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
      <i class="pi pi-lock text-4xl text-rose-500"></i>
    </div>
    <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Kirish Taqiqlandi</h1>
    <p class="text-slate-500 max-w-md mb-8">
      Sizda ushbu bo'limga kirish uchun yetarli huquqlar mavjud emas. Iltimos, tizim administratoriga murojaat qiling.
    </p>
    <Button label="Bosh sahifaga qaytish" icon="pi pi-home" severity="secondary" @click="$router.push('/dashboard')" />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>


