<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
    <div class="flex items-center gap-4">
      <button 
        @click="$emit('back')"
        class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
        v-tooltip.bottom="'Orqaga'"
      >
        <i class="pi pi-arrow-left text-sm"></i>
      </button>
      <div class="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
      <div>
        <div class="flex items-center gap-2 mb-0.5">
          <h1 class="text-lg font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">
            Ommaviy Yuklash
          </h1>
          <Tag :value="warehouseName" severity="info" class="!text-[10px] !font-black !rounded-md !px-2" />
        </div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
          Zaxira operatsiyasini shakillantirish
        </p>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <div class="flex flex-col items-end pr-4 border-r border-slate-100 dark:border-slate-800 hidden sm:flex">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">To'ldirilgan</span>
        <span class="text-sm font-black text-slate-800 dark:text-slate-200 leading-none">{{ validCount }} / {{ totalCount }}</span>
      </div>
      <button
        @click="$emit('back')"
        class="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
      >
        Bekor qilish
      </button>
      <button
        @click="$emit('save')"
        :disabled="saving || validCount === 0"
        class="h-11 px-8 rounded-xl text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
        :class="type === 'in' ? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700'"
      >
        <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
        <i v-else class="pi pi-cloud-upload text-xs"></i>
        Saqlash
      </button>
    </div>
  </div>
</template>

<script setup>
import Tag from 'primevue/tag'

defineProps({
  warehouseName: String,
  validCount: Number,
  totalCount: Number,
  saving: Boolean,
  type: String
})

defineEmits(['back', 'save'])
</script>
