<template>
  <Transition name="confirm-fade">
    <div v-if="store.visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="store.onReject"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-[360px] bg-white dark:bg-[#0f172a] rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-slate-100/10 overflow-hidden transform transition-all duration-300">
        
        <!-- Header / Close -->
        <div class="flex justify-end p-4">
          <button 
            @click="store.onReject"
            class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="px-8 pb-4 flex flex-col items-center text-center">
          <!-- Icon -->
          <div :class="[
            'w-16 h-16 rounded-[24px] flex items-center justify-center shadow-xl mb-6 rotate-3 transform transition-transform hover:rotate-0 duration-500',
            isDanger ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-emerald-500 text-white shadow-emerald-500/30'
          ]">
            <i :class="[store.options.icon, 'text-2xl']"></i>
          </div>

          <!-- Text -->
          <div class="space-y-2 mb-8">
            <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              {{ store.options.header }}
            </h3>
            <p class="text-[16px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed px-2">
              {{ store.options.message }}
            </p>
          </div>
        </div>

        <!-- Footer / Buttons -->
        <div class="px-8 pb-8 flex gap-3">
          <button 
            @click="store.onReject"
            class="flex-1 h-12 rounded-2xl bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[15px] transition-all active:scale-95"
          >
            {{ store.options.rejectLabel }}
          </button>
          <button 
            @click="store.onAccept"
            :class="[
              'flex-1 h-12 rounded-2xl font-black text-[15px] text-white transition-all active:scale-95 shadow-lg',
              isDanger ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
            ]"
          >
            {{ store.options.acceptLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useConfirmStore } from '@/store/confirm'

const store = useConfirmStore()

const isDanger = computed(() => {
  const cls = store.options.acceptClass || ''
  return cls.includes('danger') || cls.includes('rose') || store.options.icon?.includes('exclamation')
})
</script>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

.confirm-fade-enter-from .relative,
.confirm-fade-leave-to .relative {
  transform: scale(0.9) translateY(20px);
}
</style>


