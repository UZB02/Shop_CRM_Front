<template>
  <Dialog
    v-model:visible="visible"
    :header="$t('kpi.set_target.title')"
    modal
    class="p-fluid modern-dialog"
    style="width: 25rem"
    :draggable="false"
  >
    <div class="space-y-4 pt-2">
      <!-- Worker Name & Period Info -->
      <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <i class="pi pi-user text-lg"></i>
          </div>
          <div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ kpi?.worker_name }}</div>
            <div class="text-xs text-slate-500">{{ kpi?.month }}/{{ kpi?.year }}</div>
          </div>
        </div>
      </div>

      <!-- Target Amount -->
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">{{ $t('kpi.set_target.target_amount') }}</label>
        <div class="relative">
          <InputNumber
            v-model="form.target_amount"
            mode="currency"
            currency="UZS"
            locale="uz-UZ"
            placeholder="0"
            class="premium-input"
            autofocus
          />
        </div>
      </div>

      <!-- Bonus Amount -->
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">{{ $t('kpi.set_target.bonus_amount') }}</label>
        <div class="relative">
          <InputNumber
            v-model="form.bonus_amount"
            mode="currency"
            currency="UZS"
            locale="uz-UZ"
            placeholder="0"
            class="premium-input"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 pt-2">
        <Button
          :label="$t('common.cancel')"
          icon="pi pi-times"
          class="p-button-text p-button-sm flex-1 !text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-800"
          @click="visible = false"
        />
        <Button
          :label="$t('common.save')"
          icon="pi pi-check"
          class="p-button-sm flex-1 bg-emerald-500 border-emerald-500 hover:bg-emerald-600 shadow-md active:scale-95 transition-all"
          :loading="loading"
          @click="onSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import { kpiAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: Boolean,
  kpi: Object
})

const emit = defineEmits(['update:modelValue', 'saved'])

const { t } = useI18n()
const toast = useToast()
const visible = ref(false)
const loading = ref(false)

const form = ref({
  target_amount: 0,
  bonus_amount: 0
})

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.kpi, (newKpi) => {
  if (newKpi) {
    form.value.target_amount = parseFloat(newKpi.target_amount || 0)
    form.value.bonus_amount = parseFloat(newKpi.bonus_amount || 0)
  }
}, { immediate: true })

const onSave = async () => {
  if (!props.kpi?.id) return

  loading.value = true
  try {
    await kpiAPI.setTarget(props.kpi.id, {
      target_amount: form.value.target_amount.toString(),
      bonus_amount: form.value.bonus_amount.toString()
    })
    
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('kpi.set_target.success'),
      life: 3000
    })
    
    emit('saved')
    visible.value = false
  } catch (error) {
    console.error('Error setting KPI target:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error.response?.data?.detail || t('common.error_message'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modern-dialog :deep(.p-dialog-header) {
  padding: 1.25rem;
  background: transparent;
  border-bottom: 1px solid rgba(var(--slate-200), 0.5);
}

.modern-dialog :deep(.p-dialog-content) {
  padding: 0 1.25rem 1.25rem 1.25rem;
}

.modern-dialog :deep(.p-dialog-footer) {
  padding: 0 1.25rem 1.25rem 1.25rem;
  border-top: none;
}

.premium-input :deep(.p-inputtext) {
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--slate-200), 0.8);
  padding: 0.6rem 0.75rem;
  transition: all 0.2s ease;
  background: white;
}

.dark .premium-input :deep(.p-inputtext) {
  background: rgba(var(--slate-800), 0.5);
  border-color: rgba(var(--slate-700), 0.8);
  color: white;
}

.premium-input :deep(.p-inputtext:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}
</style>
