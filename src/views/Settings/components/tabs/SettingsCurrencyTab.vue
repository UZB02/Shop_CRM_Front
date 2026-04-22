<template>
  <div v-show="active === 'currency'" class="settings-section">
    <SectionHeader icon="pi-dollar" color="text-amber-500">{{ $t('settings.currency.title') }}</SectionHeader>
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.currency.default_label') }}</p>
          <span v-if="isFieldDirty('default_currency')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.currency.default_desc') }}</p>
      </div>
      <Select 
        v-model="form.default_currency" 
        :options="currencyOptions" 
        optionLabel="label" 
        optionValue="value"
        class="!w-[140px]"
        :class="{'ring-2 ring-amber-500/20 !border-amber-500/50': isFieldDirty('default_currency')}"
        :disabled="readonly"
        pt:root:class="!rounded-xl !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800/40 !shadow-none"
        pt:label:class="!text-xs !font-bold"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-2">
            <span>{{ currencyOptions.find(o => o.value === slotProps.value)?.flag }}</span>
            <span>{{ slotProps.value }}</span>
          </div>
        </template>
        <template #option="slotProps">
          <div class="flex items-center gap-2 text-xs font-bold">
            <span>{{ slotProps.option.flag }}</span>
            <span>{{ slotProps.option.label }}</span>
          </div>
        </template>
      </Select>
    </div>
    <SettingRow v-model="form.show_usd_price" :label="$t('settings.currency.show_usd_label')" :desc="$t('settings.currency.show_usd_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_usd_price')" />
    <SettingRow v-model="form.show_rub_price" :label="$t('settings.currency.show_rub_label')" :desc="$t('settings.currency.show_rub_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_rub_price')" />
    <SettingRow v-model="form.show_eur_price" :label="$t('settings.currency.show_eur_label')" :desc="$t('settings.currency.show_eur_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_eur_price')" />
    <SettingRow v-model="form.show_cny_price" :label="$t('settings.currency.show_cny_label')" :desc="$t('settings.currency.show_cny_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_cny_price')" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useI18n()
defineProps({ form: Object, active: String, readonly: Boolean, isFieldDirty: Function })

const currencyOptions = [
  { value: 'UZS', label: 'UZS', flag: '🇺🇿' },
  { value: 'USD', label: 'USD', flag: '🇺🇸' },
  { value: 'RUB', label: 'RUB', flag: '🇷🇺' },
  { value: 'EUR', label: 'EUR', flag: '🇪🇺' },
  { value: 'CNY', label: 'CNY', flag: '🇨🇳' },
]
</script>
