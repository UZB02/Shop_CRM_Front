<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[700px]">
      <thead>
        <tr class="border-b border-slate-100 dark:border-slate-800">
          <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase">
            {{ $t('suppliers.table.name') }}
          </th>
          <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase hidden sm:table-cell">
            {{ $t('suppliers.table.phone') }}
          </th>
          <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase hidden md:table-cell">
            {{ $t('suppliers.table.company') }}
          </th>
          <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase hidden lg:table-cell">
            {{ $t('suppliers.table.address') }}
          </th>
          <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest uppercase">
            {{ $t('suppliers.table.debt') }}
          </th>
          <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest uppercase hidden sm:table-cell">
            {{ $t('suppliers.table.status') }}
          </th>
          <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest uppercase">
            {{ $t('suppliers.table.actions') }}
          </th>
        </tr>
      </thead>

      <!-- Loading skeleton -->
      <tbody v-if="loading">
        <tr v-for="i in 6" :key="i" class="border-b border-slate-50 dark:border-slate-800/50">
          <td class="px-4 py-3" colspan="7">
            <div class="h-6 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse w-full" />
          </td>
        </tr>
      </tbody>

      <!-- Empty state -->
      <tbody v-else-if="!suppliers.length">
        <tr>
          <td colspan="7" class="px-4 py-20 text-center">
            <div class="flex flex-col items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                <i class="pi pi-users text-2xl text-slate-300 dark:text-slate-600" />
              </div>
              <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ $t('suppliers.no_suppliers') }}</p>
              <p class="text-xs text-slate-400">{{ $t('suppliers.no_suppliers_desc') }}</p>
              <button
                @click="$emit('add')"
                class="mt-1 h-8 px-4 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm"
              >
                <i class="pi pi-plus text-[11px] mr-1" />{{ $t('suppliers.new_supplier') }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>

      <!-- Data -->
      <tbody v-else>
        <tr
          v-for="sup in suppliers"
          :key="sup.id"
          class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
        >
          <!-- Name + date -->
          <td class="px-4 py-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-sm">
                <span class="text-white text-xs font-black">{{ sup.name?.[0]?.toUpperCase() || 'S' }}</span>
              </div>
              <div class="min-w-0">
                <router-link :to="`/dashboard/suppliers/${sup.id}`" class="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors block">
                  {{ sup.name }}
                </router-link>
                <p class="text-[11px] text-slate-400 truncate">{{ sup.created_on || '—' }}</p>
              </div>
            </div>
          </td>

          <!-- Phone -->
          <td class="px-4 py-3 hidden sm:table-cell">
            <span v-if="sup.phone" class="text-[13px] text-slate-600 dark:text-slate-300 font-medium">{{ sup.phone }}</span>
            <span v-else class="text-[12px] text-slate-300 italic">{{ $t('common.not_specified') }}</span>
          </td>

          <!-- Company -->
          <td class="px-4 py-3 hidden md:table-cell">
            <span v-if="sup.company" class="text-[13px] text-slate-600 dark:text-slate-300">{{ sup.company }}</span>
            <span v-else class="text-[12px] text-slate-300 italic">—</span>
          </td>

          <!-- Address -->
          <td class="px-4 py-3 hidden lg:table-cell">
            <span v-if="sup.address" class="text-[13px] text-slate-600 dark:text-slate-300 truncate max-w-[200px] block" :title="sup.address">{{ sup.address }}</span>
            <span v-else class="text-[12px] text-slate-300 italic">—</span>
          </td>

          <!-- Debt -->
          <td class="px-4 py-3 text-right">
            <span
              class="text-[13px] font-black"
              :class="Number(sup.debt_balance) > 0 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'"
            >
              {{ formatMoney(sup.debt_balance) }}
            </span>
          </td>

          <!-- Status -->
          <td class="px-4 py-3 text-center hidden sm:table-cell">
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
              :class="sup.status === 'active'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'"
            >
              <span class="w-1.5 h-1.5 rounded-full"
                :class="sup.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'" />
              {{ sup.status_display || (sup.status === 'active' ? $t('common.active') : $t('common.inactive')) }}
            </span>
          </td>

          <!-- Actions -->
          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-1">
              <!-- Pay button -->
              <button
                v-if="sup.status === 'active'"
                @click="$emit('pay', sup)"
                v-tooltip.top="$t('suppliers.pay_tooltip')"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
              >
                <i class="pi pi-wallet text-[12px]" />
              </button>
              <!-- Edit -->
              <button
                @click="$emit('edit', sup)"
                v-tooltip.top="$t('common.edit')"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                <i class="pi pi-pencil text-[12px]" />
              </button>
              <!-- Delete -->
              <button
                @click="$emit('delete', sup)"
                v-tooltip.top="$t('common.delete') || 'O\'chirish'"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <i class="pi pi-trash text-[12px]" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  suppliers: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
defineEmits(['edit', 'delete', 'pay', 'add'])

const formatMoney = (val) => {
  const n = Number(val) || 0
  if (n === 0) return '0 UZS'
  return n.toLocaleString('uz-UZ') + ' UZS'
}
</script>
