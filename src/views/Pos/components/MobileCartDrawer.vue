<template>
  <Teleport to="body">
    <!-- ── Sticky Bottom Bar ─────────────────────────────────────────── -->
    <Transition name="sticky-bar">
      <div
        v-if="cart.length > 0"
        class="lg:hidden fixed bottom-[62px] left-3 right-3 z-[150]"
      >
        <button
          @click="emit('open')"
          class="mobile-sticky-bar w-full flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl active:scale-[0.98] transition-transform"
        >
          <!-- Icon + badge -->
          <div class="relative flex-shrink-0">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <i class="pi pi-shopping-cart text-white text-base" />
            </div>
            <span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-white text-emerald-600 text-[9px] font-black rounded-full flex items-center justify-center shadow">
              {{ cart.length }}
            </span>
          </div>

          <!-- Preview text -->
          <div class="flex-1 min-w-0 text-left">
            <p class="text-white font-black text-[12px] tracking-tight leading-none mb-0.5">
              {{ cart.length }} ta mahsulot
            </p>
            <p class="text-white/60 text-[10px] font-bold truncate">
              {{ previewNames }}
            </p>
          </div>

          <!-- Total -->
          <div class="flex-shrink-0 text-right">
            <p class="text-[10px] font-bold text-white/60 leading-none mb-0.5">JAMI</p>
            <p class="text-white font-black text-[14px] leading-none">
              {{ settingsStore.formatNumber(totals.finalTotal) }}
              <span class="text-[10px] font-bold text-white/60 ml-0.5">
                {{ currencyLabel }}
              </span>
            </p>
          </div>

          <!-- Chevron -->
          <div class="flex-shrink-0 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <i class="pi pi-chevron-up text-white text-xs" />
          </div>
        </button>
      </div>
    </Transition>

    <!-- ── Cart Drawer (Bottom Sheet) ────────────────────────────────── -->
    <Transition name="cart-slide">
      <div
        v-if="modelValue"
        class="lg:hidden fixed inset-0 z-[200] flex flex-col justify-end"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="emit('update:modelValue', false)"
        />

        <!-- Sheet panel -->
        <div
          class="relative w-full bg-white dark:bg-[#0b0f1a] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
          style="max-height: 88dvh"
        >
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
            <button
              @click="emit('update:modelValue', false)"
              class="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700"
            />
          </div>

          <!-- Sheet header -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-black text-slate-800 dark:text-white tracking-tight">
                {{ $t('pos.current_sale') || 'Joriy Savdo' }}
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-black border border-emerald-100 dark:border-emerald-800">
                {{ cart.length }} ta
              </span>
            </div>
            <button
              @click="emit('update:modelValue', false)"
              class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
            >
              <i class="pi pi-times text-xs" />
            </button>
          </div>

          <!-- Cart content via slot -->
          <div class="flex-1 overflow-hidden flex flex-col min-h-0">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // drawer open/close
  cart:       { type: Array,   default: () => [] },
  totals:     { type: Object,  default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'open'])

const settingsStore = useSettingsStore()

const previewNames = computed(() => {
  const names = props.cart.slice(0, 2).map(i => i.name).join(', ')
  return props.cart.length > 2 ? `${names} +${props.cart.length - 2} ta` : names
})

const currencyLabel = computed(() => {
  const cur = props.totals.currency || settingsStore.currency
  return cur === 'UZS' ? "so'm" : cur
})
</script>

<style scoped>
/* ── Sticky Bottom Bar gradient ─────────────────────────── */
.mobile-sticky-bar {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  box-shadow:
    0 -4px 32px rgba(16, 185, 129, 0.35),
    0  8px 24px rgba(16, 185, 129, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Sticky bar slide-up */
.sticky-bar-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.sticky-bar-leave-active { transition: all 0.22s cubic-bezier(0.4, 0, 1, 1); }
.sticky-bar-enter-from   { opacity: 0; transform: translateY(20px) scale(0.95); }
.sticky-bar-leave-to     { opacity: 0; transform: translateY(16px) scale(0.97); }

/* Bottom sheet slide */
.cart-slide-enter-active { transition: opacity 0.25s ease; }
.cart-slide-leave-active { transition: opacity 0.20s ease; }
.cart-slide-enter-from,
.cart-slide-leave-to     { opacity: 0; }

.cart-slide-enter-active .relative,
.cart-slide-leave-active  .relative {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.cart-slide-enter-from .relative { transform: translateY(100%); }
.cart-slide-leave-to  .relative  { transform: translateY(100%); }
</style>
