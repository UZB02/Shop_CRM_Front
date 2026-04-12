<template>
  <div class="space-y-4 animate-in fade-in duration-500">
    <!-- P&L Header Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <div v-for="card in statCards" :key="card.label" 
           class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1.5">
           <div :class="card.iconBg" class="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <i :class="[card.icon, card.iconColor]" class="text-[10px]"></i>
           </div>
           <span v-if="card.pct" class="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              {{ card.pct }}%
           </span>
        </div>
        <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{{ card.label }}</p>
        <p class="text-xs font-black tracking-tight" :class="card.textColor">
           {{ formatCurrency(card.value) }}
        </p>
        <!-- Subtle background decoration -->
        <i :class="card.icon" class="absolute -right-1.5 -bottom-1.5 text-2xl opacity-[0.03] rotate-12"></i>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
       <!-- Revenue & Gross Profit Details -->
       <div class="lg:col-span-2 space-y-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
             <div class="flex items-center justify-between mb-6">
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">Daromad tahlili</h3>
                <div class="flex items-center gap-2">
                   <div class="flex items-center gap-1">
                      <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span class="text-[9px] font-bold text-slate-400 uppercase">Sotuvlar</span>
                   </div>
                   <div class="flex items-center gap-1 ml-2">
                      <div class="w-2 h-2 rounded-full bg-rose-500"></div>
                      <span class="text-[9px] font-bold text-slate-400 uppercase">Qaytarishlar</span>
                   </div>
                </div>
             </div>
             
             <div class="space-y-6">
                <!-- Progress bars for visual representation -->
                <div class="space-y-2">
                   <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span class="text-slate-400">Umumiy tushumlar</span>
                      <span class="text-slate-600 dark:text-slate-200">{{ formatCurrency(data?.revenue?.total || 0) }}</span>
                   </div>
                   <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" :style="{ width: '100%' }"></div>
                   </div>
                </div>

                <div class="space-y-2">
                   <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span class="text-slate-400">Tovar tan narxi (COGS)</span>
                      <span class="text-slate-600 dark:text-slate-200">{{ formatCurrency(data?.cogs?.total || 0) }}</span>
                   </div>
                   <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-500 rounded-full" :style="{ width: calculatePct(data?.cogs?.total, data?.revenue?.total) + '%' }"></div>
                   </div>
                </div>

                <div class="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                   <div>
                      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Yalpi foyda</p>
                      <p class="text-lg font-black text-emerald-600 tracking-tight">{{ formatCurrency(data?.gross_profit || 0) }}</p>
                   </div>
                   <div class="text-right">
                      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Margin %</p>
                      <p class="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ data?.margin_pct || 0 }}%</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <!-- Side Panel: Losses & Expenses -->
       <div class="space-y-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-full">
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Yo'qotishlar</h3>
             
             <div class="space-y-6">
                <div>
                   <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operatsion xarajatlar</span>
                      <span class="text-[10px] font-black text-rose-500">{{ formatCurrency(data?.expenses?.total || 0) }}</span>
                   </div>
                   <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                      <div class="h-full bg-rose-500 rounded-full" :style="{ width: calculatePct(data?.expenses?.total, data?.gross_profit) + '%' }"></div>
                   </div>
                </div>

                <div>
                   <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Isrof zarari</span>
                      <span class="text-[10px] font-black text-amber-600">{{ formatCurrency(data?.wastage_loss?.total || 0) }}</span>
                   </div>
                   <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                      <div class="h-full bg-amber-500 rounded-full" :style="{ width: calculatePct(data?.wastage_loss?.total, data?.gross_profit) + '%' }"></div>
                   </div>
                </div>

                <div class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                   <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Sof foyda</p>
                      <p class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">
                         {{ formatCurrency(data?.net_profit || 0) }}
                      </p>
                      <p class="text-[9px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                         <i class="pi pi-arrow-up-right"></i>
                         Barcha xarajatlardan keyingi sof qoldiq
                      </p>
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

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value || 0)
}

const calculatePct = (part, total) => {
  const p = parseFloat(part) || 0
  const t = parseFloat(total) || 0
  if (!t || t === 0) return 0
  return Math.min(100, Math.round((p / t) * 100))
}

const statCards = computed(() => {
  const exp = parseFloat(props.data?.expenses?.total) || 0
  const wst = parseFloat(props.data?.wastage_loss?.total) || 0
  
  return [
    {
      label: 'Sof tushum',
      value: props.data?.revenue?.total || 0,
      icon: 'pi pi-shopping-cart',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      textColor: 'text-slate-800 dark:text-slate-100'
    },
    {
      label: 'Yalpi foyda',
      value: props.data?.gross_profit || 0,
      icon: 'pi pi-chart-pie',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      pct: calculatePct(props.data?.gross_profit, props.data?.revenue?.total)
    },
    {
      label: 'Jami xarajat',
      value: exp + wst,
      icon: 'pi pi-wallet',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      iconColor: 'text-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      label: 'Sof foyda',
      value: props.data?.net_profit || 0,
      icon: 'pi pi-star-fill',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      pct: props.data?.margin_pct
    }
  ]
})
</script>
