<template>
  <div v-show="active === 'stock'" class="settings-section">
    <SectionHeader icon="pi-bell" color="text-amber-500">{{ $t('settings.stock.title') }}</SectionHeader>
    <SettingRow v-model="form.low_stock_enabled" :label="$t('settings.stock.low_stock_label')" :desc="$t('settings.stock.low_stock_desc')" />
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': !form.low_stock_enabled}">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.stock.threshold_label') }}</p>
        <p class="row-desc">{{ $t('settings.stock.threshold_desc') }}</p>
      </div>
      <input v-model.number="form.low_stock_threshold" type="number" min="1" class="settings-input w-24" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
const { t } = useI18n()
defineProps({ form: Object, active: String })
</script>
