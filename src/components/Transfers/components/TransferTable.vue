<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
    <!-- Loading overlay -->
    <div v-if="loading" class="divide-y divide-slate-100 dark:divide-slate-800">
      <div v-for="n in 4" :key="n" class="flex items-center gap-4 px-6 py-4">
        <div class="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
        <div class="h-4 flex-1 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
        <div class="h-4 flex-1 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
        <div class="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
        <div class="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!transfers.length"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <i class="pi pi-arrows-h text-slate-400 text-xl"></i>
      </div>
      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">O'tkazmalar topilmadi</p>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {{ activeStatus !== 'all' ? 'Bu holatda o\'tkazmalar yo\'q' : 'Hali birorta o\'tkazma yaratilmagan' }}
      </p>
    </div>

    <!-- Transfers table -->
    <div v-else class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-sm text-left min-w-[780px]">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">ID / Sana</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Yo'nalish</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">Mahsulot</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Xodim</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">Holat</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Amallar</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
          <tr
            v-for="t in transfers"
            :key="t.id"
            class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
          >
            <!-- ID / Date -->
            <td class="px-5 py-3.5">
              <div class="font-medium text-slate-700 dark:text-slate-300 text-xs">#{{ t.id }}</div>
              <div class="text-xs text-slate-400 mt-0.5">{{ t.created_on }}</div>
            </td>

            <!-- Direction -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5">
                  <i class="pi text-xs" :class="[locationIcon(t.from_location_type), t.from_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500']"></i>
                  <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ t.from_location_name }}</span>
                </div>
                <i class="pi pi-arrow-right text-[10px] text-slate-300 dark:text-slate-600 shrink-0"></i>
                <div class="flex items-center gap-1.5">
                  <i class="pi text-xs" :class="[locationIcon(t.to_location_type), t.to_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500']"></i>
                  <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ t.to_location_name }}</span>
                </div>
              </div>
            </td>

            <!-- Item count -->
            <td class="px-5 py-3.5 text-center">
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {{ t.item_count ?? t.items?.length ?? 0 }} dona
              </span>
            </td>

            <!-- Worker -->
            <td class="px-5 py-3.5">
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ t.worker_name || '—' }}</span>
            </td>

            <!-- Status -->
            <td class="px-5 py-3.5">
              <div class="flex justify-center">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="statusClass(t.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current" :class="t.status === 'pending' ? 'animate-pulse' : ''"></span>
                  {{ t.status_display || t.status }}
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  @click="$emit('view', t)"
                  class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                >
                  <i class="pi pi-eye text-xs"></i>
                </button>
                <template v-if="t.status === 'pending'">
                  <button
                    v-if="t.direction === 'in'"
                    @click="$emit('confirm', t)"
                    class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all flex items-center justify-center"
                  >
                    <i class="pi pi-check text-xs"></i>
                  </button>
                  <button
                    @click="$emit('cancel', t)"
                    class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center"
                  >
                    <i class="pi pi-times text-xs"></i>
                  </button>
                </template>
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
  transfers: Array,
  loading: Boolean,
  activeStatus: String
});

defineEmits(['view', 'confirm', 'cancel']);

const locationIcon = (locationType) => {
  return locationType === 'branch' ? 'pi-building' : 'pi-box';
}

const statusClass = (status) => {
  switch (status) {
    case 'pending':   return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'confirmed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    case 'cancelled': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    default:          return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
