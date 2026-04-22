<template>
  <div v-show="active === 'tax'" class="settings-section">
    <SectionHeader icon="pi-percentage" color="text-rose-500">{{ $t('settings.tax.title') }}</SectionHeader>
    <SettingRow v-model="form.tax_enabled" :label="$t('settings.tax.tax_label')" :desc="$t('settings.tax.tax_desc')" :disabled="readonly" :is-dirty="isFieldDirty('tax_enabled')" />
    <div class="settings-row" :class="{'opacity-40 pointer-events-none': !form.tax_enabled || readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.tax.tax_percent_label') }}</p>
          <span v-if="isFieldDirty('tax_percent')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.tax.tax_percent_desc') }}</p>
        <p v-if="form.tax_percent === null || form.tax_percent === ''" class="text-[10px] text-amber-500 font-bold mt-1">
          <i class="pi pi-info-circle text-[9px] mr-1"></i>
          {{ $t('settings.tax.using_global_tax') }}
        </p>
      </div>
      <div class="flex items-center gap-1.5">
        <input v-model.number="form.tax_percent" type="number" min="0" max="100" step="0.01" class="settings-input w-24" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('tax_percent')}" placeholder="Global" :disabled="readonly" />
        <span class="text-xs font-black text-slate-400">%</span>
      </div>
    </div>

    <!-- OFD Section -->
    <SectionHeader icon="pi-shield" color="text-rose-500" class="mt-6">{{ $t('settings.tax.ofd_title') }}</SectionHeader>
    
    <div class="space-y-1" :class="{'opacity-40 pointer-events-none': !form.tax_enabled || readonly}">
        <div class="settings-row">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="row-label">{{ $t('settings.tax.tin_label') }}</p>
              <span v-if="isFieldDirty('tin')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
            <p class="row-desc">{{ $t('settings.tax.tin_desc') }}</p>
          </div>
          <input 
            v-model.trim="form.tin" 
            type="text" 
            maxlength="9" 
            @input="form.tin = ($event.target.value.replace(/\D/g, ''))"
            :placeholder="$t('settings.tax.tin_placeholder')" 
            class="settings-input w-40 font-mono tracking-widest" 
            :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('tin')}"
            :disabled="readonly"
          />
        </div>

        <SettingRow v-model="form.ofd_enabled" :label="$t('settings.tax.ofd_label')" :desc="$t('settings.tax.ofd_desc')" :disabled="readonly" :is-dirty="isFieldDirty('ofd_enabled')" />

        <div class="space-y-4 pt-2" :class="{'opacity-40 pointer-events-none': !form.ofd_enabled || readonly}">
          <div class="settings-row">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="row-label">{{ $t('settings.tax.ofd_provider_label') }}</p>
                <span v-if="isFieldDirty('ofd_provider')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <p class="row-desc">{{ $t('settings.tax.ofd_provider_desc') }}</p>
            </div>
            <select v-model="form.ofd_provider" class="settings-input w-40" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('ofd_provider')}" :disabled="readonly">
              <option value="click">Click</option>
              <option value="payze">Payze</option>
              <option value="multikassa">Multikassa</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="row-label">{{ $t('settings.tax.ofd_token_label') }}</p>
                <span v-if="isFieldDirty('ofd_token')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <p class="row-desc">{{ $t('settings.tax.ofd_token_desc') }}</p>
            </div>
            <input v-model.trim="form.ofd_token" type="password" :placeholder="$t('settings.tax.ofd_token_placeholder')" class="settings-input w-64" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('ofd_token')}" :disabled="readonly" />
          </div>
          <div class="settings-row">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="row-label">{{ $t('settings.tax.ofd_device_label') }}</p>
                <span v-if="isFieldDirty('ofd_device_id')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <p class="row-desc">{{ $t('settings.tax.ofd_device_desc') }}</p>
            </div>
            <input v-model.trim="form.ofd_device_id" type="text" placeholder="—" class="settings-input w-64" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('ofd_device_id')}" :disabled="readonly" />
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useI18n()
defineProps({ form: Object, active: String, readonly: Boolean, isFieldDirty: Function })
</script>
