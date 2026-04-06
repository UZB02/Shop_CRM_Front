<template>
  <div v-show="active === 'receipt'" class="settings-section">
    <SectionHeader icon="pi-receipt" color="text-slate-500">{{ $t('settings.receipt.title') }}</SectionHeader>
    <SettingRow v-model="form.show_store_logo"  :label="$t('settings.receipt.logo_label')"        :desc="$t('settings.receipt.logo_desc')" />
    <SettingRow v-model="form.show_worker_name" :label="$t('settings.receipt.worker_name_label')" :desc="$t('settings.receipt.worker_name_desc')" />

    <SectionHeader icon="pi-align-left" color="text-slate-500">{{ $t('settings.receipt.text_title') }}</SectionHeader>
    <div class="settings-row" style="align-items: flex-start; flex-wrap: wrap;">
      <div class="flex-1" style="min-width: 140px;">
        <p class="row-label">{{ $t('settings.receipt.header_label') }}</p>
        <p class="row-desc">{{ $t('settings.receipt.header_desc') }}</p>
      </div>
      <textarea v-model="form.receipt_header" rows="3" :placeholder="$t('settings.receipt.header_placeholder')" class="settings-input resize-none text-xs" style="width: 100%; max-width: 280px;"></textarea>
    </div>
    <div class="settings-row" style="align-items: flex-start; flex-wrap: wrap;">
      <div class="flex-1" style="min-width: 140px;">
        <p class="row-label">{{ $t('settings.receipt.footer_label') }}</p>
        <p class="row-desc">{{ $t('settings.receipt.footer_desc') }}</p>
      </div>
      <textarea v-model="form.receipt_footer" rows="3" :placeholder="$t('settings.receipt.footer_placeholder')" class="settings-input resize-none text-xs" style="width: 100%; max-width: 280px;"></textarea>
    </div>

    <SectionHeader icon="pi-barcode" color="text-slate-500">{{ $t('settings.receipt.barcode_settings_title') }}</SectionHeader>
    <SettingRow v-model="form.show_name_on_barcode"  :label="$t('settings.receipt.show_name_on_barcode_label')"  :desc="$t('settings.receipt.show_name_on_barcode_desc')" />
    <SettingRow v-model="form.show_price_on_barcode" :label="$t('settings.receipt.show_price_on_barcode_label')" :desc="$t('settings.receipt.show_price_on_barcode_desc')" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
const { t } = useI18n()
defineProps({ form: Object, active: String })
</script>
