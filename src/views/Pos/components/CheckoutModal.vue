<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="co-backdrop">
      <div
        v-if="visible"
        class="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px]"
        @click="$emit('update:visible', false)"
      />
    </Transition>

    <!-- Right Drawer -->
    <Transition name="co-drawer">
      <div
        v-if="visible"
        class="fixed top-0 right-0 h-full z-[1001] flex flex-col w-[400px] max-w-full bg-white dark:bg-[#0b0f1a] shadow-2xl shadow-black/30 overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
          <div>
            <span class="text-[11px] font-black tracking-[0.22em] text-slate-400 dark:text-slate-600 block">{{ $t('pos.payment') }}</span>
            <h2 class="text-[1rem] font-black text-slate-900 dark:text-white font-outfit tracking-tight leading-tight m-0">{{ $t('pos.complete_sale') }}</h2>
          </div>
          <button
            @click="$emit('update:visible', false)"
            class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all text-slate-400 dark:text-slate-500"
          >
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <!-- Total Hero -->
        <div class="mx-4 mt-2 rounded-xl overflow-hidden relative flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-[#090e1a] dark:to-[#040b16]">
          <div class="absolute inset-0 dark:block hidden" style="background:radial-gradient(circle at 80% 20%,rgba(16,185,129,.22) 0%,transparent 60%)" />
          <div class="absolute inset-0 block dark:hidden" style="background:radial-gradient(circle at 20% 80%,rgba(255,255,255,0.15) 0%,transparent 55%)" />
          <div class="relative px-5 py-2.5 text-center">
            <p class="text-[9px] font-black tracking-[0.2em] text-white/70 mb-0.5 m-0 leading-none">{{ $t('pos.total_to_pay') }}</p>
            <div class="flex items-baseline justify-center gap-1.5">
              <span class="text-3xl font-black text-white font-outfit tracking-tight leading-none">{{ settingsStore.formatNumber(total) }}</span>
              <span class="text-[11px] font-black text-white/60">{{ (currencyCode || settingsStore.currency) === 'UZS' ? $t('pos.currency_uzs') : (currencyCode || settingsStore.currency) }}</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flex flex-col gap-3 px-4 pt-3 pb-3 overflow-y-auto flex-1 min-h-0">

          <!-- Payment Methods -->
          <div class="flex flex-col gap-1.5">
            <label class="lbl">{{ $t('pos.payment_method') }}</label>
            <div class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <button
                v-for="m in methods"
                :key="m.id"
                @click="paymentType = m.id"
                class="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-lg transition-all duration-200"
                :class="paymentType === m.id
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md shadow-slate-200/80 dark:shadow-black/40'
                  : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'"
              >
                <i :class="m.icon" class="text-[15px] leading-none" />
                <span class="text-[11px] font-black tracking-wide leading-none">{{ $t('common.' + m.id) }}</span>
              </button>
            </div>
          </div>

          <!-- Customer -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="lbl" :class="paymentType === 'debt' ? '!text-rose-500' : ''">
                {{ $t('pos.customer') }}
                <span v-if="paymentType === 'debt'" class="text-rose-400 ml-1">({{ $t('common.required') }})</span>
                <span v-else class="text-slate-300 dark:text-slate-700 ml-1">({{ $t('common.optional') }})</span>
              </label>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="openAddCustomer"
                  class="text-[11px] font-black text-emerald-500 hover:text-emerald-600 tracking-widest transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent"
                >
                  <i class="pi pi-plus-circle" /> {{ $t('common.add') || 'Qo\'shish' }}
                </button>
                <button v-if="selectedCustomer" @click="$emit('update:selected-customer', null)"
                  class="text-[11px] font-black text-slate-400 hover:text-slate-500 tracking-widest transition-colors">
                  {{ $t('common.remove') }}
                </button>
              </div>
            </div>
            <div class="relative">
              <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 z-10 text-xs" />
              <Select
                :model-value="selectedCustomer"
                @update:model-value="$emit('update:selected-customer', $event)"
                :options="customers"
                optionLabel="name"
                :placeholder="$t('pos.select_customer')"
                filter
                showClear
                @filter="$emit('search-customers', $event.value)"
                class="w-full co-customer-select"
                :class="paymentType === 'debt' && !selectedCustomer ? 'co-customer-select--required' : ''"
              />
            </div>

            <div v-if="paymentType === 'debt' && !selectedCustomer"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
              <i class="pi pi-user-minus text-rose-500 text-xs" />
              <span class="text-[11px] font-black text-rose-500 tracking-widest">{{ $t('pos.debt_customer_required') }}</span>
            </div>
          </div>

          <!-- Debt Specifics -->
          <CheckoutDebtDetails
            v-if="paymentType === 'debt'"
            v-model:debt-cash-amount="debtCashAmount"
            v-model:debt-card-amount="debtCardAmount"
            :is-debt-overflow="isDebtOverflow"
            :remaining-debt="remainingDebt"
            :currency-code="currencyCode"
          />

          <!-- Mixed Specifics -->
          <CheckoutMixedDetails
            v-if="paymentType === 'mixed'"
            v-model:cash-amount="cashAmount"
            v-model:card-amount="cardAmount"
            :is-cash-overflow="isCashOverflow"
            :is-card-overflow="isCardOverflow"
            :is-sum-overflow="isSumOverflow"
            :is-mixed-valid="isMixedValid"
            :paid-amount="paidAmount"
            :currency-code="currencyCode"
          />

          <!-- Debt info -->
          <div v-if="paymentType === 'debt'" class="animate-fadein">
            <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800/20">
              <i class="pi pi-info-circle text-amber-500 text-sm flex-shrink-0" />
              <span class="text-[11px] font-black text-amber-600 dark:text-amber-400 tracking-widest leading-relaxed">{{ $t('pos.debt_customer_required_info') }}</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-slate-100 dark:bg-slate-800/60 flex-shrink-0" />

          <!-- Discount Section -->
          <CheckoutDiscountSection
            v-model:discount-amount="discountAmount"
            :allow-discount="allowDiscount"
            :max-discount-pct="maxDiscountPct"
            :max-discount-amount="maxDiscountAmount"
            :is-discount-valid="isDiscountValid"
            :total-discount-amount="totalDiscountAmount"
            :paid-amount="paidAmount"
            :payment-type="paymentType"
            :total="total"
            :currency-code="currencyCode"
          />

          <!-- Note -->
          <div class="flex flex-col gap-1.5">
            <label class="lbl">{{ $t('common.note') }} <span class="normal-case font-medium tracking-normal text-slate-300 dark:text-slate-700">({{ $t('common.optional') }})</span></label>
            <textarea v-model="description" class="co-textarea" :placeholder="$t('pos.sale_additional_info')" rows="2" />
          </div>

        </div>

        <!-- Footer -->
        <div class="px-4 py-3.5 border-t border-slate-100 dark:border-slate-800/60 flex gap-2.5 flex-shrink-0 bg-white dark:bg-[#0b0f1a]">
          <button
            @click="$emit('update:visible', false)"
            class="flex-shrink-0 px-4 py-3 rounded-xl font-black text-[8.5px] tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          >{{ $t('common.cancel') }}</button>
          <button
            @click="handleConfirm"
            :disabled="!isValid || loading"
            class="flex-1 py-3 px-5 rounded-xl font-black text-[11px] tracking-[0.16em] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            :class="isValid && !loading
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'"
          >
            <template v-if="loading"><i class="pi pi-spin pi-spinner text-sm" /><span>{{ $t('common.processing') }}</span></template>
            <template v-else><i class="pi pi-check-circle text-sm" /><span>{{ $t('pos.confirm_sale') }}</span></template>
          </button>
        </div>
      </div>
    </Transition>

    <CustomerDialog
      v-model:visible="customerDialogVisible"
      :customer="newCustomer"
      :groups="customerGroups"
      :saving="customerSaving"
      :submitted="customerSubmitted"
      @save="handleSaveCustomer"
      @hide="closeAddCustomer"
    />
  </Teleport>
