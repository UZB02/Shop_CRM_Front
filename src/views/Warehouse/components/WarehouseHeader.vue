<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
    <div class="text-left">
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
        {{ $t('warehouse.page_title') }}
      </h1>
      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1 text-left">
        {{ $t('warehouse.page_subtitle') }}
      </p>
    </div>
    <button
      @click="notificationStore.canAddWarehouse ? $emit('add') : null"
      :disabled="!notificationStore.canAddWarehouse"
      :title="!notificationStore.canAddWarehouse ? 'Obuna limitingiz tugagan. Iltimos, tarifni yangilang.' : ''"
      class="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 py-4 sm:py-3.5 rounded-[1.25rem] transition-all shadow-xl active:scale-95"
      :class="[
        notificationStore.canAddWarehouse
          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 border-b-4 border-emerald-700 active:border-b-0'
          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale border-b-0 opacity-60 shadow-none'
      ]"
    >
      <div 
        class="w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-500"
        :class="notificationStore.canAddWarehouse ? 'bg-white/20 group-hover:rotate-90' : 'bg-slate-300 dark:bg-slate-700'"
      >
        <i :class="notificationStore.canAddWarehouse ? 'pi pi-plus' : 'pi pi-lock'" class="text-[10px] font-bold"></i>
      </div>
      <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('warehouse.new_warehouse') }}</span>
    </button>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/store/notifications'
const notificationStore = useNotificationStore()

defineEmits(['add'])
</script>
