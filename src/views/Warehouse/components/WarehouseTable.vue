<template>
  <div class="overflow-x-auto custom-scrollbar rounded-[2rem] border border-slate-100 dark:border-slate-800">
    <table class="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr class="bg-slate-50/50 dark:bg-slate-800/30">
          <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('warehouse.warehouse_name') }}</th>
          <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('warehouse.warehouse_address') }}</th>
          <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('common.status') }}</th>
          <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in warehouses" :key="w.id || w._id" class="group border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <i class="pi pi-box text-emerald-500 text-xs"></i>
              </div>
              <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ w.name }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker text-[10px] text-slate-400"></i>
              <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{{ w.address || '—' }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ $t('common.active') }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex justify-end gap-2">
              <button
                @click="$emit('edit', w)"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                <i class="pi pi-pencil text-[10px]"></i>
              </button>
              <button
                @click="$emit('delete', w)"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              >
                <i class="pi pi-trash text-[10px]"></i>
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
  warehouses: Array
})
defineEmits(['edit', 'delete'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.2);
  border-radius: 10px;
}
</style>
