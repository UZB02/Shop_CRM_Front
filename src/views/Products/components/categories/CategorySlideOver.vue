<template>
  <div>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="visible" @click="$emit('update:visible', false)" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[99]"></div>
    </Transition>

    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
      enter-from-class="translate-x-full" 
      enter-to-class="translate-x-0" 
      leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)" 
      leave-from-class="translate-x-0" 
      leave-to-class="translate-x-full"
    >
      <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.5)] z-[100] flex flex-col">
        <!-- Panel Header -->
        <div class="p-8 border-b border-slate-50 dark:border-slate-900 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-3 h-3 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" :class="isEditing ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'"></div>
            <span class="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              {{ isEditing ? $t('common.edit') : $t('categories.management') }}
            </span>
          </div>
          <button @click="$emit('update:visible', false)" class="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm border border-slate-100 dark:border-slate-800">
            <i class="pi pi-times text-[12px] font-black"></i>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
          <div class="space-y-8">
            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{{ $t('categories.name') }}</label>
              <div class="relative group/input">
                <i class="pi pi-tag absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-300 transition-colors group-focus-within/input:text-emerald-500"></i>
                <InputText v-model="category.name" :placeholder="$t('categories.name_ph')" class="sr-input w-full" autofocus />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{{ $t('categories.description') }}</label>
              <div class="relative group/input">
                <i class="pi pi-align-left absolute left-4 top-5 text-sm text-slate-300 transition-colors group-focus-within/input:text-emerald-500"></i>
                <Textarea v-model="category.description" :placeholder="$t('categories.description_ph')" rows="5" class="sr-input py-4 w-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Footer -->
        <div class="p-8 border-t border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950">
          <div class="flex gap-4 items-center">
            <Button :label="$t('common.cancel')" text class="sr-btn-cancel" @click="$emit('update:visible', false)" />
            <Button :label="isEditing ? $t('common.save') : $t('common.add')" :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'" :loading="saving" @click="$emit('submit')" class="sr-btn-save" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

defineProps({
  visible: Boolean,
  isEditing: Boolean,
  category: Object,
  saving: Boolean
})

defineEmits(['update:visible', 'submit'])
</script>

<style scoped>
@reference "../../../../assets/styles/main.css";

.sr-input {
  @apply !pl-11 !text-[13px] !font-bold !rounded-[1.25rem] !bg-slate-50 dark:!bg-slate-900/60 !border-slate-100 dark:!border-slate-800/80 transition-all duration-300;
  padding-left: 3rem !important;
}
.sr-input:focus {
  @apply !bg-white dark:!bg-slate-950 !ring-8 !ring-emerald-500/5 !border-emerald-500/20;
}
.sr-btn-cancel {
  @apply !flex-1 !text-[11px] !font-black !uppercase !tracking-[0.2em] !rounded-2xl !text-slate-400 !h-12 hover:!bg-slate-50 dark:hover:!bg-slate-900/50 transition-all;
}
.sr-btn-save {
  @apply !flex-[2] !h-12 !rounded-2xl !bg-emerald-500 !border-none !shadow-2xl !shadow-emerald-500/20 active:scale-95 transition-all text-white !text-[11px] !font-black !uppercase !tracking-[0.2em];
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-800 rounded-full;
}
</style>
