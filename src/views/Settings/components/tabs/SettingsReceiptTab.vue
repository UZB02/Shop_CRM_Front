<template>
  <div v-show="active === 'receipt'" class="settings-section">
    <SectionHeader icon="pi-receipt" color="text-slate-500">{{ $t('settings.receipt.title') }}</SectionHeader>
    <SettingRow v-model="form.show_store_logo"  :label="$t('settings.receipt.logo_label')"        :desc="$t('settings.receipt.logo_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_store_logo')" />
    <SettingRow v-model="form.show_worker_name" :label="$t('settings.receipt.worker_name_label')" :desc="$t('settings.receipt.worker_name_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_worker_name')" />

    <SectionHeader icon="pi-map-marker" color="text-slate-500">{{ $t('settings.receipt.info_title') }}</SectionHeader>
    <div class="settings-row" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.address_label') }}</p>
          <span v-if="isFieldDirty('receipt_address')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.address_desc') }}</p>
      </div>
      <input v-model="form.receipt_address" type="text" class="settings-input w-full max-w-[280px]" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_address')}" :placeholder="$t('settings.receipt.address_placeholder')" :disabled="readonly" />
    </div>
    <div class="settings-row" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.phone_label') }}</p>
          <span v-if="isFieldDirty('receipt_phone')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.phone_desc') }}</p>
      </div>
      <input v-model="form.receipt_phone" type="text" class="settings-input w-full max-w-[280px]" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_phone')}" :placeholder="$t('settings.receipt.phone_placeholder')" :disabled="readonly" />
    </div>
    <div class="settings-row" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.promo_label') }}</p>
          <span v-if="isFieldDirty('receipt_promo_text')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.promo_desc') }}</p>
      </div>
      <input v-model="form.receipt_promo_text" type="text" class="settings-input w-full max-w-[280px]" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_promo_text')}" :placeholder="$t('settings.receipt.promo_placeholder')" :disabled="readonly" />
    </div>

    <SectionHeader icon="pi-align-left" color="text-slate-500">{{ $t('settings.receipt.text_title') }}</SectionHeader>
    <div class="settings-row" style="align-items: flex-start; flex-wrap: wrap;" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1" style="min-width: 140px;">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.header_label') }}</p>
          <span v-if="isFieldDirty('receipt_header')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.header_desc') }}</p>
      </div>
      <textarea v-model="form.receipt_header" rows="3" :placeholder="$t('settings.receipt.header_placeholder')" class="settings-input resize-none text-xs" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_header')}" style="width: 100%; max-width: 280px;" :disabled="readonly"></textarea>
    </div>
    <div class="settings-row" style="align-items: flex-start; flex-wrap: wrap;" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1" style="min-width: 140px;">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.footer_label') }}</p>
          <span v-if="isFieldDirty('receipt_footer')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.footer_desc') }}</p>
      </div>
      <textarea v-model="form.receipt_footer" rows="3" :placeholder="$t('settings.receipt.footer_placeholder')" class="settings-input resize-none text-xs" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_footer')}" style="width: 100%; max-width: 280px;" :disabled="readonly"></textarea>
    </div>

    <SectionHeader icon="pi-barcode" color="text-slate-500">{{ $t('settings.receipt.barcode_settings_title') }}</SectionHeader>
    <SettingRow v-model="form.show_name_on_barcode"  :label="$t('settings.receipt.show_name_on_barcode_label')"  :desc="$t('settings.receipt.show_name_on_barcode_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_name_on_barcode')" />
    <SettingRow v-model="form.show_price_on_barcode" :label="$t('settings.receipt.show_price_on_barcode_label')" :desc="$t('settings.receipt.show_price_on_barcode_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_price_on_barcode')" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useI18n()
defineProps({ form: Object, active: String, readonly: Boolean, isFieldDirty: Function })
</script>


