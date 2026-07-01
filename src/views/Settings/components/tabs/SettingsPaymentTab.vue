<template>
  <div v-show="active === 'payment'" class="settings-section">
    <SectionHeader icon="pi-wallet" color="text-emerald-500">{{ $t('settings.payment.title') }}</SectionHeader>
    <SettingRow v-model="form.allow_cash" :label="$t('settings.payment.cash_label')" :desc="$t('settings.payment.cash_desc')" :disabled="readonly" :is-dirty="isFieldDirty('allow_cash')" />
    <SettingRow v-model="form.allow_card" :label="$t('settings.payment.card_label')" :desc="$t('settings.payment.card_desc')" :disabled="readonly" :is-dirty="isFieldDirty('allow_card')" />
    <SettingRow v-model="form.allow_debt" :label="$t('settings.payment.debt_label')" :desc="$t('settings.payment.debt_desc')" :disabled="readonly" :is-dirty="isFieldDirty('allow_debt')" />

    <SectionHeader icon="pi-percentage" color="text-purple-500">{{ $t('settings.payment.discount_title') }}</SectionHeader>

    <!-- Plan lock — chegirma tarifda mavjud emas -->  
    <div v-if="planFeatures.has_discount === false" class="px-4 py-3">
      <PlanLockBadge :hint="$t('plan.error_discount')" />
    </div>

    <SettingRow
      v-model="form.allow_discount"
      :label="$t('settings.payment.discount_label')"
      :desc="$t('settings.payment.discount_desc')"
      :disabled="readonly || !planFeatures.has_discount"
      :is-dirty="isFieldDirty('allow_discount')"
    />
    <div v-if="form.allow_discount && planFeatures.has_discount !== false" class="settings-row" :class="{'opacity-40 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.payment.max_discount_label') }}</p>
          <span v-if="isFieldDirty('max_discount_percent')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.payment.max_discount_desc') }}</p>
        <p v-if="form.max_discount_percent === 0" class="text-[12px] text-emerald-500 font-bold mt-1">
          <i class="pi pi-infinity text-[11px] mr-1"></i>
          {{ $t('settings.payment.unlimited_discount') }}
        </p>
      </div>
      <div class="flex items-center gap-1.5">
        <input v-model.number="form.max_discount_percent" type="number" min="0" max="100" step="1" class="settings-input w-16 text-center" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('max_discount_percent')}" :disabled="readonly" />
        <span class="text-xs font-black text-slate-400">%</span>
      </div>
    </div>

    <SettingRow
      v-model="form.allow_price_markup"
      :label="$t('settings.payment.allow_price_markup_label')"
      :desc="$t('settings.payment.allow_price_markup_desc')"
      :disabled="readonly"
      :is-dirty="isFieldDirty('allow_price_markup')"
    />
    <div v-if="form.allow_price_markup" class="mx-4 mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-800/30 flex items-start gap-2.5 animate-fadein">
      <i class="pi pi-exclamation-triangle text-amber-500 mt-0.5 text-sm" />
      <div class="flex-1">
        <p class="text-[11px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider m-0">{{ $t('common.warning') }}</p>
        <p class="text-xs text-amber-600 dark:text-amber-500 m-0 mt-1 leading-normal font-medium">{{ $t('settings.payment.allow_price_markup_warning') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
import PlanLockBadge from '@/components/PlanLockBadge.vue'

const { t } = useI18n()
const toast = useToast()

const props = defineProps({
  form: Object,
  active: String,
  readonly: Boolean,
  isFieldDirty: Function,
  planFeatures: { type: Object, default: () => ({}) }
})

// 🟢 Kritik qoida: allow_cash=false VA allow_card=false bir vaqtda bo'lishi mumkin emas.
// Foydalanuvchi ikkalasini ham o'chirmoqchi bo'lsa, darhol to'xtatamiz va ogohlantiramiz.
watch(() => [props.form.allow_cash, props.form.allow_card], ([newCash, newCard], [oldCash, oldCard]) => {
  if (!newCash && !newCard) {
    // Qaysi biri oxirgi o'chirilgan bo'lsa, o'shani qayta yoqamiz
    if (oldCash !== newCash) props.form.allow_cash = true
    if (oldCard !== newCard) props.form.allow_card = true

    toast.add({
      severity: 'warn',
      summary: t('common.validation_error'),
      detail: t('settings.payment.error_at_least_one'),
      life: 5000
    })
  }
})
</script>


