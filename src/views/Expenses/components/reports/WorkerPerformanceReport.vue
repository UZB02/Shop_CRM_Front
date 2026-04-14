<template>
  <div class="space-y-4 animate-in fade-in duration-500">
    <!-- Top Sellers / Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
       <!-- Leaderboard / Table -->
       <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">Top Sotuvchilar</h3>
             <span class="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600">DAROMAD BO'YICHA</span>
          </div>
          
          <div class="overflow-x-auto">
             <table class="w-full text-left">
                <thead>
                   <tr class="bg-slate-50/50 dark:bg-slate-800/20">
                      <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">#</th>
                      <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Xodim</th>
                      <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Filial</th>
                      <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Savdolar</th>
                      <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Tushum</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                   <tr v-for="(item, index) in data" :key="item.worker_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td class="px-6 py-4">
                         <span class="text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center" 
                               :class="index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
                            {{ index + 1 }}
                         </span>
                      </td>
                      <td class="px-6 py-4">
                         <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700">
                               {{ item.name.charAt(0) }}
                            </div>
                            <div>
                               <p class="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{{ item.name }}</p>
                               <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{{ item.role }}</p>
                            </div>
                         </div>
                      </td>
                      <td class="px-6 py-4">
                         <span class="text-[10px] font-medium text-slate-500">{{ item.branch || '—' }}</span>
                      </td>
                      <td class="px-6 py-4 text-center">
                         <span class="px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-[10px] font-black text-sky-600">
                            {{ item.sales_count }}
                         </span>
                      </td>
                      <td class="px-6 py-4 text-right">
                         <p class="text-xs font-black text-slate-800 dark:text-slate-100">{{ formatCurrency(item.revenue) }}</p>
                         <p class="text-[9px] font-bold text-rose-500" v-if="item.returns_count > 0">
                            {{ item.returns_count }} ta qaytarish
                         </p>
                      </td>
                   </tr>
                   <tr v-if="!data.length">
                      <td colspan="5" class="px-6 py-12 text-center">
                         <i class="pi pi-users text-2xl text-slate-200 mb-3 block"></i>
                         <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ma'lumotlar mavjud emas</p>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

       <!-- Side Cards -->
       <div class="space-y-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">O'rtacha Savdo (Chek)</h3>
             <div class="space-y-4">
                <div v-for="item in data.slice(0, 5)" :key="'avg-' + item.worker_id" class="flex flex-col gap-1.5">
                   <div class="flex justify-between items-center">
                      <span class="text-[10px] font-bold text-slate-500 truncate w-32">{{ item.name }}</span>
                      <span class="text-[10px] font-black text-slate-700 dark:text-slate-200">{{ formatCurrency(item.avg_sale) }}</span>
                   </div>
                   <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-sky-500 rounded-full" :style="{ width: calculateRelPct(item.avg_sale) + '%' }"></div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Summary info -->
          <div class="p-5 rounded-3xl bg-rose-500 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
             <div class="relative z-10">
                <p class="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Xodimlar faolligi</p>
                <h4 class="text-lg font-black tracking-tight mb-4">Sotuvlar yetakchisi</h4>
                <div v-if="data[0]" class="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                   <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <i class="pi pi-trophy text-lg"></i>
                   </div>
                   <div>
                      <p class="text-xs font-black">{{ data[0].name }}</p>
                      <p class="text-[10px] font-bold opacity-80">{{ data[0].sales_count }} ta savdo amalga oshirdi</p>
                   </div>
                </div>
             </div>
             <i class="pi pi-chart-bar absolute -right-6 -bottom-6 text-8xl opacity-10 rotate-12"></i>
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
