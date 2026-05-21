<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)" 
    :header="t('subscription.topup_balance') || 'Balansni to\'ldirish'" 
    :style="{ width: '480px' }" 
    :modal="true"
    :closable="!pollingActive"
    class="topup-dialog"
  >
    <div class="flex flex-col gap-5 pt-1">
      
      <!-- Polling State View -->
      <div v-if="pollingActive" class="flex flex-col items-center justify-center py-8 px-4 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
        <div class="relative mb-6">
          <!-- Animated Ring Spinner -->
          <div class="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="pi pi-credit-card text-lg text-emerald-500 animate-pulse"></i>
          </div>
        </div>
        
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">
          {{ t('subscription.payment_waiting') || "To'lov kutilmoqda..." }}
        </h3>
        <p class="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          {{ statusText || t('subscription.payment_redirect_desc') || "To'lov oynasi yangi oynada ochildi. Telefonda to'lovni tasdiqlang. Balans avtomatik yangilanadi." }}
        </p>

        <!-- Dynamic Action Buttons for Polling -->
        <div class="flex flex-col gap-2 w-full max-w-xs">
          <Button 
            icon="pi pi-refresh" 
            :label="t('subscription.refresh_balance') || 'Balansni qo\'lda yangilash'" 
            severity="success" 
            class="!rounded-xl !text-xs !font-bold !py-2.5 shadow-md shadow-emerald-500/10" 
            @click="$emit('refresh-balance')" 
          />
          <Button 
            :label="t('common.close') || 'Oynani yopish'" 
            text 
            class="!rounded-xl !text-xs !font-bold !py-2.5 !text-slate-400 hover:!text-slate-600" 
            @click="$emit('update:visible', false)" 
          />
        </div>
      </div>

      <!-- Normal Input/Select View -->
      <div v-else class="space-y-4">
        
        <!-- Live Balance transition Card -->
        <div class="grid grid-cols-5 items-center p-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-md border border-emerald-400/20 text-white relative overflow-hidden">
          <div class="col-span-2 flex flex-col">
            <span class="text-[9px] text-emerald-100 font-bold uppercase tracking-widest leading-none mb-1">Joriy balans</span>
            <span class="text-[14px] font-black leading-none whitespace-nowrap">{{ formatPrice(currentBalance) }}</span>
          </div>
          <div class="col-span-1 flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
              <i class="pi pi-arrow-right text-xs text-white"></i>
            </div>
          </div>
          <div class="col-span-2 flex flex-col items-end">
            <span class="text-[9px] text-emerald-100 font-bold uppercase tracking-widest leading-none mb-1">Yangi balans</span>
            <span class="text-[14px] font-black leading-none whitespace-nowrap text-emerald-300">{{ formatPrice(Number(currentBalance) + Number(amount)) }}</span>
          </div>
        </div>

        <!-- Amount Input Group -->
        <div class="space-y-2">
          <label class="block text-xs font-black tracking-widest text-slate-400 uppercase">To'ldirish summasi (UZS)</label>
          <div class="flex items-center h-12 w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden focus-within:border-emerald-400 dark:focus-within:border-emerald-500/60 transition-colors">
            <span class="pl-4 pr-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap flex-shrink-0 border-r border-slate-200 dark:border-slate-700/50 h-full flex items-center select-none">Summa</span>
            <input
              type="text"
              inputmode="numeric"
              :value="amount ? Number(amount).toLocaleString('ru-RU') : ''"
              placeholder="0"
              @input="onAmountInput"
              class="flex-1 min-w-0 h-full bg-transparent border-none outline-none ring-0 px-4 text-base font-black text-right text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <!-- Quick Amount Selectors -->
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="val in quickAmounts" 
            :key="val"
            type="button"
            @click="setQuickAmount(val)"
            class="py-2 px-1 text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800/40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 rounded-xl transition-all"
          >
            +{{ Number(val / 1000) }}K
          </button>
        </div>

        <!-- Provider Select -->
        <div class="space-y-2">
          <label class="block text-xs font-black tracking-widest text-slate-400 uppercase">To'lov provayderi</label>
          <div class="flex gap-4">
            <div 
              class="flex-1 p-4 border-2 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all flex flex-col items-center gap-2 group relative overflow-hidden"
              :class="{'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/5': provider === 'click', 'border-slate-100 dark:border-slate-800/60': provider !== 'click'}"
              @click="provider = 'click'"
            >
              <!-- Glass selection glow circle -->
              <div v-if="provider === 'click'" class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl"></div>
              
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                <i class="pi pi-credit-card text-2xl text-blue-500"></i>
              </div>
              <span class="text-xs font-black tracking-widest text-slate-700 dark:text-slate-200">Click</span>
              
              <!-- Selection Tick Badge -->
              <div v-if="provider === 'click'" class="absolute right-2 top-2 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <i class="pi pi-check text-[7px] font-black"></i>
              </div>
            </div>
            
            <!-- Payme (Coming Soon / Disabled) -->
            <div class="flex-1 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-2 opacity-40 select-none relative">
              <span class="absolute top-2 right-2 text-[7px] font-black bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded uppercase tracking-wider">Tez kunda</span>
              <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <i class="pi pi-wallet text-2xl text-slate-400"></i>
              </div>
              <span class="text-xs font-black tracking-widest text-slate-400">Payme</span>
            </div>
          </div>
        </div>

        <!-- Informative note -->
        <div class="bg-amber-50/50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 p-4 rounded-2xl text-xs font-medium border border-amber-100/50 dark:border-amber-900/20 flex gap-3 items-start">
          <i class="pi pi-info-circle mt-0.5 flex-shrink-0 text-sm"></i>
          <span>To'ldirish Click tizimining xavfsiz to'lov sahifasida amalga oshiriladi. Minimal to'lov chegarasi yo'q.</span>
        </div>

      </div>
    </div>

    <!-- Footer actions -->
    <template #footer v-if="!pollingActive">
      <div class="flex gap-3 w-full pt-2">
        <Button 
          :label="t('common.cancel') || 'Bekor qilish'" 
          text 
          class="flex-1 !rounded-xl !text-xs !font-bold" 
          @click="$emit('update:visible', false)" 
        />
        <Button 
          :label="t('subscription.topup_action') || 'Click orqali to\'ldirish'" 
          icon="pi pi-external-link" 
          severity="success" 
          class="flex-1 !rounded-xl !text-xs !font-bold shadow-lg shadow-emerald-500/10" 
          :loading="loading" 
          @click="$emit('process')" 
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const props = defineProps({
  visible: Boolean,
  amount: [Number, String],
  currentBalance: [Number, String],
  loading: Boolean,
  pollingActive: Boolean,
  statusText: String
})

const emit = defineEmits(['update:visible', 'update:amount', 'process', 'refresh-balance'])

const provider = ref('click')
const quickAmounts = [50000, 100000, 200000, 500000]

const formatPrice = (value) => {
  return settingsStore.formatPrice(value)
}

const onAmountInput = (e) => {
  const raw = e.target.value.replace(/\D/g, '')
  const num = raw ? parseInt(raw) : 0
  emit('update:amount', num)
  e.target.value = raw ? Number(raw).toLocaleString('ru-RU') : ''
}

const setQuickAmount = (val) => {
  emit('update:amount', val)
}
</script>

<style scoped>
.topup-dialog :deep(.p-dialog-header) {
  padding-bottom: 0.5rem;
}
.topup-dialog :deep(.p-dialog-content) {
  overflow-y: visible;
}
</style>
