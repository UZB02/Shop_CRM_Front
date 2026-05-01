<template>
  <div class="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Top Sellers / Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <!-- Leaderboard / Table -->
       <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
          <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-emerald-500/5 flex items-center justify-between">
             <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <i class="pi pi-trophy text-xs"></i>
                </div>
                <h3 class="text-[13px] font-black tracking-[0.2em] text-emerald-600">Top Sotuvchilar</h3>
             </div>
             <span class="text-[12px] font-black px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-500 border border-emerald-100 dark:border-emerald-500/10 tracking-widest">DAROMAD BO'YICHA</span>
          </div>
          
          <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr class="text-[12px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                      <th class="px-8 py-5">#</th>
                      <th class="px-8 py-5">Xodim</th>
                      <th class="px-8 py-5 hidden sm:table-cell">Filial</th>
                      <th class="px-8 py-5 text-center">Savdolar</th>
                      <th class="px-8 py-5 text-right">Tushum</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                   <tr v-for="(item, index) in data" :key="item.worker_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group">
                      <td class="px-8 py-5">
                         <span class="text-[12px] font-black w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm" 
                               :class="index === 0 ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
                            {{ index + 1 }}
                         </span>
                      </td>
                      <td class="px-8 py-5">
                         <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[13px] font-black text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner group-hover:border-emerald-500/50 transition-colors">
                               {{ item.name.charAt(0) }}
                            </div>
                            <div>
                               <p class="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">{{ item.name }}</p>
                               <p class="text-[12px] font-black text-slate-400 tracking-widest mt-0.5">{{ item.role }}</p>
                            </div>
                         </div>
                      </td>
                      <td class="px-8 py-5 hidden sm:table-cell">
                         <span class="text-xs font-bold text-slate-500 tracking-tight">{{ item.branch || '—' }}</span>
                      </td>
                      <td class="px-8 py-5 text-center">
                         <span class="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-[12px] font-black text-emerald-600 border border-emerald-100 dark:border-emerald-500/10">
                            {{ item.sales_count }}
                         </span>
                      </td>
                      <td class="px-8 py-5 text-right">
                         <p class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ formatCurrency(item.revenue) }}</p>
                         <p class="text-[11px] font-black text-rose-500 tracking-widest mt-1" v-if="item.returns_count > 0">
                            {{ item.returns_count }} TA QAYTARISH
                         </p>
                      </td>
                   </tr>
                   <tr v-if="!data.length">
                      <td colspan="5" class="px-8 py-20 text-center">
                         <div class="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-slate-50 dark:bg-slate-800 mb-6">
                           <i class="pi pi-users text-2xl text-slate-200"></i>
                         </div>
                         <p class="text-[13px] font-black text-slate-400 tracking-[0.3em]">Ma'lumotlar mavjud emas</p>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

       <!-- Side Cards -->
       <div class="flex flex-col gap-8">
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-full">
             <h3 class="text-[13px] font-black tracking-[0.2em] text-slate-500 mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">O'rtacha Savdo (Chek)</h3>
             <div class="space-y-6 flex-1">
                <div v-for="item in data.slice(0, 5)" :key="'avg-' + item.worker_id" class="flex flex-col gap-2 group/item">
                   <div class="flex justify-between items-center">
                      <span class="text-[12px] font-black text-slate-500 tracking-widest truncate w-40 group-hover/item:text-emerald-500 transition-colors">{{ item.name }}</span>
                      <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ formatCurrency(item.avg_sale) }}</span>
                   </div>
                   <div class="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                      <div class="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :style="{ width: calculateRelPct(item.avg_sale) + '%' }"></div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Summary info -->
          <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-end min-h-[180px]">
             <div class="absolute -right-8 -top-8 opacity-10 rotate-12">
               <i class="pi pi-chart-bar text-[150px]"></i>
             </div>
             <div class="relative z-10">
                <p class="text-[12px] font-black tracking-[0.3em] opacity-70 mb-2">Xodimlar faolligi</p>
                <h4 class="text-xl font-black tracking-tight mb-6">Sotuvlar yetakchisi</h4>
                <div v-if="data[0]" class="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-xl transition-all duration-500 hover:bg-white/20">
                   <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                      <i class="pi pi-trophy text-xl text-amber-300"></i>
                   </div>
                   <div>
                      <p class="text-sm font-black">{{ data[0].name }}</p>
                      <p class="text-[12px] font-black tracking-widest opacity-80 mt-0.5">{{ data[0].sales_count }} ta savdo</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const formatCurrency = (value) => settingsStore.formatPrice(value)

const maxAvg = computed(() => {
  if (!props.data.length) return 0
  return Math.max(...props.data.map(i => parseFloat(i.avg_sale) || 0))
})

const calculateRelPct = (val) => {
  if (!maxAvg.value) return 0
  return (parseFloat(val) / maxAvg.value) * 100
}
</script>


