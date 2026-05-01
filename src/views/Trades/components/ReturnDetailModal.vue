<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="visible" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm" @click="$emit('update:visible', false)"></div>
        
        <div class="relative w-full max-w-[700px] bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh]">
          
          <!-- Header -->
          <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <i class="pi pi-info-circle text-xl"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <h2 class="text-base font-bold text-slate-800 dark:text-white">Qaytarish Tafsilotlari</h2>
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[12px] font-bold text-slate-500">#{{ returnItem.id }}</span>
                </div>
                <p class="text-xs text-slate-400 font-medium">{{ returnItem.created_on }}</p>
              </div>
            </div>
            
            <button 
              @click="$emit('update:visible', false)"
              class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-all"
            >
              <i class="pi pi-times text-[12px]"></i>
            </button>
          </div>

          <div class="flex-grow p-8 overflow-y-auto custom-scrollbar">
            <!-- Basic Info Grid -->
            <div class="grid grid-cols-2 gap-8 mb-8">
               <div class="space-y-1">
                 <h5 class="text-[11px] font-black text-slate-400 tracking-widest">Mijoz</h5>
                 <p class="text-[15px] font-bold text-slate-700 dark:text-slate-200">{{ returnItem.customer_name || 'Mijoz ko\'rsatilmagan' }}</p>
               </div>
               <div class="space-y-1 text-right">
                 <h5 class="text-[11px] font-black text-slate-400 tracking-widest">Filial</h5>
                 <p class="text-[15px] font-bold text-slate-700 dark:text-slate-200">{{ returnItem.branch_name }}</p>
               </div>
               <div class="space-y-1">
                 <h5 class="text-[11px] font-black text-slate-400 tracking-widest">Xodim</h5>
                 <p class="text-[15px] font-bold text-slate-700 dark:text-slate-200">{{ returnItem.worker_name }}</p>
               </div>
               <div class="space-y-1 text-right">
                 <h5 class="text-[11px] font-black text-slate-400 tracking-widest">Smena ID</h5>
                 <p class="text-[15px] font-bold text-slate-700 dark:text-slate-200">#{{ returnItem.smena_id || 'N/A' }}</p>
               </div>
            </div>

            <!-- Reason Box -->
            <div class="p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 mb-8">
               <h5 class="text-[11px] font-black text-slate-400 tracking-widest mb-2">Qaytarish sababi</h5>
               <p class="text-xs font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">
                 "{{ returnItem.reason || 'Sabab ko\'rsatilmagan' }}"
               </p>
            </div>

            <!-- Items List -->
            <div class="space-y-4">
               <h5 class="text-[12px] font-black text-slate-400 tracking-widest px-1">Qaytarilgan Mahsulotlar</h5>
               <div class="space-y-2">
                  <div v-for="item in returnItem.items" :key="item.id" 
                       class="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                      <i class="pi pi-box"></i>
                    </div>
                    <div class="flex-grow">
                      <div class="flex items-center gap-2">
                        <h4 class="text-[15px] font-bold text-slate-800 dark:text-white">{{ item.product_name }}</h4>
                        <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                      </div>
                      <p class="text-[13px] text-slate-400">{{ parseFloat(item.quantity) }} {{ item.unit }} × {{ formatCurrency(item.unit_price) }}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-[15px] font-black text-slate-900 dark:text-white">{{ formatCurrency(item.total_price) }}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <!-- Footer Summary -->
          <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
             <div class="flex flex-col">
               <span class="text-[12px] font-black text-slate-400 tracking-widest">Umumiy Qaytarish Summasi</span>
               <span class="text-2xl font-black text-rose-500 tracking-tighter">{{ formatCurrency(returnItem.total_amount) }}</span>
             </div>
             <div class="flex items-center gap-3">
               <span :class="['px-3 py-1 rounded-full text-[12px] font-black tracking-widest border', getStatusStyle(returnItem.status)]">
                 {{ returnItem.status_display }}
               </span>
             </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
import TurBadge from '@/components/common/TurBadge.vue'

const settingsStore = useSettingsStore()

const props = defineProps({
  visible: Boolean,
  returnItem: { type: Object, required: true }
})

defineEmits(['update:visible'])

const formatCurrency = (val) => settingsStore.formatPrice(val)

const getStatusStyle = (status) => {
  if (status === 'confirmed') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  if (status === 'pending') return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  if (status === 'cancelled') return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>


