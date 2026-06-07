<template>
  <div class="space-y-4">
    <!-- Filters -->
    <BranchFilters
      v-model:search="search"
      v-model:status="statusFilter"
    />

    <!-- Main Container (Design matches ProductTable) -->
    <div class="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
      
      <!-- Empty State (Global for both mobile and desktop) -->
      <div v-if="!filtered.length" class="py-24 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
          <i class="pi pi-sitemap text-2xl text-slate-300 dark:text-slate-600"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{{ $t('stores.no_branches') }}</h3>
      </div>

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap">{{ $t('stores.col_branch') }}</th>
                <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap">{{ $t('stores.col_address') }}</th>
                <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap">{{ $t('stores.col_phone') }}</th>
                <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap text-center">{{ $t('stores.col_status') }}</th>
                <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap text-right">{{ $t('stores.col_actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
              <tr
                v-for="branch in filtered"
                :key="branch.id"
                class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all duration-200 border-b border-slate-50 dark:border-slate-800 last:border-none"
              >
                <!-- Name -->
                <td class="px-6 py-3.5">
                  <router-link :to="`/dashboard/branches/${branch.id}`" class="flex items-center gap-3 group/link">
                    <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center text-emerald-500 group-hover/link:scale-105 transition-transform">
                      <i class="pi pi-sitemap text-lg"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[15px] font-black text-slate-800 dark:text-slate-200 tracking-tight leading-tight group-hover/link:text-emerald-500 transition-colors">{{ branch.name }}</span>
                      <span class="text-[11px] font-black text-slate-400 tracking-widest mt-0.5">{{ $t('stores.branch_label') }}</span>
                    </div>
                  </router-link>
                </td>

                <!-- Address -->
                <td class="px-6 py-3.5">
                  <div class="flex flex-col gap-0.5 max-w-[280px]">
                    <span v-if="branch.region_name || branch.district_name" class="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                      <i class="pi pi-map text-[9px] opacity-80"></i>
                      {{ [branch.region_name, branch.district_name].filter(Boolean).join(', ') }}
                    </span>
                    <div class="flex items-center gap-1.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 leading-tight">
                      <i v-if="!branch.region_name && !branch.district_name" class="pi pi-map-marker text-[12px] text-slate-400/60"></i>
                      <span class="truncate" v-tooltip.top="branch.address">{{ branch.address || '—' }}</span>
                    </div>
                  </div>
                </td>

                <!-- Phone -->
                <td class="px-6 py-3.5">
                  <a :href="'tel:' + branch.phone" class="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors">
                    <i class="pi pi-phone text-[12px] text-emerald-500/60"></i>
                    {{ branch.phone || '—' }}
                  </a>
                </td>

                <!-- Status -->
                <td class="px-6 py-3.5 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest border"
                    :class="branch.status === 'active'
                      ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'"
                  >
                    <span class="w-1 h-1 rounded-full"
                      :class="branch.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
                    ></span>
                    {{ branch.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-3.5">
                  <div class="flex items-center justify-end gap-1 opacity-100 lg:opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="$router.push(`/dashboard/branches/${branch.id}/bulk`)"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:text-sky-400 dark:hover:bg-sky-400/10 transition-all hover:scale-105"
                      v-tooltip.top="$t('warehouse.bulk.title')"
                    >
                      <i class="pi pi-database text-[16px]"></i>
                    </button>
                    <button
                      @click="$emit('edit', branch)"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-400/10 transition-all hover:scale-105"
                      v-tooltip.top="'Tahrirlash'"
                    >
                      <i class="pi pi-pencil text-[16px]"></i>
                    </button>
                    <button
                      @click="$emit('delete', branch)"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-400/10 transition-all hover:scale-105"
                      v-tooltip.top="`O'chirish`"
                    >
                      <i class="pi pi-trash text-[16px]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/30">
          <div
            v-for="branch in filtered"
            :key="branch.id"
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm relative transition-all active:scale-[0.98]"
          >
            <!-- Absolute Action Menu -->
            <div class="absolute top-3 right-3 flex items-center gap-1">
              <button
                @click="$router.push(`/dashboard/branches/${branch.id}/bulk`)"
                class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 active:scale-95 shadow-sm"
              ><i class="pi pi-database text-[12px]"></i></button>
              <button
                @click="$emit('edit', branch)"
                class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 active:scale-95 shadow-sm"
              ><i class="pi pi-pencil text-[12px]"></i></button>
              <button
                @click="$emit('delete', branch)"
                class="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 active:scale-95 shadow-sm"
              ><i class="pi pi-trash text-[12px]"></i></button>
            </div>

            <!-- Branch Info -->
            <router-link :to="`/dashboard/branches/${branch.id}`" class="flex gap-3">
              <div class="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-emerald-500 shrink-0">
                <i class="pi pi-sitemap text-xl"></i>
              </div>
              <div class="flex-1 flex flex-col justify-center min-w-0 pr-24">
                <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100 truncate hover:text-emerald-500 transition-colors">{{ branch.name }}</h3>
                <span class="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-0.5 truncate">{{ $t('stores.branch_label') }}</span>
              </div>
            </router-link>

            <!-- Metadata -->
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-2">
              <div class="flex items-start gap-2">
                <i class="pi pi-map-marker text-[12px] text-slate-400 mt-0.5"></i>
                <div class="flex flex-col">
                  <span v-if="branch.region_name || branch.district_name" class="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {{ [branch.region_name, branch.district_name].filter(Boolean).join(', ') }}
                  </span>
                  <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 leading-tight">
                    {{ branch.address || '—' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-1">
                <a :href="'tel:' + branch.phone" class="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                  <i class="pi pi-phone text-[11px] text-emerald-500/60"></i>
                  {{ branch.phone || '—' }}
                </a>
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest border"
                  :class="branch.status === 'active'
                    ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="branch.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
                  ></span>
                  {{ branch.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BranchFilters from '../BranchFilters.vue'

const props = defineProps({
  branches: {
    type: Array,
    default: () => []
  }
})
defineEmits(['edit', 'delete'])

const search       = ref('')
const statusFilter = ref('all')

const filtered = computed(() => {
  let result = props.branches ?? []

  if (statusFilter.value !== 'all') {
    result = result.filter(b => b.status === statusFilter.value)
  }

  const q = search.value.trim().toLowerCase()
  if (q) {
    result = result.filter(b =>
      (b.name    || '').toLowerCase().includes(q) ||
      (b.address || '').toLowerCase().includes(q) ||
      (b.phone   || '').toLowerCase().includes(q)
    )
  }

  return result
})
</script>

<style scoped>
/* Scrollbar styles if needed */
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
.dark .overflow-x-auto::-webkit-scrollbar-thumb { background: #334155; }
</style>


