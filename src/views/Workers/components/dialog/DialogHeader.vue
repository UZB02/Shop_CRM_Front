<template>
  <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
        <i :class="isEdit ? 'pi pi-user-edit' : 'pi pi-user-plus'" class="text-xl"></i>
      </div>
      <div>
        <h2 class="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
          {{ isEdit ? $t('workers.actions.edit') : $t('workers.actions.add') }}
        </h2>
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          {{ isEdit ? $t('workers.actions.update_desc') : $t('workers.actions.add_desc') }}
        </p>
      </div>
    </div>
    <button
      class="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all"
      @click="$emit('close')"
    >
      <i class="pi pi-times text-xs"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isEdit: Boolean,
})
defineEmits(['close'])
</script>
