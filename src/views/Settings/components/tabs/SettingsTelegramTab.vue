<template>
  <div v-show="active === 'telegram'" class="settings-section">
    <SectionHeader icon="pi-send" color="text-blue-500">{{ $t('settings.telegram.title') }}</SectionHeader>
    <SettingRow v-model="form.telegram_enabled" :label="$t('settings.telegram.label')" :desc="$t('settings.telegram.desc')" />
    <div v-if="form.telegram_enabled" class="settings-row">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.telegram.chat_id_label') }}</p>
        <p class="row-desc">{{ $t('settings.telegram.chat_id_desc') }}</p>
      </div>
      <input v-model="form.telegram_chat_id" type="text" :placeholder="$t('settings.telegram.chat_id_placeholder')" class="settings-input" style="width:100%;max-width:220px;" />
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
