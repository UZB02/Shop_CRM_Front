<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[2000] grid place-items-center p-4 overflow-y-auto">
      <!-- Backdrop with blur -->
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" @click="$emit('update:visible', false)"></div>
      
      <!-- Compact Creative Container -->
      <div class="relative w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 border border-slate-100 dark:border-slate-800 p-8 animate-zoom-in overflow-hidden z-10 my-auto">
      <!-- Minimal Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <h3 class="text-lg font-black text-slate-800 dark:text-white tracking-[0.1em]">
            {{ category._id || category.id ? $t('common.edit') : $t('categories.title') }}
          </h3>
        </div>
        <button 
          @click="$emit('update:visible', false)" 
          class="text-slate-300 hover:text-rose-500 transition-colors"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-8">
        <!-- Name Field -->
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">{{ $t('categories.name') }}</label>
          <div class="relative group">
            <input 
              v-model.trim="category.name"
              type="text"
              :placeholder="$t('categories.name_ph')"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent px-5 py-4 rounded-2xl text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/30 focus:shadow-lg focus:shadow-emerald-500/5"
              :class="{ '!border-rose-500/30 !bg-rose-50/30 !text-rose-600': submitted && !category.name }"
              autofocus
            />
            <small v-if="submitted && !category.name" class="text-[9px] font-black text-rose-500 tracking-widest mt-2 ml-1 block">{{ $t('categories.messages.name_required') }}</small>
          </div>
        </div>

        <!-- Description Field -->
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">{{ $t('categories.description') }}</label>
          <div class="relative group">
            <textarea 
              v-model="category.description"
              :placeholder="$t('categories.description_ph')"
              rows="3"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent px-5 py-4 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/30 focus:shadow-lg focus:shadow-emerald-500/5 resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-12 flex items-center justify-end gap-6">
        <button 
          @click="$emit('update:visible', false)"
          class="text-[11px] font-black tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {{ $t('common.cancel') }}
        </button>
        <button 
          @click="onSave"
          :disabled="saving"
          class="h-14 px-10 bg-slate-900 dark:bg-emerald-500 text-white text-xs font-black tracking-[0.15em] rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 transition-all disabled:opacity-50"
        >
          <span v-if="saving">...</span>
          <span v-else>{{ category._id || category.id ? $t('common.save') : $t('common.add') }}</span>
        </button>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  category: Object,
  categories: Array,
  saving: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'edit', 'delete'])

const submitted = ref(false)

const onSave = () => {
  submitted.value = true
  if (props.category.name?.trim()) {
    emit('save', props.category)
  }
}

watch(() => props.visible, (newVal) => {
  if (!newVal) submitted.value = false
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-zoom-in {
  animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
