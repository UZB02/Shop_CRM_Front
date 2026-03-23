<template>
  <div class="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
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
      <!-- MOBILE VIEW: Compact and Side-by-Side (Max 2-3 rows) -->
      <div class="block sm:hidden p-5 space-y-4">
        <div class="flex items-start gap-4">
          <!-- Small Icon -->
          <div class="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <i class="pi pi-building text-white text-2xl font-black"></i>
          </div>
          <div class="flex-1 min-w-0">
            <router-link :to="`/dashboard/stores/${store.id || store._id}`" class="block">
              <h2 class="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate mb-1.5 leading-tight">
                {{ store.name }}
              </h2>
            </router-link>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-500 font-black tracking-widest border border-slate-200 dark:border-slate-700">
                ID: {{ store.id || store._id }}
              </span>
              <span :class="[
                'px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border',
                store.status === 'active' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              ]">
                {{ store.status === 'active' ? 'FAOL' : 'NOFAOL' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-4 border-t border-slate-50 dark:border-slate-800/50">
           <div v-if="store.phone" class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-2xl border border-slate-100 dark:border-slate-700/50 max-w-[150px] truncate">
              <i class="pi pi-phone text-[8px] text-emerald-500"></i>{{ store.phone }}
           </div>
           <div class="flex items-center gap-2">
             <button @click="$emit('edit')" class="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm transition-transform active:scale-95"><i class="pi pi-pencil text-[10px]"></i></button>
             <router-link :to="`/dashboard/stores/${store.id || store._id}`" class="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"><i class="pi pi-arrow-right text-[10px]"></i></router-link>
           </div>
        </div>
      </div>

      <!-- DESKTOP VIEW: Horizontal and Professional -->
      <div class="hidden sm:block p-6">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0 transform transition-transform hover:scale-105">
            <i class="pi pi-building text-white text-3xl font-black"></i>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3">
              <router-link 
                :to="`/dashboard/stores/${store.id || store._id}`"
                class="group/title inline-flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer"
              >
                <h2 class="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate group-hover/title:text-emerald-500 transition-colors">
                  {{ store.name }}
                </h2>
              </router-link>
              <span class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-500 dark:text-slate-400 font-black tracking-widest border border-slate-200 dark:border-slate-700">
                ID: {{ store.id || store._id }}
              </span>
              <span :class="[
                'px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border',
                store.status === 'active' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              ]">
                {{ store.status === 'active' ? 'FAOL' : 'NOFAOL' }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <div v-if="store.phone" class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700/50">
                <i class="pi pi-phone text-[9px] text-emerald-500"></i>{{ store.phone }}
              </div>
              <div v-if="store.address" class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700/50">
                <i class="pi pi-map-marker text-[9px] text-emerald-500"></i>{{ store.address }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
             <button @click="$emit('edit')" class="w-11 h-11 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"><i class="pi pi-pencil text-sm"></i></button>
             <router-link :to="`/dashboard/stores/${store.id || store._id}`" class="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"><i class="pi pi-arrow-right text-sm"></i></router-link>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="p-10 text-center">
        <div class="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
          <i class="pi pi-building text-3xl text-slate-300"></i>
        </div>
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">{{ $t('stores.no_store') }}</h3>
        <button @click="$emit('add')" class="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20">
          <i class="pi pi-plus font-bold"></i>{{ $t('stores.add_store') }}
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
