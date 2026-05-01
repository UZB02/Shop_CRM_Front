<template>
  <div class="overflow-x-auto custom-scrollbar">
    <table class="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
          <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('warehouse.warehouse_name') }}</th>
          <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('warehouse.warehouse_address') }}</th>
          <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('common.status') }}</th>
          <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-right font-inter">{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in warehouses" :key="w.id || w._id" class="group border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
          <td class="px-6 py-4">
            <div 
              class="flex items-center gap-3 cursor-pointer group/name" 
              @click="$router.push(`/dashboard/warehouse/${w.id || w._id}`)"
            >
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center transition-all group-hover/name:bg-emerald-500 group-hover/name:text-white group-hover/name:rotate-12">
                <i class="pi pi-box text-emerald-500 group-hover/name:text-white text-xs"></i>
              </div>
              <span class="text-[13px] font-black text-slate-700 dark:text-slate-200 tracking-tight group-hover/name:text-emerald-500 transition-colors">{{ w.name }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker text-[12px] text-slate-400"></i>
              <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{{ w.address || '—' }}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <div 
                class="w-1.5 h-1.5 rounded-full" 
                :class="w.status === 'inactive' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'"
              ></div>
              <span class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-widest">
                {{ w.status === 'inactive' ? $t('common.inactive') : $t('common.active') }}
              </span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex justify-end gap-2 text-left">
              <button
                @click="$emit('move', w)"
                v-tooltip.left="'Kirim / Chiqim'"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                <i class="pi pi-sync text-[12px]"></i>
              </button>
              <button
                @click="$emit('edit', w)"
                v-tooltip.left="'Tahrirlash'"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                <i class="pi pi-pencil text-[12px]"></i>
              </button>
              <button
                @click="$emit('delete', w)"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              >
                <i class="pi pi-trash text-[12px]"></i>
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
defineEmits(['edit', 'delete', 'move'])
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


