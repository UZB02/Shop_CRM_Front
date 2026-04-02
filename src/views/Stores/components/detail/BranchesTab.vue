<template>
  <div class="space-y-4">
    <!-- Filters -->
    <BranchFilters
      v-model:search="search"
      v-model:status="statusFilter"
    />

    <!-- Card -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <!-- Empty State -->
      <div v-if="!filtered.length" class="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
        <i class="pi pi-sitemap text-4xl"></i>
        <p class="text-[10px] font-black uppercase tracking-[0.3em]">{{ $t('stores.no_branches') }}</p>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="flex items-center gap-3 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/10">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i class="pi pi-sitemap text-[10px] text-emerald-500"></i>
          </div>
          <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
            {{ $t('stores.branches_title') }}
          </span>
          <span class="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black">
            {{ filtered.length }} {{ $t('stores.count_suffix') }}
          </span>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-slate-800/20">
                <th class="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.col_branch') }}</th>
                <th class="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.col_address') }}</th>
                <th class="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.col_phone') }}</th>
                <th class="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">{{ $t('stores.col_status') }}</th>
                <th class="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 text-right">{{ $t('stores.col_actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
              <tr
                v-for="branch in filtered"
                :key="branch.id"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
              >
                <!-- Name -->
                <td class="px-6 py-4">
                  <router-link :to="`/dashboard/branches/${branch.id}`" class="flex items-center gap-3 group/link">
                    <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover/link:bg-emerald-500 group-hover/link:text-white transition-all duration-300 shrink-0">
                      <i class="pi pi-sitemap text-sm"></i>
                    </div>
                    <span class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover/link:text-emerald-500 transition-colors">{{ branch.name }}</span>
                  </router-link>
                </td>

                <!-- Address -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <i class="pi pi-map-marker text-[9px] text-emerald-500 shrink-0"></i>
                    {{ branch.address || '—' }}
                  </div>
                </td>

                <!-- Phone -->
                <td class="px-6 py-4">
                  <a :href="'tel:' + branch.phone" class="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors">
                    <i class="pi pi-phone text-[9px] text-emerald-500 shrink-0"></i>
                    {{ branch.phone || '—' }}
                  </a>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    :class="branch.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full"
                      :class="branch.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
                    ></span>
                    {{ branch.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <router-link
                      :to="`/dashboard/branches/${branch.id}/bulk`"
                      class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                      v-tooltip.top="'Ommaviy yuklash'"
                    >
                      <i class="pi pi-database text-sm"></i>
                    </router-link>
                    <button
                      @click="$emit('edit', branch)"
                      class="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                      v-tooltip.top="'Tahrirlash'"
                    >
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                    <button
                      @click="$emit('delete', branch)"
                      class="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
                      v-tooltip.top="`O'chirish`"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-slate-50 dark:divide-slate-800/50">
          <div
            v-for="branch in filtered"
            :key="branch.id"
            class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <i class="pi pi-sitemap text-sm"></i>
            </div>
            <router-link :to="`/dashboard/branches/${branch.id}`" class="flex-1 min-w-0">
              <p class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate hover:text-emerald-500 transition-colors">{{ branch.name }}</p>
              <p class="text-[10px] font-bold text-slate-400 truncate mt-0.5">
                <i class="pi pi-map-marker text-[8px]"></i> {{ branch.address || '—' }}
              </p>
            </router-link>
            <div class="flex items-center gap-1.5 shrink-0">
              <router-link
                :to="`/dashboard/branches/${branch.id}/bulk`"
                class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center active:scale-95"
                v-tooltip.top="'Ommaviy yuklash'"
              ><i class="pi pi-database text-xs"></i></router-link>
              <button
                @click="$emit('edit', branch)"
                class="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center active:scale-95"
                v-tooltip.top="'Tahrirlash'"
              ><i class="pi pi-pencil text-xs"></i></button>
              <button
                @click="$emit('delete', branch)"
                class="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center active:scale-95"
                v-tooltip.top="`O'chirish`"
              ><i class="pi pi-trash text-xs"></i></button>
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
