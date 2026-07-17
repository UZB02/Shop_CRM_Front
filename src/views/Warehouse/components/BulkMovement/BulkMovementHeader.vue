<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
    <div class="flex items-center gap-3 sm:gap-4">
      <button 
        @click="$emit('back')"
        class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
      >
        <i class="pi pi-arrow-left text-xs sm:text-sm"></i>
      </button>
      
      <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
      
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-[13px] sm:text-[14px] font-black text-slate-900 dark:text-slate-50 tracking-tight truncate">
            {{ $t('warehouse.bulk.title') }}
          </h1>
          <Tag :value="warehouseName" severity="info" class="!text-[11px] sm:!text-[12px] !font-black !rounded-md !px-2" />
        </div>
        <p class="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-[0.1em] leading-none mt-0.5 uppercase">
          {{ $t('warehouse.bulk.subtitle') }}
        </p>
      </div>
    </div>
    
    <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
      <div class="flex flex-col items-start sm:items-end pr-4 sm:border-r border-slate-100 dark:border-slate-800">
        <span class="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1">
          {{ $t('warehouse.bulk.filled') }}
        </span>
        <span class="text-[11px] sm:text-[12px] font-black text-slate-800 dark:text-slate-200 leading-none">{{ validCount }} / {{ totalCount }}</span>
      </div>

      <div class="hidden md:flex items-center gap-2">
        <button
          @click="$emit('download-template')"
          :disabled="templateLoading"
          class="h-8 sm:h-9 px-4 sm:px-5 rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-[11px] sm:text-[12px] font-black tracking-widest hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i :class="templateLoading ? 'pi pi-spin pi-spinner' : 'pi pi-download'" class="text-[11px]"></i>
          {{ $t('reports.download_template') }}
        </button>
        <!-- D: Mavjud mahsulotlarga Excel kirim/chiqim importi -->
        <div class="relative">
          <input
            type="file"
            accept=".xlsx"
            hidden
            ref="movImportRef"
            @change="handleImportFile"
          />
          <button
            @click="movImportRef?.click()"
            :disabled="importing"
            class="h-8 sm:h-9 px-4 sm:px-5 rounded-lg border border-violet-100 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400 text-[11px] sm:text-[12px] font-black tracking-widest hover:bg-violet-50 transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i :class="importing ? 'pi pi-spin pi-spinner' : 'pi pi-upload'" class="text-[11px]"></i>
            {{ $t('reports.import_btn') }}
          </button>
        </div>
        <button
          @click="$emit('back')"
          class="h-8 sm:h-9 px-4 sm:px-5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] sm:text-[12px] font-black tracking-widest hover:bg-slate-50 transition-all active:scale-95"
        >
          {{ $t('warehouse.bulk.cancel') }}
        </button>
        <button
          @click="$emit('save')"
          :disabled="saving || validCount === 0"
          class="h-8 sm:h-9 px-5 sm:px-6 rounded-lg text-white text-[11px] sm:text-[12px] font-black tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
          :class="type === 'in' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-500/20'"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner text-[11px]"></i>
          <i v-else class="pi pi-cloud-upload text-[11px]"></i>
          {{ $t('warehouse.bulk.save') }}
        </button>
      </div>

      <!-- Mobile Save/Actions menu can be placed elsewhere -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Tag from 'primevue/tag'

const movImportRef = ref(null)

const props = defineProps({
  warehouseName: String,
  validCount: Number,
  totalCount: Number,
  saving: Boolean,
  type: String,
  templateLoading: { type: Boolean, default: false },
  importing: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'save', 'download-template', 'import'])

const handleImportFile = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    emit('import', file)
    e.target.value = '' // Reset — xuddi shu faylni qayta tanlaganda ham ishlaydi
  }
}
</script>
