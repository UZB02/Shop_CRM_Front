<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <!-- Card Header -->
    <div class="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
      <div
        class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="colorMap[color]?.bg"
      >
        <i :class="['pi', icon, 'text-sm', colorMap[color]?.icon]"></i>
      </div>
      <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ title }}</h2>
    </div>

    <!-- Card Body -->
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'pi-cog' },
  color: { type: String, default: 'emerald' }
})

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
  blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-500' },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-500' },
  purple:  { bg: 'bg-purple-500/10',  icon: 'text-purple-500' },
  rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-500' },
  slate:   { bg: 'bg-slate-500/10',   icon: 'text-slate-500' },
}
</script>
