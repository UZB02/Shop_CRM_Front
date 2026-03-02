<template>
  <div class="modern-table-container">
    <div class="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Nomi</th>
              <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Manzil</th>
              <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Status</th>
              <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <template v-if="loading">
              <tr v-for="i in 3" :key="i">
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 animate-pulse"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 animate-pulse"></div></td>
                <td class="px-6 py-4"><div class="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-16 mx-auto animate-pulse"></div></td>
                <td class="px-6 py-4 ml-auto"><div class="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-16 ml-auto animate-pulse"></div></td>
              </tr>
            </template>
            
            <template v-else-if="!stores.length">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Do'konlar mavjud emas</p>
                </td>
              </tr>
            </template>

            <tr v-for="data in stores" :key="data.id || data._id" class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-colors">
              <td class="px-6 py-4">
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ data.name }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5">
                  <i class="pi pi-map-marker text-[10px] text-slate-400"></i>
                  <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ data.location || '—' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="getStatusClass(data.status)" class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                  {{ data.status === 'Active' ? 'Faol' : 'Nofaol' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                  <button @click="$emit('edit', data)" class="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                    <i class="pi pi-pencil text-[10px]"></i>
                  </button>
                  <button @click="$emit('delete', data)" class="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                    <i class="pi pi-trash text-[10px]"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stores: Array,
  loading: Boolean
})

defineEmits(['edit', 'delete'])

const getStatusClass = (status) => {
  if (status === 'Active') {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
  }
  return 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
}
</script>
