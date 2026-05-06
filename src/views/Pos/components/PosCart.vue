<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#0b0f1a] overflow-hidden">
    <!-- Fixed Top Section: Tabs + Header -->
    <div class="px-6 pt-6 flex-shrink-0">
    <!-- Multi-Order Tabs -->
    <div class="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2 flex-shrink-0">
      <div 
        v-for="(order, idx) in orders" 
        :key="order.id"
        @click="$emit('switch-order', idx)"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer border whitespace-nowrap"
        :class="activeOrderIndex === idx 
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
          : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 hover:border-slate-200'"
      >
        <span class="text-[12px] font-black tracking-tight">{{ order.name }}</span>
        <i v-if="orders.length > 1" @click.stop="$emit('remove-order', idx)" class="pi pi-times text-[10px] hover:text-white transition-colors" />
      </div>

      <button 
        @click="$emit('new-order')"
        class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0"
      >
        <i class="pi pi-plus text-[12px]"></i>
      </button>
    </div>

    <!-- Compact Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <h2 class="text-xl font-black text-slate-800 dark:text-white font-outfit m-0 tracking-tight leading-none">{{ $t('pos.current_sale') }}</h2>
        <span class="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-widest mt-1.5 opacity-60">
          {{ cart.length }} {{ $t('pos.items_in_cart') }}
        </span>
      </div>
      <button 
        v-if="cart.length > 0"
        @click="$emit('clear')" 
        class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300"
      >
        <i class="pi pi-trash text-[16px]"></i>
      </button>
    </div>
    </div><!-- end fixed top -->

    <!-- Scrollable Cart Items -->
    <div class="flex-1 overflow-y-auto no-scrollbar px-6 pb-2 min-h-0">
      <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center py-12 px-8 text-center border-2 border-dashed border-slate-50 dark:border-slate-800/40 rounded-[32px] opacity-30">
         <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-5">
            <i class="pi pi-shopping-bag text-2xl text-slate-300 dark:text-slate-700"></i>
         </div>
         <h3 class="text-[12px] font-black text-slate-800 dark:text-slate-200 tracking-[0.2em] mb-2 font-outfit">{{ $t('pos.cart_empty') }}</h3>
      </div>

      <div v-else class="space-y-2.5">
        <div 
          v-for="item in cart" 
          :key="item.cartItemId" 
          class="flex items-center gap-3 bg-white dark:bg-[#0f172a] p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:border-emerald-500/40 transition-all group"
        >
          <!-- Compact Icon -->
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-50 dark:border-slate-800/50 flex-shrink-0">
             <i class="pi pi-box text-slate-200 dark:text-slate-800 text-lg group-hover:text-emerald-500 transition-colors"></i>
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="text-[14px] font-bold text-slate-800 dark:text-white truncate font-outfit tracking-tight">{{ item.name }}</h4>
            <div v-if="item.tur_id" class="flex items-center gap-1 mt-1">
              <span class="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 tracking-widest leading-none">
                {{ item.tur_name }}
              </span>
              <span v-if="item.tur_color" class="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 tracking-widest leading-none">
                {{ item.tur_color }}
              </span>
            </div>
            <div class="mt-1">
              <span class="text-[14px] font-black text-emerald-500 font-outfit">
                {{ settingsStore.formatPrice(item.sale_price || item.price || 0, item.currency_code) }}
              </span>
            </div>
          </div>

          <!-- Vertical/Compact Qty Controller -->
          <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-100/30 dark:border-slate-800/50">
            <button @click="item.qty > 1 ? $emit('update-qty', item.cartItemId, item.qty - 1) : $emit('remove', item.cartItemId)" class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all font-bold text-sm bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">-</button>
            <input 
              type="number" 
              :value="item.qty"
              @focus="(e) => e.target.select()"
              @change="(e) => {
                let val = parseFloat(e.target.value);
                if (val > 0) $emit('update-qty', item.cartItemId, val);
                else if (val === 0) $emit('remove', item.cartItemId);
                else e.target.value = item.qty;
              }"
              class="w-10 text-[13px] font-black text-center bg-transparent border-none outline-none dark:text-slate-300 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              @click="item.stock_available === undefined || item.qty < item.stock_available ? $emit('update-qty', item.cartItemId, item.qty + 1) : null" 
              :disabled="item.stock_available !== undefined && item.qty >= item.stock_available"
              class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-all font-bold text-sm bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800"
            >+</button>
          </div>
        </div>
      </div>
    </div><!-- end scroll area -->

    <!-- Sticky Footer: Total + Checkout -->
    <div class="flex-shrink-0 px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0b0f1a]">
      <div class="flex items-center justify-between px-1 mb-4">
        <span class="text-[12px] font-black text-slate-400 dark:text-slate-700 tracking-widest">{{ $t('pos.total_caps') }}</span>
        <div class="flex items-baseline gap-1.5 text-right">
           <span class="text-2xl font-black text-emerald-500 font-outfit ">{{ settingsStore.formatNumber(totals.finalTotal) }}</span>
           <span class="text-[10px] font-black text-slate-300 dark:text-slate-700 tracking-widest">{{ (totals.currency || settingsStore.currency) === 'UZS' ? $t('pos.currency_uzs') : (totals.currency || settingsStore.currency) }}</span>
        </div>
      </div>

      <button
        @click="$emit('checkout')"
        :disabled="cart.length === 0"
        class="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-[12px] tracking-[0.2em] shadow-xl shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span>{{ $t('pos.proceed_to_checkout') }}</span>
        <i class="pi pi-chevron-right text-[10px]"></i>
      </button>
    </div><!-- end footer -->
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  cart: Array,
  totals: Object,
  orders: Array,
  activeOrderIndex: Number
})

defineEmits([
  'update-qty', 
  'remove', 
  'clear', 
  'checkout', 
  'search-customers', 
  'update:selectedCustomer', 
  'update-discount',
  'update-item-discount',
  'new-order',
  'switch-order',
  'remove-order'
])
</script>

<style>
.sr-select-retail {
  background-color: #f8fbff !important;
  border-radius: 20px !important;
  border: 1px solid #f1f5f9 !important;
  padding: 6px 12px 6px 40px !important;
  font-size: 13px !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 700 !important;
  box-shadow: none !important;
}

.dark .sr-select-retail {
  background-color: #141b2d !important;
  border-color: #1e293b !important;
}

.sr-select-retail .p-select-label {
  padding-left: 0 !important;
}

.sr-select-retail .p-select-dropdown {
  width: 3rem !important;
}
</style>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


