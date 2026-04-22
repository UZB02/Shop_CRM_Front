<template>
  <div v-show="active === 'stock'" class="settings-section">
    <SectionHeader icon="pi-bell" color="text-amber-500">{{ $t('settings.stock.title') }}</SectionHeader>
    <SettingRow v-model="form.low_stock_enabled" :label="$t('settings.stock.low_stock_label')" :desc="$t('settings.stock.low_stock_desc')" :disabled="readonly" :is-dirty="isFieldDirty('low_stock_enabled')" />
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': !form.low_stock_enabled || readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.stock.threshold_label') }}</p>
          <span v-if="isFieldDirty('low_stock_threshold')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.stock.threshold_desc') }}</p>
      </div>
      <input v-model.number="form.low_stock_threshold" type="number" min="1" class="settings-input w-24" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('low_stock_threshold')}" :disabled="readonly" />
    </div>
  </div>
</template>

<script setup>
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

defineProps({ form: Object, active: String, readonly: Boolean, isFieldDirty: Function })
</script>
