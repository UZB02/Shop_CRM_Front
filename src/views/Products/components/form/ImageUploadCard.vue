<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="flex items-center gap-3 px-7 py-5 border-b border-slate-100 dark:border-slate-800">
      <div class="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
        <i class="pi pi-image text-violet-500 text-sm"></i>
      </div>
      <h2 class="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{{ $t('products.form.image') }}</h2>
    </div>

    <div class="p-7 space-y-4">
      <div
        class="relative w-full aspect-video rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-emerald-400/50 transition-all duration-300"
        @click="fileInput.click()"
      >
        <img
          v-if="previewUrl || imageUrl"
          :src="previewUrl || imageUrl"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div v-else class="flex flex-col items-center gap-3 text-slate-300 group-hover:text-emerald-500 transition-colors">
          <i class="pi pi-cloud-upload text-3xl"></i>
          <span class="text-[10px] font-bold uppercase tracking-widest">{{ $t('products.form.upload_image') }}</span>
        </div>

        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <span class="px-3 py-1.5 rounded-lg bg-white/20 text-white text-[10px] font-bold backdrop-blur-md">
            <i class="pi pi-pencil mr-1"></i> {{ $t('products.form.change') }}
          </span>
          <span
            v-if="previewUrl || imageUrl"
            @click.stop="$emit('remove')"
            class="px-3 py-1.5 rounded-lg bg-rose-500/50 text-white text-[10px] font-bold backdrop-blur-sm cursor-pointer"
          >
            <i class="pi pi-trash mr-1"></i> {{ $t('products.delete') }}
          </span>
        </div>
      </div>
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="$emit('select', $event)" />

      <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
        <i class="pi pi-info-circle text-emerald-500 text-xs mt-0.5 shrink-0"></i>
        <p class="text-[10px] text-slate-400 leading-normal">{{ $t('products.form.image_tip') }}</p>
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
