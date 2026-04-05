<template>
  <div class="h-full flex flex-col p-6 bg-white dark:bg-[#0b0f1a]">
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
        <span class="text-[10px] font-black uppercase tracking-tight">{{ order.name }}</span>
        <i v-if="orders.length > 1" @click.stop="$emit('remove-order', idx)" class="pi pi-times text-[8px] hover:text-white transition-colors" />
      </div>

      <button 
        @click="$emit('new-order')"
        class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0"
      >
        <i class="pi pi-plus text-[10px]"></i>
      </button>
    </div>

    <!-- Compact Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <h2 class="text-xl font-black text-slate-800 dark:text-white font-outfit m-0 uppercase tracking-tight leading-none">Joriy Savdo</h2>
        <span class="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1.5 opacity-60">
          {{ cart.length }} ta mahsulot savatchada
        </span>
      </div>
      <button 
        v-if="cart.length > 0"
        @click="$emit('clear')" 
        class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300"
      >
        <i class="pi pi-trash text-[14px]"></i>
      </button>
    </div>

    <!-- High-Density Bag -->
    <div class="flex-1 overflow-y-auto custom-scrollbar no-scrollbar pr-1 min-h-[300px]">
      <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center py-20 px-8 text-center border-2 border-dashed border-slate-50 dark:border-slate-800/40 rounded-[32px] opacity-30">
         <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-5">
            <i class="pi pi-shopping-bag text-2xl text-slate-300 dark:text-slate-700"></i>
         </div>
         <h3 class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] mb-2 font-outfit">Savat bo'sh</h3>
      </div>

      <div v-else class="space-y-2.5">
        <div 
          v-for="item in cart" 
          :key="item.id" 
          class="flex items-center gap-3 bg-white dark:bg-[#0f172a] p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:border-emerald-500/40 transition-all group"
        >
          <!-- Compact Icon -->
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-50 dark:border-slate-800/50 flex-shrink-0">
             <i class="pi pi-box text-slate-200 dark:text-slate-800 text-lg group-hover:text-emerald-500 transition-colors"></i>
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="text-[12px] font-bold text-slate-800 dark:text-white truncate font-outfit uppercase tracking-tight">{{ item.name }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[12px] font-black text-emerald-500 font-outfit">
                {{ formatCurrency(item.sale_price || item.price || 0) }}
              </span>
            </div>
          </div>

          <!-- Vertical/Compact Qty Controller -->
          <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-100/30 dark:border-slate-800/50">
            <button @click="item.qty > 1 ? $emit('update-qty', item.id, item.qty - 1) : $emit('remove', item.id)" class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all font-bold text-sm bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">-</button>
            <span class="text-[11px] font-black w-3 text-center dark:text-slate-300">{{ item.qty }}</span>
            <button @click="$emit('update-qty', item.id, item.qty + 1)" class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all font-bold text-sm bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Customer Section -->
    <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/40">
      <div class="flex flex-col gap-3">
        <label class="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">
          MIJOZ (NASIYA UCHUN)
        </label>
        <div class="relative">
          <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 z-10 text-xs"></i>
          <Select 
            :model-value="selectedCustomer"
            @update:model-value="$emit('update:selectedCustomer', $event)"
            :options="customers" 
            option-label="fullname" 
            placeholder="Tanlanmagan" 
            filter
            @filter="$emit('search-customers', $event.value)"
            class="w-full sr-select-retail-compact"
          />
        </div>
      </div>
    </div>

    <!-- Final Summary -->
    <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/40 space-y-6">
      <div class="flex items-center justify-between px-1">
        <span class="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest">JAMI:</span>
        <div class="flex items-baseline gap-1.5 text-right">
           <span class="text-2xl font-black text-emerald-500 font-outfit uppercase">{{ formatCurrency(totals.finalTotal).replace('UZS','') }}</span>
           <span class="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">UZS</span>
        </div>
      </div>

      <button 
        @click="$emit('checkout')"
        :disabled="cart.length === 0"
        class="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span>TO'LOVGA O'TISH</span>
        <i class="pi pi-chevron-right text-[8px]"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'

const props = defineProps({
  cart: Array,
  totals: Object,
  customers: Array,
  selectedCustomer: Object,
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

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
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
