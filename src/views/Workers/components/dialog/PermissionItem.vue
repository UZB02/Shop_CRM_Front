<template>
  <!-- Active state: badge yashil, label bo'yalgan -->
  <div
    class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none"
    :class="active
      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-sm'
      : 'bg-white/5 dark:bg-slate-900/50 border-slate-800 hover:border-emerald-500/20 hover:bg-emerald-500/5'"
    @click="$emit('toggle', perm.value)"
  >
    <!-- Custom Checkbox -->
    <div
      class="flex-shrink-0 w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all"
      :class="active ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'"
    >
      <i v-if="active" class="pi pi-check text-white" style="font-size:8px"></i>
    </div>

    <!-- Module icon -->
    <div
      class="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
      :class="active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-200/10 text-slate-500'"
    >
      <i :class="['pi', perm.icon]" style="font-size:10px"></i>
    </div>

    <!-- Label -->
    <span
      class="flex-1 text-[11px] font-black leading-none transition-colors"
      :class="active ? 'text-emerald-300' : 'text-slate-400'"
    >{{ perm.label }}</span>
  </div>
</template>

<script setup>
defineProps({
  perm:   { type: Object,  required: true },
  active: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>
