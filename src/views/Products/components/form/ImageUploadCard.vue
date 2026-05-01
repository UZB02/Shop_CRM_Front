<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
        <i class="pi pi-image text-white text-[12px]"></i>
      </div>
      <div>
        <h2 class="text-[12px] font-black tracking-widest text-slate-800 dark:text-slate-100">{{ $t('products.form.image') }}</h2>
      </div>
    </div>

    <div class="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
      <div
        class="relative w-full aspect-square rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-emerald-400/50 transition-all duration-500 shrink-0"
        @click="fileInput.click()"
      >
        <img
          v-if="previewUrl || imageUrl"
          :src="previewUrl || imageUrl"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div v-else class="flex flex-col items-center gap-3 text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-all">
          <i class="pi pi-cloud-upload text-2xl"></i>
          <span class="text-[11px] font-black tracking-widest">{{ $t('products.form.upload_image') }}</span>
        </div>

        <!-- Overlays -->
        <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-2 backdrop-blur-md">
          <button type="button" class="px-4 py-2 rounded-lg bg-white text-slate-900 text-[11px] font-black tracking-widest shadow-xl">
             {{ $t('products.form.change') }}
          </button>
          <button v-if="previewUrl || imageUrl" type="button" @click.stop="$emit('remove')" class="px-4 py-2 rounded-lg bg-rose-500 text-white text-[11px] font-black tracking-widest shadow-xl">
             {{ $t('common.delete') }}
          </button>
        </div>
      </div>

      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="$emit('select', $event)" />

      <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
        <i class="pi pi-sparkles text-emerald-500 text-[12px] shrink-0"></i>
        <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">{{ $t('products.form.image_tip') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  imageUrl: String,
  previewUrl: String
})

const emit = defineEmits(['select', 'remove'])
const fileInput = ref(null)

defineExpose({
  click: () => fileInput.value?.click()
})
</script>


