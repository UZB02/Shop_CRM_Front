<template>
  <div
    class="group flex items-center gap-3 px-3.5 py-4 rounded-xl border transition-all duration-200 cursor-pointer select-none font-inter"
    :class="active
      ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/30'
      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/20'"
    @click="$emit('toggle', perm.value)"
  >
    <!-- Custom Checkbox -->
    <div
      class="flex-shrink-0 w-4.5 h-4.5 rounded md border-2 flex items-center justify-center transition-all"
      :class="active ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-slate-200 dark:border-slate-700'"
    >
      <i v-if="active" class="pi pi-check text-white" style="font-size:9px"></i>
    </div>

    <!-- Module icon -->
    <div
      class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-sm"
      :class="active ? 'bg-white dark:bg-slate-800 text-emerald-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'"
    >
      <i :class="['pi', perm.icon]" style="font-size:11px"></i>
    </div>

    <!-- Label -->
    <span
      class="flex-1 text-[13px] font-bold leading-none transition-colors"
      :class="active ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'"
    >
      {{ $t(`workers.permissions_list.${perm.value}.label`) }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  perm:   { type: Object,  required: true },
  active: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>


