<template>
  <div v-show="active === 'payment'" class="settings-section">
    <SectionHeader icon="pi-wallet" color="text-emerald-500">{{ $t('settings.payment.title') }}</SectionHeader>
    <SettingRow v-model="form.allow_cash" :label="$t('settings.payment.cash_label')" :desc="$t('settings.payment.cash_desc')" />
    <SettingRow v-model="form.allow_card" :label="$t('settings.payment.card_label')" :desc="$t('settings.payment.card_desc')" />
    <SettingRow v-model="form.allow_debt" :label="$t('settings.payment.debt_label')" :desc="$t('settings.payment.debt_desc')" />

    <SectionHeader icon="pi-percentage" color="text-purple-500">{{ $t('settings.payment.discount_title') }}</SectionHeader>
    <SettingRow v-model="form.allow_discount" :label="$t('settings.payment.discount_label')" :desc="$t('settings.payment.discount_desc')" />
    <div v-if="form.allow_discount" class="settings-row">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.payment.max_discount_label') }}</p>
        <p class="row-desc">{{ $t('settings.payment.max_discount_desc') }}</p>
        <p v-if="form.max_discount_percent === 0" class="text-[10px] text-emerald-500 font-bold mt-1">
          <i class="pi pi-infinity text-[9px] mr-1"></i>
          {{ $t('settings.payment.unlimited_discount') }}
        </p>
      </div>
      <div class="flex items-center gap-1.5">
        <input v-model.number="form.max_discount_percent" type="number" min="0" max="100" step="1" class="settings-input w-16 text-center" />
        <span class="text-xs font-black text-slate-400">%</span>
      </div>
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
