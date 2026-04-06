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
            <span class="text-[7.5px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-600 block">To'lov</span>
            <h2 class="text-[1rem] font-black text-slate-900 dark:text-white font-outfit tracking-tight leading-tight m-0">Savdoni yakunlash</h2>
          </div>
          <button
            @click="$emit('update:visible', false)"
            class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all text-slate-400 dark:text-slate-500"
          >
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <!-- Total Hero -->
        <div class="mx-4 mt-3 rounded-xl overflow-hidden relative flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-[#090e1a] dark:to-[#040b16]">
          <div class="absolute inset-0 dark:block hidden" style="background:radial-gradient(circle at 80% 20%,rgba(16,185,129,.22) 0%,transparent 60%)" />
          <div class="absolute inset-0 block dark:hidden" style="background:radial-gradient(circle at 20% 80%,rgba(255,255,255,0.15) 0%,transparent 55%)" />
          <div class="relative px-5 py-3.5 text-center">
            <p class="text-[7.5px] font-black uppercase tracking-[0.2em] text-white/70 mb-1 m-0">Jami to'lanishi lozim</p>
            <div class="flex items-baseline justify-center gap-2">
              <span class="text-[2rem] font-black text-white font-outfit tracking-tight leading-none">{{ formatNum(total) }}</span>
              <span class="text-[11px] font-black text-white/60">UZS</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flex flex-col gap-3 px-4 pt-3 pb-3 overflow-y-auto flex-1 min-h-0">

          <!-- Payment Methods -->
          <div class="flex flex-col gap-1.5">
            <label class="lbl">To'lov usuli</label>
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
                <i :class="m.icon" class="text-[13px] leading-none" />
                <span class="text-[7.5px] font-black uppercase tracking-wide leading-none">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Chegirma miqdori (Naqd / Karta) -->
          <div v-if="paymentType !== 'mixed' && paymentType !== 'debt'" class="flex flex-col gap-1.5 animate-fadein">
            <div class="flex items-center justify-between">
              <label class="lbl">Chegirma miqdori</label>
              <button @click="discountAmount = 0"
                class="text-[7.5px] font-black text-slate-400 hover:text-slate-500 uppercase tracking-widest transition-colors">
                × Tozalash
              </button>
            </div>
            <div class="relative group">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors z-10 select-none">UZS</span>
              <InputNumber v-model="discountAmount" inputId="discount_amount" class="w-full co-amount-input" :min="0" :max="total" placeholder="0" :use-grouping="true" />
            </div>
            <!-- Yakuniy to'lanadigan summa -->
            <div v-if="paidAmount < total"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 animate-fadein">
              <div>
                <span class="text-[7.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">To'lanadigan summa</span>
                <span class="text-base font-black text-emerald-600 dark:text-emerald-400 font-outfit leading-tight">{{ formatNum(paidAmount) }} <span class="text-xs">UZS</span></span>
              </div>
              <i class="pi pi-tag text-emerald-500 text-base" />
            </div>
            <!-- Chegirma totaldan oshib ketsa ogohlantirish -->
            <div v-if="discountAmount > total"
              class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-800/30 animate-fadein">
              <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
              <span class="text-[7.5px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest">Chegirma jami summadan oshib ketmoqda!</span>
            </div>
          </div>

          <!-- Mixed -->
          <div v-if="paymentType === 'mixed'" class="flex flex-col gap-2 animate-fadein">
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <label class="lbl">Naqd pul</label>
                <InputNumber v-model="cashAmount" class="w-full co-amount-input-sm" :min="0" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="lbl">Plastik karta</label>
                <InputNumber v-model="cardAmount" class="w-full co-amount-input-sm" :min="0" />
              </div>
            </div>
            <div class="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-dashed"
              :class="isMixedValid ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'">
              <div>
                <span class="text-[7.5px] font-black uppercase tracking-widest block" :class="isMixedValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">Jami kiritildi</span>
                <span class="text-base font-black font-outfit" :class="isMixedValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">{{ formatNum(cashAmount + cardAmount) }} <span class="text-xs">UZS</span></span>
              </div>
              <div class="w-7 h-7 rounded-full flex items-center justify-center"
                :class="isMixedValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'">
                <i :class="isMixedValid ? 'pi pi-check' : 'pi pi-minus'" class="text-[9px]" />
              </div>
            </div>
          </div>

          <!-- Debt info -->
          <div v-if="paymentType === 'debt'" class="animate-fadein">
            <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800/20">
              <i class="pi pi-info-circle text-amber-500 text-sm flex-shrink-0" />
              <span class="text-[7.5px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-relaxed">Nasiyada qoldirilyapti — mijoz tanlash majburiy</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-slate-100 dark:bg-slate-800/60 flex-shrink-0" />

          <!-- Customer -->
          <div class="flex flex-col gap-1.5">
            <label class="lbl" :class="paymentType === 'debt' ? '!text-rose-500' : ''">
              Mijoz
              <span v-if="paymentType === 'debt'" class="text-rose-400 ml-1">(Majburiy)</span>
              <span v-else class="text-slate-300 dark:text-slate-700 ml-1">(Ixtiyoriy)</span>
            </label>
            <div class="relative">
              <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 z-10 text-xs" />
              <Select
                :model-value="selectedCustomer"
                @update:model-value="$emit('update:selected-customer', $event)"
                :options="customers"
                option-label="name"
                placeholder="Mijozni tanlang..."
                filter
                @filter="$emit('search-customers', $event.value)"
                class="w-full co-customer-select"
                :class="paymentType === 'debt' && !selectedCustomer ? 'co-customer-select--required' : ''"
              />
            </div>
            <div v-if="paymentType === 'debt' && !selectedCustomer"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
              <i class="pi pi-user-minus text-rose-500 text-xs" />
              <span class="text-[7.5px] font-black text-rose-500 uppercase tracking-widest">Nasiya uchun mijoz tanlash majburiy!</span>
            </div>
          </div>

          <!-- Note -->
          <div class="flex flex-col gap-1.5">
            <label class="lbl">Izoh <span class="normal-case font-medium tracking-normal text-slate-300 dark:text-slate-700">(ixtiyoriy)</span></label>
            <textarea v-model="description" class="co-textarea" placeholder="Savdo haqida qo'shimcha ma'lumot..." rows="2" />
          </div>

        </div>

        <!-- Footer -->
        <div class="px-4 py-3.5 border-t border-slate-100 dark:border-slate-800/60 flex gap-2.5 flex-shrink-0 bg-white dark:bg-[#0b0f1a]">
          <button
            @click="$emit('update:visible', false)"
            class="flex-shrink-0 px-4 py-3 rounded-xl font-black text-[8.5px] uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          >Bekor</button>
          <button
            @click="handleConfirm"
            :disabled="!isValid || loading"
            class="flex-1 py-3 px-5 rounded-xl font-black text-[9px] uppercase tracking-[0.16em] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            :class="isValid && !loading
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'"
          >
            <template v-if="loading"><i class="pi pi-spin pi-spinner text-sm" /><span>Jarayonda...</span></template>
            <template v-else><i class="pi pi-check-circle text-sm" /><span>Sotishni tasdiqlash</span></template>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useCheckout } from '@/composables/useCheckout'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'

