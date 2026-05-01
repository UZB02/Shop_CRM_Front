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
      <div v-if="visible" class="fixed inset-0 w-screen h-screen z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-hidden" @click.self="$emit('update:visible', false)">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div class="w-full max-w-md overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl font-inter">
            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <i class="pi pi-box text-lg"></i>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {{ warehouse.id || warehouse._id ? $t('warehouse.edit_warehouse') : $t('warehouse.new_warehouse') }}
                  </h3>
                  <p class="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                    {{ $t('warehouse.form.subtitle') }}
                  </p>
                </div>
              </div>
              <button
                @click="$emit('update:visible', false)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-5">
              <!-- Warehouse Name -->
              <div class="space-y-1.5 focus-within:z-10 relative">
                <label for="name" class="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest px-1">
                  {{ $t('warehouse.form.name') }} <span class="text-rose-500">*</span>
                </label>
                <div class="relative group">
                  <i class="pi pi-bookmark absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors text-xs"></i>
                  <InputText
                    id="name"
                    v-model="warehouse.name"
                    :placeholder="$t('warehouse.form.name_ph')"
                    class="w-full !pl-10 !rounded-xl !bg-slate-50/50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 hover:!border-slate-300 dark:hover:!border-slate-600 focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500 transition-all !py-3 font-semibold dark:!text-white text-sm"
                    :class="{ 'p-invalid': submitted && !warehouse.name }"
                    autofocus
                  />
                </div>
                <small v-if="submitted && !warehouse.name" class="text-rose-500 text-[12px] font-bold tracking-wider px-1 block">{{ $t('warehouse.form.name') }} kiritilishi shart.</small>
              </div>

              <!-- Address -->
              <div class="space-y-1.5 focus-within:z-10 relative">
                <label for="address" class="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest px-1">
                  {{ $t('warehouse.form.address') }}
                </label>
                <div class="relative group">
                  <i class="pi pi-map-marker absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors text-xs"></i>
                  <InputText
                    id="address"
                    v-model="warehouse.address"
                    :placeholder="$t('warehouse.form.address_ph')"
                    class="w-full !pl-10 !rounded-xl !bg-slate-50/50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 hover:!border-slate-300 dark:hover:!border-slate-600 focus:!ring-4 focus:!ring-emerald-500/10 focus:!border-emerald-500 transition-all !py-3 font-semibold dark:!text-white text-sm"
                  />
                </div>
              </div>

              <!-- Status Selection -->
              <div class="space-y-2">
                <label class="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest px-1 block">
                  {{ $t('warehouse.form.status') }}
                </label>
                <div class="grid grid-cols-2 gap-3 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <button
                    type="button"
                    @click="warehouse.status = 'active'"
                    class="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-[12px] font-bold tracking-widest"
                    :class="warehouse.status === 'active' 
                      ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm border border-slate-100 dark:border-slate-600' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
                  >
                    <div class="w-1.5 h-1.5 rounded-full" :class="warehouse.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'"></div>
                    {{ $t('warehouse.form.active') }}
                  </button>
                  <button
                    type="button"
                    @click="warehouse.status = 'inactive'"
                    class="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-[12px] font-bold tracking-widest"
                    :class="warehouse.status === 'inactive' 
                      ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm border border-slate-100 dark:border-slate-600' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
                  >
                    <div class="w-1.5 h-1.5 rounded-full" :class="warehouse.status === 'inactive' ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'"></div>
                    {{ $t('warehouse.form.inactive') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/50 flex gap-3">
              <button
                @click="$emit('update:visible', false)"
                class="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[12px] font-bold tracking-widest hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="$emit('save')"
                :disabled="saving"
                class="flex-[2] h-11 px-4 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white text-[12px] font-bold tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
                <i v-else class="pi pi-check text-xs"></i>
                {{ $t('common.save') }}
              </button>
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
</style>


