<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        @click="$emit('update:visible', false)"
      ></div>

      <!-- Modal Content -->
      <Transition name="modal-scale" appear>
        <div class="relative w-[95vw] sm:w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
          <!-- Close Button -->
          <button 
            @click="$emit('update:visible', false)"
            class="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-10"
          >
            <i class="pi pi-times text-[10px]"></i>
          </button>

          <!-- Header -->
          <div class="px-4 sm:px-8 pt-4 sm:pt-6 pb-2 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                <i class="pi pi-building text-base sm:text-xl text-emerald-500"></i>
              </div>
              <div class="min-w-0 pr-8">
                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-tight mb-0.5">
                  {{ (store.id || store._id) ? $t('stores.edit_store') : $t('stores.new_store') }}
                </h3>
                <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">{{ $t('stores.form.subtitle_store') }}</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="px-4 sm:px-8 py-2 sm:py-3 overflow-y-auto flex-1 custom-scrollbar">
            <div class="space-y-2 py-1">

              <!-- Store Name -->
              <div class="space-y-1">
                <label for="name" class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">{{ $t('stores.form.store_name') }}</label>
                <div class="flex items-stretch group">
                  <div class="w-10 flex-shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border border-r-0 border-slate-200 dark:border-slate-700 group-focus-within:border-emerald-500 transition-all rounded-l-xl">
                    <i class="pi pi-pencil text-slate-400 group-focus-within:text-emerald-500 text-xs"></i>
                  </div>
                  <InputText
                    id="name"
                    v-model.trim="store.name"
                    autofocus
                    :placeholder="$t('stores.form.store_name_ph')"
                    class="flex-1 min-w-0 rounded-r-xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !px-4 !py-2 !font-semibold !text-sm dark:!text-white focus:!bg-white dark:focus:!bg-slate-900 focus:!border-emerald-500 transition-all shadow-none outline-none"
                  />
                </div>
              </div>

              <!-- Location -->
              <div class="space-y-1">
                <label for="location" class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">{{ $t('stores.form.city') }}</label>
                <div class="flex items-stretch group">
                  <div class="w-10 flex-shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border border-r-0 border-slate-200 dark:border-slate-700 group-focus-within:border-emerald-500 transition-all rounded-l-xl">
                    <i class="pi pi-map-marker text-slate-400 group-focus-within:text-emerald-500 text-xs"></i>
                  </div>
                  <InputText
                    id="location"
                    v-model.trim="store.location"
                    :placeholder="$t('stores.form.city_ph')"
                    class="flex-1 min-w-0 rounded-r-xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !px-4 !py-2 !font-semibold !text-sm dark:!text-white focus:!bg-white dark:focus:!bg-slate-900 focus:!border-emerald-500 transition-all shadow-none outline-none"
                  />
                </div>
              </div>

              <!-- Phone & Status: stacked on mobile, side-by-side on desktop -->
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Phone -->
                <div class="space-y-1 sm:flex-[3] min-w-0">
                  <label for="phone" class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">{{ $t('stores.form.phone') }}</label>
                  <div class="flex items-stretch group">
                    <div class="w-10 flex-shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border border-r-0 border-slate-200 dark:border-slate-700 group-focus-within:border-emerald-500 transition-all rounded-l-xl">
                      <i class="pi pi-phone text-slate-400 text-xs group-focus-within:text-emerald-500"></i>
                    </div>
                    <InputText id="phone" v-model="store.phone" :placeholder="$t('stores.form.phone_ph')" class="flex-1 min-w-0 rounded-r-xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !px-3 !py-2 !font-semibold !text-sm dark:!text-white focus:!bg-white dark:focus:!bg-slate-900 focus:!border-emerald-500 transition-all shadow-none outline-none" />
                  </div>
                </div>
                <!-- Status -->
                <div class="space-y-1 sm:flex-[2] min-w-0">
                  <label for="status" class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">{{ $t('stores.form.status') }}</label>
                  <Dropdown
                    id="status"
                    v-model="store.status"
                    :options="statuses"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="$t('common.choose')"
                    class="w-full rounded-xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 custom-premium-dropdown"
                  />
                </div>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="px-4 sm:px-8 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3">
              <button
                @click="$emit('update:visible', false)"
                class="w-full sm:w-auto px-6 py-2 sm:py-2.5 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="$emit('save')"
                :disabled="saving"
                class="w-full sm:w-auto px-8 sm:px-10 py-2 sm:py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                <i v-if="saving" class="pi pi-spin pi-spinner text-[10px]"></i>
                <i v-else class="pi pi-check text-[10px]"></i>
                <span>{{ saving ? '...' : $t('common.save') }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  store: Object,
  submitted: Boolean,
  saving: Boolean
})

defineEmits(['update:visible', 'save', 'hide'])

const statuses = computed(() => [
  { label: t('stores.status_active'), value: 'active' },
  { label: t('stores.status_inactive'), value: 'inactive' }
])
</script>

<style scoped>
/* Modal Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.modal-scale-enter-from, .modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Custom Scrollbar for Modal Body */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

/* Override PrimeVue components internal spacing in custom modal */
:deep(.custom-premium-dropdown) {
  height: 42px;
}
:deep(.custom-premium-dropdown .p-dropdown-label) {
  display: flex !important;
  align-items: center !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 0 1rem !important;
}
.dark :deep(.custom-premium-dropdown .p-dropdown-label) {
  color: #ffffff !important;
}
:deep(.p-dropdown-panel) {
  border-radius: 1.25rem !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1) !important;
}
.dark :deep(.p-dropdown-panel) {
  background: #0f172a !important;
  border-color: #334155 !important;
}

/* DARK MODE ENFORCEMENTS */
.dark :deep(.p-inputtext),
.dark :deep(.p-dropdown-label),
.dark :deep(.p-dropdown-label.p-placeholder) {
  color: #ffffff !important;
  opacity: 1 !important;
}

.dark :deep(.p-inputtext::placeholder) {
  color: #94a3b8 !important; /* slate-400 */
}

.dark label {
  color: #cbd5e1 !important; /* slate-300 */
}
</style>
