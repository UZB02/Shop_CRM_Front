<template>
  <div v-if="loadingBilling" class="flex flex-col gap-6 py-20 items-center justify-center">
    <i class="pi pi-spin pi-spinner text-3xl text-emerald-500"></i>
    <p class="text-xs font-bold text-slate-400 tracking-widest">{{ $t('common.loading') || 'Yuklanmoqda...' }}</p>
  </div>
  <div v-else class="space-y-6 animate-in">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transactions List -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
        <div class="px-5 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 class="text-xs font-bold text-slate-500 tracking-widest">{{ $t('subscription.transactions') || "O'tkazmalar" }}</h3>
        </div>
        <div class="p-4 flex-1 overflow-y-auto">
          <div v-if="balanceTransactions.length === 0" class="py-10 text-center space-y-4">
            <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <i class="pi pi-wallet text-slate-300"></i>
            </div>
            <p class="text-[12px] font-bold text-slate-400 tracking-widest italic">{{ $t('subscription.no_transactions') || "O'tkazmalar mavjud emas" }}</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(tx, idx) in balanceTransactions" :key="idx" class="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                     :class="tx.type === 'deduction' 
                       ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
                       : 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'">
                  <i class="pi text-xs" :class="tx.type === 'deduction' ? 'pi-arrow-down-right' : 'pi-arrow-up-right'"></i>
                </div>
                <div>
                  <p class="text-xs font-black text-slate-700 dark:text-slate-200">
                     {{ tx.type_display || tx.description || (tx.type === 'deduction' ? "Yechib olindi" : "To'ldirildi") }}
                  </p>
                  <p v-if="tx.type_display && tx.description && tx.type_display !== tx.description" class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                     {{ tx.description }}
                  </p>
                  <p class="text-[10px] text-slate-400 font-bold mt-1 tracking-wider flex items-center gap-1 uppercase">
                     <i class="pi pi-clock text-[9px]"></i>
                     {{ tx.created_on || tx.created_at }}
                  </p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <p class="text-xs font-black tracking-tight" :class="tx.type === 'deduction' ? 'text-slate-800 dark:text-slate-200' : 'text-emerald-600'">
                  {{ formatCurrency(tx.amount) }}
                </p>
                <p v-if="tx.balance_after !== undefined" class="text-[10px] font-bold text-slate-400 mt-1">
                  {{ $t('subscription.balance_after') }}: <span class="text-slate-600 dark:text-slate-300">{{ formatCurrency(tx.balance_after) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices List -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
        <div class="px-5 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 class="text-xs font-bold text-slate-500 tracking-widest">{{ $t('subscription.invoices') || "Cheklar" }}</h3>
          <Button icon="pi pi-download" :label="$t('subscription.export_history') || 'Eksport'" text class="!text-[12px] !font-bold !rounded-lg !py-1" />
        </div>
        <div class="p-4 flex-1 overflow-y-auto">
          <div v-if="invoices.length === 0" class="py-10 text-center space-y-4">
            <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <i class="pi pi-file-o text-slate-300"></i>
            </div>
            <p class="text-[12px] font-bold text-slate-400 tracking-widest italic">{{ $t('subscription.no_history') || "Cheklar mavjud emas" }}</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(inv, idx) in invoices" :key="idx" class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group relative overflow-hidden">
              
              <!-- Top Section -->
              <div class="flex justify-between items-start gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-105 transition-transform">
                    <i class="pi pi-receipt"></i>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {{ inv.plan_name || inv.plan?.name || "Tarif to'lovi" }}
                      </p>
                      <span class="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded"
                            :class="inv.is_yearly ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20'">
                        {{ inv.is_yearly ? ($t('subscription.yearly') || 'Yillik') : ($t('subscription.monthly') || 'Oylik') }}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                      <i class="pi pi-calendar text-[9px]"></i>
                      {{ inv.period_from }} &mdash; {{ inv.period_to }}
                    </p>
                  </div>
                </div>
                <div class="text-right flex flex-col items-end">
                  <p class="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {{ formatCurrency(inv.amount) }}
                  </p>
                  <p class="text-[10px] text-slate-400 font-medium mt-0.5">
                    {{ inv.paid_at || inv.created_at }}
                  </p>
                </div>
              </div>

              <!-- Divider -->
              <div class="h-px w-full bg-slate-50 dark:bg-slate-800/50"></div>

              <!-- Bottom Section -->
              <div class="flex items-center justify-between">
                <p class="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1 flex-1 pr-4">
                  {{ inv.description || "Ta'rif uchun to'lov" }}
                </p>
                <div class="flex items-center gap-2 shrink-0">
                  <div v-if="inv.created_by" class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                    <i class="pi pi-user text-[10px] text-slate-400"></i>
                    <span class="text-[10px] font-bold text-slate-500 dark:text-slate-300 max-w-[100px] truncate">{{ inv.created_by }}</span>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    #{{ inv.id || idx + 1 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import { useSettingsStore } from '@/store/settings'

defineProps({
  loadingBilling: {
    type: Boolean,
    default: false
  },
  balanceTransactions: {
    type: Array,
    default: () => []
  },
  invoices: {
    type: Array,
    default: () => []
  }
})

const settingsStore = useSettingsStore()
const formatCurrency = (value) => settingsStore.formatPrice(value)
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
