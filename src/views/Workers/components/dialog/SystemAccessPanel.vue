<template>
  <div class="rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-5 flex flex-col min-h-0">


    <!-- Login form (visible when enabled) -->
    <Transition name="fade-slide">
      <div v-if="createLogin" class="flex-1 flex flex-col min-h-0">
        <div class="space-y-4">
          <FormField :label="$t('workers.form.username')">
            <div class="p-input-icon-left w-full">
              <InputText v-model="worker.username"
                         class="sr-input"
                         placeholder="username" />
            </div>
          </FormField>

          <FormField v-if="!worker.id" :label="$t('workers.form.password')">
            <div class="p-input-icon-left w-full">
              <Password v-model="worker.password"
                        toggleMask
                        :feedback="false"
                        inputClass="sr-input !pl-10"
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
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">{{ $t('workers.form.access_denied') }}</p>
          <p class="text-xs text-slate-400 mt-1 max-w-[160px]">
            {{ $t('workers.form.access_enable_desc') }}
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
