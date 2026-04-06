<template>
  <div v-show="active === 'modules'" class="settings-section">
    <SectionHeader icon="pi-th-large" color="text-blue-500">{{ $t('settings.modules.title') }}</SectionHeader>
    <SettingRow v-model="form.subcategory_enabled"    :label="$t('settings.modules.subcategory_label')"    :desc="$t('settings.modules.subcategory_desc')" />
    <SettingRow v-model="form.sale_return_enabled"    :label="$t('settings.modules.sale_return_label')"    :desc="$t('settings.modules.sale_return_desc')" />
    <SettingRow v-model="form.wastage_enabled"        :label="$t('settings.modules.wastage_label')"        :desc="$t('settings.modules.wastage_desc')" />
    <SettingRow v-model="form.stock_audit_enabled"    :label="$t('settings.modules.stock_audit_label')"    :desc="$t('settings.modules.stock_audit_desc')" />
    <SettingRow v-model="form.kpi_enabled"            :label="$t('settings.modules.kpi_label')"            :desc="$t('settings.modules.kpi_desc')" />
    <SettingRow v-model="form.price_list_enabled"     :label="$t('settings.modules.price_list_label')"     :desc="$t('settings.modules.price_list_desc')" />
    <SettingRow v-model="form.supplier_credit_enabled" :label="$t('settings.modules.supplier_credit_label')" :desc="$t('settings.modules.supplier_credit_desc')" />

    <SectionHeader icon="pi-clock" color="text-indigo-500">{{ $t('settings.modules.shift_title') }}</SectionHeader>
    <SettingRow v-model="form.shift_enabled" :label="$t('settings.modules.shift_label')" :desc="$t('settings.modules.shift_desc')" />
    <div v-if="form.shift_enabled" class="settings-row">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.modules.shifts_per_day_label') }}</p>
        <p class="row-desc">{{ $t('settings.modules.shifts_per_day_desc') }}</p>
      </div>
      <input v-model.number="form.shifts_per_day" type="number" min="1" max="4" class="settings-input w-16 text-center" />
    </div>
    <SettingRow v-model="form.require_cash_count" :label="$t('settings.modules.cash_count_label')" :desc="$t('settings.modules.cash_count_desc')" :disabled="!form.shift_enabled" />
    <SettingRow v-model="form.auto_pdf_on_smena_close" :label="$t('settings.modules.auto_pdf_label')" :desc="$t('settings.modules.auto_pdf_desc')" :disabled="!form.shift_enabled" />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

const props = defineProps({ form: Object, active: String })

// If shift management is disabled, reset related fields
watch(() => props.form.shift_enabled, (val) => {
  if (!val) {
    props.form.require_cash_count = false
    props.form.shifts_per_day = 1
  }
})
</script>
