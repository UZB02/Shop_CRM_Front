<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[300px]">
    <div v-if="!customers?.length" class="flex flex-col items-center justify-center py-20 opacity-40">
      <i class="pi pi-id-card text-4xl mb-4 text-slate-300"></i>
      <p class="text-[12px] font-black tracking-widest">{{ $t('stores.branch_detail.no_customers') }}</p>
    </div>
    <div v-else class="w-full">
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50">
              <th class="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('customers.table.name') }}</th>
              <th class="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('customers.table.contact_address') }}</th>
              <th class="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 text-right">{{ $t('customers.table.total_spent') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="customer in customers" :key="customer.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <td class="px-6 py-4">
                <router-link :to="`/dashboard/customers/${customer.id}`" class="flex items-center gap-3 group/link">
                  <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-extrabold group-hover/link:bg-orange-500 group-hover/link:text-white transition-all shadow-sm">
                    {{ customer.name?.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight group-hover/link:text-orange-500 transition-colors truncate">{{ customer.name }}</p>
                    <p class="text-[11px] font-bold text-slate-400 tracking-widest">{{ customer.group_name || $t('customers.regular_customer') }}</p>
                  </div>
                </router-link>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-[12px] font-black text-slate-600 dark:text-slate-400 tracking-tight">
                    {{ customer.phone }}
                  </span>
                  <span v-if="customer.address" class="text-[11px] font-bold text-slate-400 truncate max-w-[150px]">
                    {{ customer.address }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {{ Number(customer.totalSpent || 0).toLocaleString() }} <span class="text-[11px] opacity-40">UZS</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/30">
        <router-link
          v-for="customer in customers"
          :key="`mob-${customer.id}`"
          :to="`/dashboard/customers/${customer.id}`"
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm relative transition-all active:scale-[0.98] group"
        >
          <!-- Top Row: Avatar + Info -->
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-extrabold group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm shrink-0">
              {{ customer.name?.charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[14px] font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">{{ customer.name }}</p>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-[10px] font-black text-orange-500 dark:text-orange-400 tracking-widest uppercase bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded">
                  {{ customer.group_name || $t('customers.regular_customer') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Phone & Total Spent -->
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i class="pi pi-phone text-[10px] text-orange-500/60"></i>
                {{ customer.phone }}
              </span>
              <span v-if="customer.address" class="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                <i class="pi pi-map-marker text-[9px]"></i>
                <span class="truncate max-w-[120px]">{{ customer.address }}</span>
              </span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[9px] font-black tracking-widest text-slate-400 uppercase">{{ $t('customers.table.total_spent') }}</span>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-[14px] font-black text-emerald-600 dark:text-emerald-400">{{ Number(customer.totalSpent || 0).toLocaleString() }}</span>
                <span class="text-[9px] font-black text-emerald-400/70 uppercase">UZS</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customers: Array
})
</script>


