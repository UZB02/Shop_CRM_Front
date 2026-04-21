<template>
  <div v-show="active === 'modules'" class="settings-section">
    <SectionHeader icon="pi-th-large" color="text-blue-500">{{ $t('settings.modules.title') }}</SectionHeader>
    <SettingRow v-model="form.subcategory_enabled"    :label="$t('settings.modules.subcategory_label')"    :desc="$t('settings.modules.subcategory_desc')" :disabled="readonly" />
    <SettingRow v-model="form.sale_return_enabled"    :label="$t('settings.modules.sale_return_label')"    :desc="$t('settings.modules.sale_return_desc')" :disabled="readonly" />
    <SettingRow v-model="form.wastage_enabled"        :label="$t('settings.modules.wastage_label')"        :desc="$t('settings.modules.wastage_desc')" :disabled="readonly" />
    <SettingRow v-model="form.stock_audit_enabled"    :label="$t('settings.modules.stock_audit_label')"    :desc="$t('settings.modules.stock_audit_desc')" :disabled="readonly" />
    <SettingRow v-model="form.kpi_enabled"            :label="$t('settings.modules.kpi_label')"            :desc="$t('settings.modules.kpi_desc')" :disabled="readonly" />
    <SettingRow v-model="form.price_list_enabled"     :label="$t('settings.modules.price_list_label')"     :desc="$t('settings.modules.price_list_desc')" :disabled="readonly" />
    <SettingRow v-model="form.supplier_credit_enabled" :label="$t('settings.modules.supplier_credit_label')" :desc="$t('settings.modules.supplier_credit_desc')" :disabled="readonly" />

    <SectionHeader icon="pi-clock" color="text-indigo-500">{{ $t('settings.modules.shift_title') }}</SectionHeader>
    <SettingRow v-model="form.shift_enabled" :label="$t('settings.modules.shift_label')" :desc="$t('settings.modules.shift_desc')" :disabled="readonly" />
    
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': !form.shift_enabled || readonly}">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.modules.shifts_per_day_label') }}</p>
        <p class="row-desc">{{ $t('settings.modules.shifts_per_day_desc') }}</p>
      </div>
      <select v-model="form.shifts_per_day" class="settings-input w-24" :disabled="readonly">
        <option :value="1">1 Smena</option>
        <option :value="2">2 Smena</option>
        <option :value="3">3 Smena</option>
      </select>
    </div>

    <SettingRow v-model="form.require_cash_count" :label="$t('settings.modules.cash_count_label')" :desc="$t('settings.modules.cash_count_desc')" :disabled="!form.shift_enabled || readonly" />
    <SettingRow v-model="form.auto_pdf_on_smena_close" :label="$t('settings.modules.auto_pdf_label')" :desc="$t('settings.modules.auto_pdf_desc')" :disabled="!form.shift_enabled || readonly" />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

const props = defineProps({ form: Object, active: String, readonly: Boolean })

// If shift management is disabled, reset related fields
watch(() => props.form.shift_enabled, (val) => {
  if (!val) {
    props.form.require_cash_count = false
    props.form.shifts_per_day = 1
  }
})
</script>
