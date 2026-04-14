<template>
  <div v-show="active === 'currency'" class="settings-section">
    <SectionHeader icon="pi-dollar" color="text-amber-500">{{ $t('settings.currency.title') }}</SectionHeader>
    <div class="settings-row">
      <div class="flex-1">
        <p class="row-label">{{ $t('settings.currency.default_label') }}</p>
        <p class="row-desc">{{ $t('settings.currency.default_desc') }}</p>
      </div>
      <Select 
        v-model="form.default_currency" 
        :options="currencyOptions" 
        optionLabel="label" 
        optionValue="value"
        class="!w-[140px]"
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
    <SettingRow v-model="form.show_usd_price" :label="$t('settings.currency.show_usd_label')" :desc="$t('settings.currency.show_usd_desc')" />
    <SettingRow v-model="form.show_rub_price" :label="$t('settings.currency.show_rub_label')" :desc="$t('settings.currency.show_rub_desc')" />
    <SettingRow v-model="form.show_eur_price" :label="$t('settings.currency.show_eur_label')" :desc="$t('settings.currency.show_eur_desc')" />
    <SettingRow v-model="form.show_cny_price" :label="$t('settings.currency.show_cny_label')" :desc="$t('settings.currency.show_cny_desc')" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useI18n()
defineProps({ form: Object, active: String })

const currencyOptions = [
  { value: 'UZS', label: 'UZS', flag: '🇺🇿' },
  { value: 'USD', label: 'USD', flag: '🇺🇸' },
  { value: 'RUB', label: 'RUB', flag: '🇷🇺' },
  { value: 'EUR', label: 'EUR', flag: '🇪🇺' },
  { value: 'CNY', label: 'CNY', flag: '🇨🇳' },
]
</script>
