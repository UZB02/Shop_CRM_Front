<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/30">
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_branch') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_store') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_phone') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_status') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">{{ $t('stores.col_actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <!-- Loading -->
          <template v-if="loading">
            <tr v-for="i in 4" :key="i">
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-14 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-16 ml-auto animate-pulse"></div></td>
            </tr>
          </template>

          <!-- Empty -->
          <template v-else-if="!branches.length">
            <tr>
              <td colspan="5" class="px-6 py-14 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <i class="pi pi-sitemap text-xl text-slate-400"></i>
                </div>
                <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ $t('stores.no_branches') }}</p>
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <tr
            v-for="data in branches"
            :key="data.id"
            class="group hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-sitemap text-[10px] text-blue-500"></i>
                </div>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ data.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                {{ data.store_name || '—' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5">
                <i class="pi pi-phone text-[10px] text-slate-400"></i>
                <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{{ data.phone || '—' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider',
                data.status === 'active'
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              ]">
                {{ data.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  @click="$emit('edit', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                  :title="$t('common.edit')"
                >
                  <i class="pi pi-pencil text-[10px]"></i>
                </button>
                <button
                  @click="$emit('delete', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                  :title="$t('common.delete')"
                >
                  <i class="pi pi-trash text-[10px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  branches: { type: Array, default: () => [] },
  loading: Boolean
})
defineEmits(['edit', 'delete'])
</script>
