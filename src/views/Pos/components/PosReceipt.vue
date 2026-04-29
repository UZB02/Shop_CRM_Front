<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="rc-backdrop">
      <div v-if="visible" class="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm" @click="$emit('update:visible', false)" />
    </Transition>

    <!-- Receipt Drawer -->
    <Transition name="rc-slide">
      <div v-if="visible" class="fixed top-0 right-0 h-full z-[1101] w-[420px] max-w-full flex flex-col bg-white dark:bg-[#0b0f1a] shadow-2xl">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <i class="pi pi-check text-white text-sm font-black" />
            </div>
            <div>
              <p class="text-[8px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-600 leading-none mb-0.5">Savdo yakunlandi</p>
              <p class="text-sm font-black text-slate-800 dark:text-white font-outfit leading-none">Savdo cheki #{{ t.id }}</p>
            </div>
          </div>
          <button @click="$emit('update:visible', false)"
            class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all">
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <!-- Receipt Paper -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <div id="printable-receipt" class="receipt-paper mx-auto max-w-[340px] font-mono">

            <!-- Store Header -->
            <div class="text-center py-4 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mb-3">
              <p class="text-[10px] font-black tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-1">★ ★ ★</p>
              
              <p v-if="settingsStore.receiptConfig.header" class="text-[9px] font-bold text-slate-500 mb-1 whitespace-pre-line">{{ settingsStore.receiptConfig.header }}</p>
              
              <h2 class="text-lg font-black tracking-tighter text-slate-900 dark:text-white font-outfit ">
                {{ settingsStore.storeName }}
              </h2>
              
              <p class="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest mt-0.5">{{ t.branch_name || 'Do\'kon' }}</p>
              
              <div v-if="settingsStore.receiptConfig.address || settingsStore.receiptConfig.phone" class="mt-2 text-[8px] text-slate-400 font-bold leading-tight">
                <p v-if="settingsStore.receiptConfig.address">{{ settingsStore.receiptConfig.address }}</p>
                <p v-if="settingsStore.receiptConfig.phone">Tel: {{ settingsStore.receiptConfig.phone }}</p>
              </div>
            </div>

            <!-- Meta Info -->
            <div class="space-y-1 text-[9.5px] mb-3">
              <div class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold">Sana:</span>
                <span class="text-slate-700 dark:text-slate-300 font-black">{{ t.created_on || '—' }}</span>
              </div>
              <div v-if="settingsStore.receiptConfig.showWorker" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold">Kassir:</span>
                <span class="text-slate-700 dark:text-slate-300 font-black">{{ t.worker_name || '—' }}</span>
              </div>
              <div v-if="settingsStore.isShiftEnabled" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold">Smena:</span>
                <span class="text-slate-700 dark:text-slate-300 font-black">#{{ t.smena_id || '—' }}</span>
              </div>
              <div v-if="t.customer_name" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold">Mijoz:</span>
                <span class="text-slate-700 dark:text-slate-300 font-black">{{ t.customer_name }}</span>
              </div>
              <div v-if="num(t.customer_group_discount) > 0" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold">Guruh chegirmasi:</span>
                <span class="text-rose-500 font-black">{{ num(t.customer_group_discount) }}%</span>
              </div>
              <div v-if="t.receipt_number" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold">Chek №:</span>
                <span class="text-slate-700 dark:text-slate-300 font-black">{{ t.receipt_number }}</span>
              </div>
            </div>

            <!-- Items -->
            <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3">
              <p class="text-[8px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 text-center">— MAHSULOTLAR —</p>
              <div class="space-y-2.5">
                <div v-for="(item, idx) in t.items" :key="item.id || idx">
                  <!-- Product name -->
                  <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate leading-tight">
                    {{ item.product_name || 'Mahsulot' }}
                    <span v-if="item.tur_name" class="text-slate-400 font-normal">
                      ({{ item.tur_name }}{{ item.tur_color ? ' / ' + item.tur_color : '' }})
                    </span>
                  </p>
                  <!-- qty × price = total -->
                  <div class="flex justify-between items-center mt-0.5">
                    <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold">
                      {{ num(item.quantity) }} {{ item.unit || 'dona' }} × {{ fmt(item.unit_price) }}
                    </span>
                    <span class="text-[10px] font-black text-slate-700 dark:text-slate-300">
                      {{ fmt(num(item.quantity) * num(item.unit_price)) }}
                    </span>
                  </div>
                  <!-- item discount if any -->
                  <div v-if="num(item.item_discount_pct) > 0" class="flex justify-between items-center">
                    <span class="text-[8.5px] text-rose-400 font-bold">Chegirma {{ item.item_discount_pct }}%:</span>
                    <span class="text-[8.5px] text-rose-400 font-bold">-{{ fmt(num(item.quantity) * num(item.unit_price) * num(item.item_discount_pct) / 100) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3 space-y-1.5">
              <div class="flex justify-between text-[9.5px]">
                <span class="text-slate-400 dark:text-slate-500 font-bold ">Jami narx:</span>
                <span class="text-slate-700 dark:text-slate-300 font-black">{{ fmt(t.total_price) }}</span>
              </div>

              <div v-if="num(t.discount_amount) > 0" class="flex justify-between text-[9.5px]">
                <span class="text-rose-400 font-bold ">Chegirma:</span>
                <span class="text-rose-500 font-black">-{{ fmt(t.discount_amount) }}</span>
              </div>

              <!-- Final paid line -->
              <div class="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                <span class="text-xs font-black text-slate-800 dark:text-slate-100 font-outfit tracking-tight">TO'LANDI:</span>
                <span class="text-xl font-black text-emerald-500 font-outfit">{{ fmt(t.paid_amount) }}</span>
              </div>

              <!-- Debt amount -->
              <div v-if="num(t.debt_amount) > 0" class="flex justify-between items-center">
                <span class="text-[9.5px] font-black text-amber-500 ">Qarz:</span>
                <span class="text-sm font-black text-amber-500">{{ fmt(t.debt_amount) }}</span>
              </div>
            </div>

            <!-- Payment Breakdown -->
            <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3">
              <p class="text-[8px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 text-center">— TO'LOV USULI —</p>
              <div class="space-y-1">
                <div class="flex justify-between items-center text-[9.5px]">
                  <span class="text-slate-400 dark:text-slate-500 font-bold ">Tur:</span>
                  <span class="font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {{ t.payment_type_display || t.payment_type || '—' }}
                  </span>
                </div>
                <div v-if="num(t.cash_amount) > 0" class="flex justify-between text-[9.5px]">
                  <span class="text-slate-400 dark:text-slate-500 font-bold ">Naqd:</span>
                  <span class="text-slate-700 dark:text-slate-300 font-black">{{ fmt(t.cash_amount) }}</span>
                </div>
                <div v-if="num(t.card_amount) > 0" class="flex justify-between text-[9.5px]">
                  <span class="text-slate-400 dark:text-slate-500 font-bold ">Karta:</span>
                  <span class="text-slate-700 dark:text-slate-300 font-black">{{ fmt(t.card_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="text-center border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 pb-2">
               <p v-if="settingsStore.receiptConfig.promo" class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 mb-2 italic">
                {{ settingsStore.receiptConfig.promo }}
              </p>
              <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-widest leading-relaxed">
                {{ settingsStore.receiptConfig.footer || 'Xarid uchun rahmat!' }}<br/>
                <span class="text-[8px]">★ ★ ★</span>
              </p>
            </div>

          </div>
        </div>

        <!-- Actions -->
        <div class="flex-shrink-0 px-4 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div class="grid grid-cols-2 gap-2">
            <button @click="$emit('download')"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[9px] font-black tracking-widest text-slate-600 dark:text-slate-300 transition-all active:scale-95">
              <i class="pi pi-download text-sm" />
              Yuklab olish
            </button>
            <button @click="$emit('print')"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[9px] font-black tracking-widest text-slate-600 dark:text-slate-300 transition-all active:scale-95">
              <i class="pi pi-print text-sm" />
              Chop etish
            </button>
          </div>
          <button @click="$emit('update:visible', false)"
            class="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black tracking-[0.18em] shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]">
            <i class="pi pi-plus mr-2" />
            Yangi savdo boshlash
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  transaction: Object,
  visible: Boolean
})

defineEmits(['update:visible', 'print', 'download'])

const settingsStore = useSettingsStore()

// Safe numeric conversion (handles string values from backend)
const num = (val) => parseFloat(val) || 0

// Currency formatter
const fmt = (val) => settingsStore.formatPrice(num(val))

// Shorthand for cleaner template
const t = computed(() => props.transaction || {})
</script>

<style scoped>
.receipt-paper {
  background: #fff;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  padding: 8px 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.06);
}
.dark .receipt-paper {
  background: #0f172a;
  border-color: #1e293b;
}

/* Transitions */
.rc-backdrop-enter-active, .rc-backdrop-leave-active { transition: opacity 0.25s ease; }
.rc-backdrop-enter-from, .rc-backdrop-leave-to { opacity: 0; }

.rc-slide-enter-active { transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease; }
.rc-slide-leave-active { transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s ease; }
.rc-slide-enter-from, .rc-slide-leave-to { transform: translateX(100%); opacity: 0; }

/* Print styles */
@media print {
  body * { visibility: hidden; }
  #printable-receipt, #printable-receipt * { visibility: visible; }
  #printable-receipt {
    position: absolute;
    left: 0; top: 0;
    width: 80mm;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
}
</style>
