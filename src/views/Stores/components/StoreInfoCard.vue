<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <template v-if="loading">
      <div class="p-6 sm:p-8 flex items-start gap-5 animate-pulse">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0"></div>
        <div class="flex-1 space-y-3">
          <div class="h-5 bg-slate-100 dark:bg-slate-800 rounded w-48"></div>
          <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-64"></div>
        </div>
      </div>
    </template>

    <template v-else-if="store.id || store._id">
      <div class="p-5 sm:p-8">
        <div class="flex items-center gap-3 sm:gap-5 mb-3 sm:mb-0">
          <div class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-building text-xl sm:text-2xl text-emerald-500"></i>
          </div>

          <div class="flex-1 min-w-0">
            <h2 class="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">
              {{ store.name }}
            </h2>
            <div class="mt-1 sm:mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span v-if="store.location" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <i class="pi pi-map-marker text-[9px] text-emerald-500"></i>{{ store.location }}
              </span>
              <span v-if="store.phone" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <i class="pi pi-phone text-[9px] text-emerald-500"></i>{{ store.phone }}
              </span>
              <span v-if="store.openingHours" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <i class="pi pi-clock text-[9px] text-emerald-500"></i>{{ store.openingHours }}
              </span>
              <span v-if="store.address" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <i class="pi pi-home text-[9px] text-emerald-500"></i>{{ store.address }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <span :class="[
              'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
              store.status === 'active'
                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            ]">
              {{ store.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
            </span>
            <button
              @click="$emit('edit')"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
              :title="$t('stores.edit_store')"
            >
              <i class="pi pi-pencil text-xs sm:text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-building text-2xl text-slate-400"></i>
        </div>
        <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{{ $t('stores.no_store') }}</p>
        <button
          @click="$emit('add')"
          class="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
        >
          <i class="pi pi-plus mr-2"></i>{{ $t('stores.add_store') }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  store: { type: Object, default: () => ({}) },
  loading: Boolean
})
defineEmits(['edit', 'add'])
</script>
