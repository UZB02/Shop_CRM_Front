<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="visible" @click="$emit('update:visible', false)" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
    </Transition>

    <!-- Panel -->
    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
      enter-from-class="translate-x-full" 
      enter-to-class="translate-x-0" 
      leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)" 
      leave-from-class="translate-x-0" 
      leave-to-class="translate-x-full"
    >
      <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col font-inter">
        <!-- Panel Header -->
        <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-emerald-500 uppercase tracking-widest">{{ isEditing ? $t('common.edit') : $t('categories.management') }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{{ $t('products.page_title') }}</span>
          </div>
          <button @click="$emit('update:visible', false)" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white transition-all shadow-sm">
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div class="space-y-4">
            <!-- Name Field -->
            <div class="field">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('categories.name') }}</label>
              <div class="relative group/input">
                <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 transition-colors group-focus-within/input:text-emerald-500"></i>
                <InputText 
                  v-model="category.name" 
                  :placeholder="$t('categories.name_ph')" 
                  class="!h-11 !pl-10 !text-sm !font-semibold !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" 
                  autofocus
                />
              </div>
            </div>

            <!-- Description Field -->
            <div class="field">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('categories.description') }}</label>
              <div class="relative group/input">
                <i class="pi pi-align-left absolute left-3 top-4 text-xs text-slate-300 transition-colors group-focus-within/input:text-emerald-500"></i>
                <Textarea 
                  v-model="category.description" 
                  :placeholder="$t('categories.description_ph')" 
                  rows="4"
                  class="!pl-10 !pt-3 !text-sm !font-semibold !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full leading-relaxed" 
                />
              </div>
            </div>

            <!-- Status Toggle -->
            <div class="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/60 mt-4">
              <div class="flex items-center gap-3">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300', category.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400']">
                  <i :class="['pi', category.status === 'active' ? 'pi-check' : 'pi-power-off', 'text-[10px]']"></i>
                </div>
                <div>
                  <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">{{ $t('common.status') }}</p>
                  <p :class="['text-[11px] font-bold uppercase tracking-widest transition-colors', category.status === 'active' ? 'text-emerald-500' : 'text-slate-400']">
                    {{ category.status === 'active' ? $t('common.active') : $t('common.inactive') }}
                  </p>
                </div>
              </div>
              <ToggleSwitch 
                :modelValue="category.status === 'active'" 
                @update:modelValue="category.status = $event ? 'active' : 'inactive'"
              />
            </div>
          </div>
        </div>

        <!-- Panel Footer -->
        <div class="px-6 py-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div class="flex gap-3 items-center">
            <Button 
              :label="$t('common.cancel')"
              text
              class="!flex-1 !text-[10px] !font-bold !uppercase !tracking-widest !rounded-xl !text-slate-400 !h-10"
              @click="$emit('update:visible', false)"
            />
            <Button 
              :label="isEditing ? $t('common.save') : $t('common.add')"
              :loading="saving" 
              @click="$emit('submit')"
              class="!flex-[2] !h-10 !rounded-xl !bg-emerald-500 !border-none !shadow-xl !shadow-emerald-500/20 active:scale-95 transition-all text-white !text-[10px] !font-bold !uppercase !tracking-widest"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'

const { t } = useI18n()

defineProps({
  visible: Boolean,
  isEditing: Boolean,
  category: Object,
  saving: Boolean
})

defineEmits(['update:visible', 'submit'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-slate-200);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-slate-800);
}
</style>
