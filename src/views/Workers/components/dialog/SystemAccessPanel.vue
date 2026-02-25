<template>
  <div class="flex-1 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-6 flex flex-col">
    <!-- Toggle Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
          <i class="pi pi-key text-sm"></i>
        </div>
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Tizimga kirish</h3>
      </div>
      <InputSwitch
        :modelValue="createLogin"
        @update:modelValue="$emit('update:createLogin', $event)"
        class="scale-90"
      />
    </div>

    <!-- Login form (visible when enabled) -->
    <Transition name="fade-slide">
      <div v-if="createLogin" class="flex-1 flex flex-col">
        <div class="space-y-5">
          <FormField label="Foydalanuvchi nomi">
            <div class="p-input-icon-left w-full">
              <InputText v-model="worker.username"
                         class="w-full !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-slate-800 !h-10 !rounded-xl"
                         placeholder="username" />
            </div>
          </FormField>

          <FormField v-if="!worker.id" label="Tizim paroli">
            <div class="p-input-icon-left w-full">
              <Password v-model="worker.password"
                        toggleMask
                        :feedback="false"
                        inputClass="w-full !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-slate-800 !h-10 !rounded-xl !pl-10"
                        class="w-full"
                        placeholder="••••••••" />
            </div>
          </FormField>
        </div>

        <!-- Permissions List -->
        <PermissionsList
          :selectedPermissions="worker.permissions || []"
          :allSelected="allSelected"
          :selectedCount="selectedCount"
          @toggle="togglePermission"
          @toggle-all="toggleAll"
        />
      </div>
    </Transition>

    <!-- Lock State (login disabled) -->
    <Transition name="fade">
      <div v-if="!createLogin"
           class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
        <div class="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-inner">
          <i class="pi pi-lock text-3xl text-slate-400"></i>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Kirish cheklangan</p>
          <p class="text-xs text-slate-400 mt-1 max-w-[160px]">
            Tizimga kirish imkoniyatini yoqish uchun tepani bosing.
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch'
import InputText  from 'primevue/inputtext'
import Password   from 'primevue/password'
import FormField      from './FormField.vue'
import PermissionsList from './PermissionsList.vue'
import { useWorkerPermissions } from '../../composables/useWorkerPermissions.js'
import { computed } from 'vue'

const props = defineProps({
  worker:      { type: Object,  required: true },
  createLogin: { type: Boolean, default: false },
})

defineEmits(['update:createLogin'])

const { allSelected, selectedCount, togglePermission, toggleAll } = useWorkerPermissions(props.worker)
</script>

<style scoped>
.fade-slide-enter-active { animation: fadeslide 0.35s cubic-bezier(0.16,1,0.3,1); }
.fade-slide-leave-active { animation: fadeslide 0.2s reverse ease-in; }
@keyframes fadeslide {
  from { opacity:0; transform:translateY(12px) scale(0.98); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
