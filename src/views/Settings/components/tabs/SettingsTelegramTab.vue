<template>
  <div v-show="active === 'telegram'" class="settings-section">
    <SectionHeader icon="pi-send" color="text-blue-500">{{ $t('settings.telegram.title') }}</SectionHeader>

    <!-- Plan lock banner -->
    <div v-if="planFeatures.has_telegram === false" class="px-4 py-3">
      <PlanLockBadge :hint="$t('plan.error_telegram')" />
    </div>

    <SettingRow
      v-model="form.telegram_enabled"
      :label="$t('settings.telegram.label')"
      :desc="$t('settings.telegram.desc')"
      :disabled="readonly || !planFeatures.has_telegram"
      :is-dirty="isFieldDirty('telegram_enabled')"
    />
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': !form.telegram_enabled || readonly || !planFeatures.has_telegram}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.telegram.chat_id_label') }}</p>
          <span v-if="isFieldDirty('telegram_chat_id')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.telegram.chat_id_desc') }}</p>
      </div>
      <input v-model.trim="form.telegram_chat_id" type="text" :placeholder="$t('settings.telegram.chat_id_placeholder')" class="settings-input w-64" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('telegram_chat_id')}" :disabled="readonly || !planFeatures.has_telegram" />
    </div>
  </div>
</template>

<script setup>
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
import PlanLockBadge from '@/components/PlanLockBadge.vue'

defineProps({
  form: Object,
  active: String,
  readonly: Boolean,
  isFieldDirty: Function,
  planFeatures: { type: Object, default: () => ({}) }
})
</script>


