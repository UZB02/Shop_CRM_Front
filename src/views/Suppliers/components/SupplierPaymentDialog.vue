<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('suppliers.payment.title')"
    modal
    :style="{ width: '440px', maxWidth: '95vw' }"
    :draggable="false"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl' },
      header: { class: 'px-6 pt-5 pb-0 bg-white dark:bg-slate-900 border-b-0' },
      content: { class: 'px-6 pb-6 pt-4 bg-white dark:bg-slate-900' }
    }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
          <i class="pi pi-wallet text-emerald-500 text-base" />
        </div>
        <div>
          <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100">
            {{ $t('suppliers.payment.title') }}
          </h3>
          <p class="text-[11px] text-slate-400">{{ supplier?.name }}</p>
        </div>
      </div>
    </template>

    <!-- Current debt banner -->
    <div v-if="supplier?.debt_balance && Number(supplier.debt_balance) > 0"
      class="flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 mb-4">
      <span class="text-[12px] font-bold text-red-600 dark:text-red-400">{{ $t('suppliers.payment.current_debt') }}</span>
      <span class="text-[15px] font-black text-red-500">{{ formatMoney(supplier.debt_balance) }}</span>
    </div>

    <form @submit.prevent="$emit('save')" class="space-y-4">
      <!-- Amount -->
      <div>
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('suppliers.payment.amount') }}
          <span class="text-red-400 ml-0.5">*</span>
        </label>
        <div class="relative">
          <input
            v-model="formattedAmount"
            type="text"
            :placeholder="$t('suppliers.payment.amount_ph')"
            class="w-full h-10 pl-3 pr-16 rounded-xl border text-[13px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            :class="submitted && (!modelForm.amount || Number(modelForm.amount) <= 0)
              ? 'border-red-300 dark:border-red-500 ring-1 ring-red-200'
              : 'border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20'"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400">UZS</span>
        </div>
        <p v-if="submitted && (!modelForm.amount || Number(modelForm.amount) <= 0)"
          class="text-[11px] text-red-400 mt-1 flex items-center gap-1">
          <i class="pi pi-exclamation-circle text-[10px]" />
          {{ $t('suppliers.payment.amount_required') }}
        </p>
      </div>

      <!-- Payment type -->
      <div>
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('suppliers.payment.type') }}
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in paymentTypes"
            :key="opt.value"
            type="button"
            @click="modelForm.payment_type = opt.value"
            class="h-9 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-1.5"
            :class="modelForm.payment_type === opt.value
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300'"
          >
            <i :class="opt.icon" class="text-[11px]" />
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('common.note') }}
          <span class="font-normal text-slate-400 ml-1">({{ $t('common.optional') }})</span>
        </label>
        <input
          v-model="modelForm.description"
          type="text"
          :placeholder="$t('suppliers.payment.desc_ph')"
          class="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <!-- Immutable warning -->
      <div class="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
        <i class="pi pi-lock text-amber-400 text-[13px] mt-0.5" />
        <p class="text-[11px] font-bold text-amber-700 dark:text-amber-400">
          {{ $t('suppliers.payment.immutable_warning') }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
        <button
          type="button"
          @click="$emit('update:visible', false)"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="h-9 px-5 rounded-xl text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'" class="text-[12px]" />
          {{ saving ? $t('common.saving') : $t('suppliers.payment.save_btn') }}
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: { type: Boolean, default: false },
  supplier: { type: Object, default: null },
  modelForm: { type: Object, required: true },
  submitted: { type: Boolean, default: false },
  saving: { type: Boolean, default: false }
})
defineEmits(['update:visible', 'save'])

const formattedAmount = computed({
  get: () => {
    if (!props.modelForm.amount) return ''
    return String(props.modelForm.amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  },
  set: (val) => {
    props.modelForm.amount = val.replace(/\D/g, '')
  }
})

const paymentTypes = computed(() => [
  { value: 'cash', label: t('common.cash'), icon: 'pi pi-money-bill' },
  { value: 'card', label: t('common.card'), icon: 'pi pi-credit-card' },
  { value: 'transfer', label: t('suppliers.payment.transfer'), icon: 'pi pi-arrow-right-arrow-left' }
])

const formatMoney = (val) => {
  const n = Number(val) || 0
  return n.toLocaleString('uz-UZ') + ' UZS'
}
</script>
