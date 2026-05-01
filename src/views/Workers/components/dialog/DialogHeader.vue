<template>
  <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-inter">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
        <i :class="isEdit ? 'pi pi-user-edit' : 'pi pi-user-plus'" class="text-base"></i>
      </div>
      <div>
        <h2 class="text-sm font-semibold text-slate-800 dark:text-white leading-none tracking-tight">
          {{ isEdit ? $t('workers.actions.edit') : $t('workers.actions.add') }}
        </h2>
        <p class="text-[12px] font-medium text-slate-400 dark:text-slate-500 mt-1 tracking-widest">
          {{ isEdit ? $t('workers.actions.update_desc') : $t('workers.actions.add_desc') }}
        </p>
      </div>
    </div>
    <button
      class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
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


