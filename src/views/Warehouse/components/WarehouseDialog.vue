<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" class="fixed inset-0 w-screen h-screen z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden" @click.self="$emit('update:visible', false)">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div class="w-full max-w-lg sm:max-w-xl md:max-w-lg overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-500/10">
            <!-- Custom Header -->
            <div class="px-6 py-5 sm:px-10 sm:py-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
              <div class="flex items-center gap-4 text-left">
                <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <i class="pi pi-box text-white text-lg sm:text-2xl"></i>
                </div>
                <div class="text-left">
                  <h3 class="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {{ warehouse.id || warehouse._id ? $t('warehouse.edit_warehouse') : $t('warehouse.new_warehouse') }}
                  </h3>
                  <p class="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {{ $t('warehouse.form.subtitle') }}
                  </p>
                </div>
              </div>
              <button
                @click="$emit('update:visible', false)"
                class="w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
              >
                <i class="pi pi-times text-xs sm:text-sm"></i>
              </button>
            </div>

            <!-- Form Content -->
            <div class="p-6 sm:p-10 space-y-6 sm:space-y-8 text-left">
              <!-- Main Info Section -->
              <div class="space-y-5 sm:space-y-6 text-left">
                <!-- Warehouse Name -->
                <div class="space-y-2 px-1 text-left">
                  <label for="name" class="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1 text-left">
                    {{ $t('warehouse.form.name') }} <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative group text-left">
                    <i class="pi pi-bookmark absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors text-sm sm:text-base"></i>
                    <InputText
                      id="name"
                      v-model="warehouse.name"
                      :placeholder="$t('warehouse.form.name_ph')"
                      class="w-full !pl-11 !rounded-xl sm:!rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500 transition-all !py-3 sm:!py-4 font-semibold dark:!text-white text-sm sm:text-base"
                      :class="{ 'p-invalid': submitted && !warehouse.name }"
                      autofocus
                    />
                  </div>
                  <small v-if="submitted && !warehouse.name" class="text-rose-500 text-[10px] font-bold uppercase tracking-wider px-2 block animate-bounce">{{ $t('warehouse.form.name') }} kiritilishi shart.</small>
                </div>

                <!-- Address -->
                <div class="space-y-2 px-1 text-left">
                  <label for="address" class="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1 text-left">
                    {{ $t('warehouse.form.address') }}
                  </label>
                  <div class="relative group text-left">
                    <i class="pi pi-map-marker absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors text-sm sm:text-base"></i>
                    <InputText
                      id="address"
                      v-model="warehouse.address"
                      :placeholder="$t('warehouse.form.address_ph')"
                      class="w-full !pl-11 !rounded-xl sm:!rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500 transition-all !py-3 sm:!py-4 font-semibold dark:!text-white text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex flex-col sm:flex-row gap-4 pt-4 text-left">
                <button
                  @click="$emit('update:visible', false)"
                  class="flex-1 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  @click="$emit('save')"
                  :disabled="saving"
                  class="flex-[2] px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <i v-if="saving" class="pi pi-spin pi-spinner text-sm"></i>
                  <i v-else class="pi pi-check text-sm"></i>
                  {{ $t('common.save') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import InputText from 'primevue/inputtext'

defineProps({
  visible: Boolean,
  warehouse: Object,
  submitted: Boolean,
  saving: Boolean
})

defineEmits(['update:visible', 'save', 'hide'])
</script>

<style scoped>
/* Dark mode overrides for internal PrimeVue components */
.dark :deep(.p-inputtext) {
  background-color: rgba(30, 41, 59, 0.4) !important;
  border-color: rgba(51, 65, 85, 1) !important;
  color: white !important;
}

.dark :deep(.p-inputtext::placeholder) {
  color: rgba(100, 116, 139, 1) !important;
}
</style>