const props = defineProps({
  visible: Boolean,
  total: Number,
  customers: Array,
  selectedCustomer: Object,
  loading: Boolean
})

const emit = defineEmits(['update:visible', 'update:selected-customer', 'search-customers', 'confirm'])

const { paymentType, discountAmount, paidAmount, cashAmount, cardAmount, description, methods, isMixedValid, isValid, handleConfirm } = useCheckout(props, emit)

const formatNum = (val) => new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(val || 0)
</script>

<style>
.lbl { font-size: 7.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.18em; color: #94a3b8; display: block; }
.dark .lbl { color: #475569; }

.co-amount-input .p-inputtext {
  background: #f8fafc !important; border: 1.5px solid #e2e8f0 !important;
  padding: 0.7rem 1rem 0.7rem 3rem !important; border-radius: 12px !important;
  font-family: 'Outfit', sans-serif !important; font-weight: 900 !important;
  font-size: 1.2rem !important; color: #0f172a !important;
  transition: all 0.2s !important; box-shadow: none !important;
}
.dark .co-amount-input .p-inputtext { background: #0f172a !important; border-color: #1e293b !important; color: #f1f5f9 !important; }
.co-amount-input .p-inputtext:focus { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,.12) !important; background: #fff !important; }
.dark .co-amount-input .p-inputtext:focus { background: #070d1a !important; }

.co-amount-input-sm .p-inputtext {
  background: #f8fafc !important; border: 1.5px solid #e2e8f0 !important;
  padding: 0.55rem 0.75rem !important; border-radius: 10px !important;
  font-family: 'Outfit', sans-serif !important; font-weight: 800 !important;
  font-size: 0.875rem !important; color: #0f172a !important;
  box-shadow: none !important; transition: all 0.2s !important;
}
.dark .co-amount-input-sm .p-inputtext { background: #0f172a !important; border-color: #1e293b !important; color: #f1f5f9 !important; }
.co-amount-input-sm .p-inputtext:focus { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,.1) !important; }

.co-customer-select { background: #f8fafc !important; border: 1.5px solid #e2e8f0 !important; border-radius: 12px !important; transition: all 0.2s !important; }
.co-customer-select .p-select-label { padding: 0.62rem 1rem 0.62rem 2.3rem !important; font-family: 'Inter', sans-serif !important; font-weight: 600 !important; font-size: 0.78rem !important; color: #334155 !important; }
.dark .co-customer-select { background: #0f172a !important; border-color: #1e293b !important; }
.dark .co-customer-select .p-select-label { color: #94a3b8 !important; }
.co-customer-select:hover { border-color: #10b981 !important; }
.co-customer-select--required { border-color: #f43f5e !important; box-shadow: 0 0 0 3px rgba(244,63,94,.08) !important; }

.co-textarea {
  width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0;
  padding: 0.6rem 0.85rem; border-radius: 12px; font-family: 'Inter', sans-serif;
  font-size: 11.5px; font-weight: 500; color: #334155; outline: none;
  resize: none; transition: all 0.2s; line-height: 1.5;
}
.dark .co-textarea { background: #0f172a; border-color: #1e293b; color: #94a3b8; }
.co-textarea:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.1); background: #fff; }
.dark .co-textarea:focus { background: #070d1a; }
</style>

<style scoped>
.co-backdrop-enter-active, .co-backdrop-leave-active { transition: opacity 0.25s ease; }
.co-backdrop-enter-from, .co-backdrop-leave-to { opacity: 0; }

.co-drawer-enter-active { transition: transform 0.3s cubic-bezier(0.22,1,.36,1), opacity 0.22s ease; }
.co-drawer-leave-active { transition: transform 0.2s cubic-bezier(.4,0,1,1), opacity 0.16s ease; }
.co-drawer-enter-from, .co-drawer-leave-to { transform: translateX(100%); opacity: 0; }

.animate-fadein { animation: fadein 0.2s ease-out; }
@keyframes fadein { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
</style>