</template>

<script setup>
import { useCheckout } from '@/composables/useCheckout'
import { useSettingsStore } from '@/store/settings'
import Select from 'primevue/select'
import CustomerDialog from '@/views/Customers/components/CustomerDialog.vue'
import CheckoutDebtDetails from './CheckoutDebtDetails.vue'
import CheckoutMixedDetails from './CheckoutMixedDetails.vue'
import CheckoutDiscountSection from './CheckoutDiscountSection.vue'
import { useQuickCustomer } from '@/views/Pos/composables/useQuickCustomer'

const settingsStore = useSettingsStore()

const props = defineProps({
  visible: Boolean,
  total: Number,
  currencyCode: String,
  customers: Array,
  customerGroups: Array,
  selectedCustomer: Object,
  loading: Boolean
})

const emit = defineEmits(['update:visible', 'update:selected-customer', 'search-customers', 'confirm', 'customer-added'])

const {
  customerDialogVisible,
  customerSaving,
  customerSubmitted,
  newCustomer,
  openAddCustomer,
  closeAddCustomer,
  handleSaveCustomer
} = useQuickCustomer(emit)

const { 
  paymentType, 
  discountAmount, 
  totalDiscountAmount,
  paidAmount, 
  cashAmount, 
  cardAmount, 
  debtCashAmount,
  debtCardAmount,
  remainingDebt,
  description, 
  methods, 
  allowDiscount,
  maxDiscountPct,
  maxDiscountAmount,
  isDiscountValid,
  isMixedValid, 
  isCashOverflow, 
  isCardOverflow, 
  isSumOverflow, 
  isDebtOverflow,
  isValid, 
  handleConfirm 
} = useCheckout(props, emit)
</script>

<style src="./checkout-modal.css"></style>
