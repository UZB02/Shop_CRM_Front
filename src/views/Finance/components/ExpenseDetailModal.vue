<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" @click="$emit('update:visible', false)" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1100]"></div>
    </Transition>

    <!-- Modal Content -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div v-if="visible" class="fixed inset-0 z-[1101] flex items-center justify-center p-4 pointer-events-none">
        <div class="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh]">
          
          <!-- Header -->
          <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between relative bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h3 class="text-[11px] font-black tracking-widest text-rose-500">{{ $t('finance.details') }}</h3>
              <p class="text-[8px] font-bold text-slate-400 tracking-[0.2em] mt-0.5">ID: #{{ expense?.id }}</p>
            </div>
            <button
              @click="$emit('update:visible', false)"
              class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-all active:scale-90"
            >
              <i class="pi pi-times text-[9px]"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            
            <!-- Amount & Date Hero -->
            <div class="relative p-4 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-600/20 dark:to-rose-700/20 overflow-hidden shadow-md shadow-rose-500/10">
              <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div class="relative flex justify-between items-center">
                <div>
                  <span class="text-[8px] font-black tracking-widest text-rose-100/80 mb-0.5 block">{{ $t('finance.amount') }}</span>
                  <h2 class="text-xl font-black text-white tracking-tight">{{ formatCurrency(expense?.amount) }}</h2>
                </div>
                <div class="text-right">
                  <span class="text-[8px] font-black tracking-widest text-rose-100/80 mb-0.5 block">{{ $t('finance.date') }}</span>
                  <p class="text-[11px] font-bold text-white">{{ formatDate(expense?.date) }}</p>
                </div>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Category -->
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                <span class="text-[8px] font-black tracking-widest text-slate-400 block mb-0.5">{{ $t('finance.category') }}</span>
                <p class="text-[11px] font-black text-slate-700 dark:text-slate-200">{{ expense?.category_name || '—' }}</p>
              </div>

              <!-- Branch -->
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                <span class="text-[8px] font-black tracking-widest text-slate-400 block mb-0.5">{{ $t('finance.branch') }}</span>
                <p class="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{{ expense?.branch_name || '—' }}</p>
              </div>

              <!-- Worker -->
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                <span class="text-[8px] font-black tracking-widest text-slate-400 block mb-0.5">{{ $t('finance.worker') }}</span>
                <p class="text-[11px] font-black text-slate-700 dark:text-slate-200">{{ expense?.worker_name || '—' }}</p>
              </div>

              <!-- Shift -->
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                <span class="text-[8px] font-black tracking-widest text-slate-400 block mb-0.5">{{ $t('shifts.title') }} ID</span>
                <p class="text-[11px] font-black text-slate-700 dark:text-slate-200">{{ expense?.smena_id || '—' }}</p>
              </div>
            </div>

            <!-- Description & Image Row -->
            <div class="flex gap-3">
               <!-- Description -->
               <div class="flex-1 space-y-1.5 overflow-hidden">
                 <span class="text-[8px] font-black tracking-widest text-slate-400 ml-1 block">{{ $t('finance.description') }}</span>
                 <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 min-h-[50px] overflow-hidden">
                   <p class="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic break-words">
                     {{ expense?.description ? `"${expense.description}"` : '—' }}
                   </p>
                 </div>
               </div>

               <!-- Receipt Image Thumbnail -->
               <div v-if="expense?.receipt_image" class="w-20 shrink-0 space-y-1.5">
                 <span class="text-[8px] font-black tracking-widest text-slate-400 ml-1 block">{{ $t('finance.receipt') }}</span>
                 <div 
                   @click="zoomImage = true"
                   class="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm cursor-zoom-in group/img"
                 >
                   <img :src="expense.receipt_image" class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="Chek" />
                   <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                     <i class="pi pi-search-plus text-white text-[10px]"></i>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Timestamps -->
            <div class="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50">
              <div class="flex flex-col">
                <span class="text-[7px] font-black tracking-widest text-slate-300">{{ $t('common.created_at') }}</span>
                <span class="text-[9px] font-bold text-slate-400">{{ formatFullDate(expense?.created_on) }}</span>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800 flex gap-2">
             <button
               @click="$emit('update:visible', false)"
               class="flex-1 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
             >
               {{ $t('common.close') }}
             </button>
             <button
               v-if="isManager"
               @click="$emit('edit', expense)"
               class="flex-1 h-9 rounded-xl bg-rose-500 text-white text-[10px] font-black tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-1.5"
             >
               <i class="pi pi-pencil text-[9px]"></i>
               {{ $t('common.edit') }}
             </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- Receipt Zoom Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="zoomImage" @click="zoomImage = false" class="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md">
        <div class="relative max-w-4xl w-full" @click.stop>
          <button @click="zoomImage = false" class="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
            <i class="pi pi-times text-xs"></i>
          </button>
          <img :src="expense?.receipt_image" class="w-full h-auto rounded-3xl max-h-[85vh] object-contain shadow-2xl" :alt="$t('finance.receipt')" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  visible: Boolean,
  expense: Object,
  isManager: Boolean
})

const emit = defineEmits(['update:visible', 'edit'])

const zoomImage = ref(false)

const formatCurrency = (val) => settingsStore.formatPrice(val)

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatFullDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleString('uz-UZ', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
