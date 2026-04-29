<template>
  <div class="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col min-h-0 font-inter h-full">
    <!-- Login form (visible when enabled) -->
    <Transition name="fade-slide">
      <div v-if="createLogin" class="flex-1 flex flex-col min-h-0">
        <div class="space-y-6">
          <FormField :label="$t('workers.form.username')">
            <InputText v-model="worker.username"
                       class="sr-input"
                       placeholder="username" />
          </FormField>

          <FormField v-if="!worker.id" :label="$t('workers.form.password')">
            <Password v-model="worker.password"
                      toggleMask
                      :feedback="false"
                      inputClass="sr-input !pl-10"
                      class="w-full"
                      placeholder="••••••••" />
          </FormField>
        </div>

        <!-- Permissions List -->
        <div class="mt-8 flex-1 flex flex-col min-h-0">
          <PermissionsList
            :selectedPermissions="worker.permissions || []"
            :allSelected="allSelected"
            :selectedCount="selectedCount"
            @toggle="togglePermission"
            @toggle-all="toggleAll"
          />
        </div>
      </div>
    </Transition>

    <!-- Lock State (login disabled) -->
    <Transition name="fade">
      <div v-if="!createLogin"
           class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner border border-slate-200 dark:border-slate-700">
          <i class="pi pi-lock text-3xl text-slate-400"></i>
        </div>
        <div>
          <p class="text-[10px] font-black tracking-widest text-slate-500">{{ $t('workers.form.access_denied') }}</p>
          <p class="text-[11px] font-medium text-slate-400 mt-2 max-w-[200px] leading-relaxed">
            {{ $t('workers.form.access_enable_desc') }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import InputText  from 'primevue/inputtext'
import Password   from 'primevue/password'
import FormField      from './FormField.vue'
import PermissionsList from './PermissionsList.vue'
import { useWorkerPermissions } from '../../composables/useWorkerPermissions.js'

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
