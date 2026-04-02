<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden" v-if="workers?.length > 0">
     <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <i class="pi pi-users text-slate-400"></i> Xodimlar bo'yicha savdo
        </h3>
     </div>
     <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
           <thead>
              <tr class="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                 <th class="px-6 py-3 font-semibold">Xodim</th>
                 <th class="px-6 py-3 font-semibold text-right">Savdolar soni</th>
                 <th class="px-6 py-3 font-semibold text-right">Summa (UZS)</th>
              </tr>
           </thead>
           <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <tr v-for="worker in workers" :key="worker.worker_id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                 <td class="px-6 py-3.5 font-medium text-slate-900 dark:text-slate-200">
                    <div class="flex items-center gap-3">
                       <div class="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 dark:border-slate-700">
                          {{ worker.name.charAt(0) }}
                       </div>
                       {{ worker.name }}
                    </div>
                 </td>
                 <td class="px-6 py-3.5 text-right">
                    <span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md text-xs font-semibold">{{ worker.sales_count }}</span>
                 </td>
                 <td class="px-6 py-3.5 text-right font-black text-emerald-600 dark:text-emerald-500 tracking-tight">{{ formatCurrency(worker.sales_total) }}</td>
              </tr>
           </tbody>
        </table>
     </div>
  </div>
</template>

<script setup>
defineProps({
  workers: { type: Array, required: true },
  formatCurrency: { type: Function, required: true }
})
</script>
