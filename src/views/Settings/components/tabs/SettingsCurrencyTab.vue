<template>
  <div v-show="active === 'currency'" class="settings-section">
    <SectionHeader icon="pi-dollar" color="text-amber-500">{{ $t('settings.currency.title') }}</SectionHeader>
    <div class="settings-row">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.currency.default_label') }}</p>
        <p class="row-desc">{{ $t('settings.currency.default_desc') }}</p>
      </div>
      <select v-model="form.default_currency" class="settings-input">
        <option value="UZS">🇺🇿 UZS</option>
        <option value="USD">🇺🇸 USD</option>
        <option value="RUB">🇷🇺 RUB</option>
      </select>
    </div>
    <SettingRow v-model="form.show_usd_price" :label="$t('settings.currency.show_usd_label')" :desc="$t('settings.currency.show_usd_desc')" />
    <SettingRow v-model="form.show_rub_price" :label="$t('settings.currency.show_rub_label')" :desc="$t('settings.currency.show_rub_desc')" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
const { t } = useI18n()
defineProps({ form: Object, active: String })
</script>
