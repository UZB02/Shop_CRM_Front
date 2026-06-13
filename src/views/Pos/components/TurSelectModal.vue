<template>
  <Dialog
    :visible="visible"
    :header="product?.name"
    modal
    class="w-full max-w-lg"
    :pt="{
      root:    { class: 'dark:bg-slate-900 border-none rounded-3xl shadow-2xl overflow-hidden' },
      header:  { class: 'px-8 pt-8 pb-4 dark:bg-slate-900 border-none font-black tracking-tighter text-xl' },
      content: { class: 'px-8 pb-8 pt-2 dark:bg-slate-900' },
    }"
    @update:visible="(v) => !v && emit('close')"
  >
    <!-- Loading skeleton -->
    <div v-if="loading" class="flex flex-col gap-3 py-4">
      <div v-for="i in 3" :key="i" class="h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
    </div>

    <!-- Tur grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
      <button
        v-for="tur in turlar"
        :key="tur.id"
        @click="emit('select', tur)"
        class="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/10 transition-all group relative overflow-hidden"
      >
        <span class="text-sm font-black text-slate-800 dark:text-slate-200 mb-1 tracking-tight">{{ tur.name }}</span>
        <span v-if="tur.color" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ tur.color }}</span>

        <div class="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="pi pi-plus-circle text-emerald-500" />
        </div>
      </button>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  visible: { type: Boolean, default: false },
  product: { type: Object,  default: null  },
  turlar:  { type: Array,   default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'close'])
</script>
