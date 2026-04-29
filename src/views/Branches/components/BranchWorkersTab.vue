<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[300px]">
    <div v-if="!workers?.length" class="flex flex-col items-center justify-center py-20 opacity-40">
      <i class="pi pi-users text-4xl mb-4 text-slate-300"></i>
      <p class="text-[10px] font-black tracking-widest">{{ $t('stores.branch_detail.no_workers') }}</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50">
            <th class="px-6 py-4 text-[9px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.branch_detail.worker_name') }}</th>
            <th class="px-6 py-4 text-[9px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.branch_detail.worker_role') }}</th>
            <th class="px-6 py-4 text-[9px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.branch_detail.worker_salary') }}</th>
            <th class="px-6 py-4 text-[9px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 text-right">{{ $t('common.status') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <tr v-for="worker in workers" :key="worker.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <td class="px-6 py-4">
              <router-link :to="`/dashboard/workers/${worker.id}`" class="flex items-center gap-3 group/link">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-extrabold group-hover/link:bg-emerald-500 group-hover/link:text-white transition-all shadow-sm">
                  {{ worker.full_name?.charAt(0) }}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight group-hover/link:text-emerald-500 transition-colors">{{ worker.full_name }}</p>
                  <p class="text-[9px] font-bold text-slate-400">{{ worker.phone }}</p>
                </div>
              </router-link>
            </td>
            <td class="px-6 py-4">
              <span class="text-[10px] font-black text-slate-600 dark:text-slate-400 tracking-widest px-2 py-1 rounded-lg bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                {{ worker.role_display }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                {{ Number(worker.salary).toLocaleString() }} <span class="text-[9px] opacity-40">UZS</span>
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <span 
                class="px-2 py-0.5 rounded-full text-[9px] font-black border"
                :class="worker.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'"
              >
                {{ worker.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  workers: Array
})
</script>
