<template>
  <div v-show="active === 'modules'" class="settings-section">
    <SectionHeader icon="pi-th-large" color="text-blue-500">{{ $t('settings.modules.title') }}</SectionHeader>

    <!-- subcategory -->
    <div class="relative">
      <SettingRow v-model="form.subcategory_enabled" :label="$t('settings.modules.subcategory_label')" :desc="$t('settings.modules.subcategory_desc')" :disabled="readonly || !planFeatures.has_subcategory" :is-dirty="isFieldDirty('subcategory_enabled')" />
      <div v-if="planFeatures.has_subcategory === false" class="px-4 pb-3">
        <PlanLockBadge />
      </div>
    </div>

    <!-- sale_return -->
    <div class="relative">
      <SettingRow v-model="form.sale_return_enabled" :label="$t('settings.modules.sale_return_label')" :desc="$t('settings.modules.sale_return_desc')" :disabled="readonly || !planFeatures.has_sale_return" :is-dirty="isFieldDirty('sale_return_enabled')" />
      <div v-if="planFeatures.has_sale_return === false" class="px-4 pb-3">
        <PlanLockBadge />
      </div>
    </div>

    <!-- wastage -->
    <div class="relative">
      <SettingRow v-model="form.wastage_enabled" :label="$t('settings.modules.wastage_label')" :desc="$t('settings.modules.wastage_desc')" :disabled="readonly || !planFeatures.has_wastage" :is-dirty="isFieldDirty('wastage_enabled')" />
      <div v-if="planFeatures.has_wastage === false" class="px-4 pb-3">
        <PlanLockBadge />
      </div>
    </div>

    <!-- stock_audit -->
    <div class="relative">
      <SettingRow v-model="form.stock_audit_enabled" :label="$t('settings.modules.stock_audit_label')" :desc="$t('settings.modules.stock_audit_desc')" :disabled="readonly || !planFeatures.has_stock_audit" :is-dirty="isFieldDirty('stock_audit_enabled')" />
      <div v-if="planFeatures.has_stock_audit === false" class="px-4 pb-3">
        <PlanLockBadge />
      </div>
    </div>

    <!-- kpi -->
    <div class="relative">
      <SettingRow v-model="form.kpi_enabled" :label="$t('settings.modules.kpi_label')" :desc="$t('settings.modules.kpi_desc')" :disabled="readonly || !planFeatures.has_kpi" :is-dirty="isFieldDirty('kpi_enabled')" />
      <div v-if="planFeatures.has_kpi === false" class="px-4 pb-3">
        <PlanLockBadge />
      </div>
    </div>

    <!-- ── Shift bo'limi ──────────────────────────────────────────── -->
    <SectionHeader icon="pi-clock" color="text-indigo-500">{{ $t('settings.modules.shift_title') }}</SectionHeader>

    <!-- Smena yoqish/o'chirish -->
    <SettingRow
      v-model="form.shift_enabled"
      :label="$t('settings.modules.shift_label')"
      :desc="$t('settings.modules.shift_desc')"
      :disabled="readonly || !planFeatures.has_shift"
      :is-dirty="isFieldDirty('shift_enabled')"
    />

    <!-- Agar plan'da smena yo'q bo'lsa — lock banner -->
    <div v-if="planFeatures.has_shift === false" class="px-4 pb-3">
      <PlanLockBadge />
    </div>

    <!-- Smena soni — faqat shift yoqilgan va plan ruxsat bersa ko'rinadi -->
    <div v-if="planFeatures.has_shift !== false" class="settings-row" :class="{'opacity-40 pointer-events-none': !form.shift_enabled || readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.modules.shifts_per_day_label') }}</p>
          <span v-if="isFieldDirty('shifts_per_day')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.modules.shifts_per_day_desc') }}</p>
      </div>
      <select v-model="form.shifts_per_day" class="settings-input w-24" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('shifts_per_day')}" :disabled="readonly">
        <option :value="1">1 Smena</option>
        <option :value="2">2 Smena</option>
        <option :value="3">3 Smena</option>
      </select>
    </div>

    <template v-if="planFeatures.has_shift !== false">
      <SettingRow v-model="form.require_cash_count" :label="$t('settings.modules.cash_count_label')" :desc="$t('settings.modules.cash_count_desc')" :disabled="!form.shift_enabled || readonly" :is-dirty="isFieldDirty('require_cash_count')" />
      <SettingRow v-model="form.auto_pdf_on_smena_close" :label="$t('settings.modules.auto_pdf_label')" :desc="$t('settings.modules.auto_pdf_desc')" :disabled="!form.shift_enabled || readonly" :is-dirty="isFieldDirty('auto_pdf_on_smena_close')" />
    </template>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
import PlanLockBadge from '@/components/PlanLockBadge.vue'

const props = defineProps({
  form: Object,
  active: String,
  readonly: Boolean,
  isFieldDirty: Function,
  planFeatures: { type: Object, default: () => ({}) }
})

// If shift management is disabled, reset related fields
watch(() => props.form.shift_enabled, (val) => {
  if (!val) {
    props.form.require_cash_count = false
    props.form.shifts_per_day = 1
  }
})
</script>


