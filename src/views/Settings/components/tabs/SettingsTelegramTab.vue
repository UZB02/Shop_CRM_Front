<template>
  <div v-show="active === 'telegram'" class="settings-section">
    <SectionHeader icon="pi-send" color="text-blue-500">{{ $t('settings.telegram.title') }}</SectionHeader>
    <SettingRow v-model="form.telegram_enabled" :label="$t('settings.telegram.label')" :desc="$t('settings.telegram.desc')" :disabled="readonly" />
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': !form.telegram_enabled || readonly}">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.telegram.chat_id_label') }}</p>
        <p class="row-desc">{{ $t('settings.telegram.chat_id_desc') }}</p>
      </div>
      <input v-model.trim="form.telegram_chat_id" type="text" :placeholder="$t('settings.telegram.chat_id_placeholder')" class="settings-input w-64" :disabled="readonly" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
const { t } = useI18n()
defineProps({ form: Object, active: String, readonly: Boolean })
</script>
