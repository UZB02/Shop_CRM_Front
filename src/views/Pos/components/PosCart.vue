<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#0b0f1a] overflow-hidden">

    <!-- ── Fixed Top: Tabs + Header ─────────────────────────────────────── -->
    <div class="px-3 sm:px-5 lg:px-6 pt-4 sm:pt-5 lg:pt-6 flex-shrink-0">

      <!-- Multi-Order Tabs -->
      <div class="flex items-center gap-1.5 mb-5 overflow-x-auto no-scrollbar pb-1 flex-shrink-0">
        <div
          v-for="(order, idx) in orders"
          :key="order.id"
          @click="$emit('switch-order', idx)"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border whitespace-nowrap text-[11px] font-black tracking-tight"
          :class="activeOrderIndex === idx
            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 hover:border-slate-200'"
        >
          <span>{{ order.name }}</span>
          <i
            v-if="orders.length > 1"
            @click.stop="$emit('remove-order', idx)"
            class="pi pi-times text-[9px] hover:text-white transition-colors"
          />
        </div>
        <button
          @click="$emit('new-order')"
          class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0"
        >
          <i class="pi pi-plus text-[11px]"></i>
        </button>
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-[15px] font-black text-slate-800 dark:text-white font-outfit m-0 tracking-tight leading-none">
            {{ $t('pos.current_sale') }}
          </h2>
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 block">
            {{ cart.length }} {{ $t('pos.items_in_cart') }}
          </span>
        </div>
        <button
          v-if="cart.length > 0"
          @click="$emit('clear')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 text-[11px] font-black"
        >
          <i class="pi pi-trash text-[11px]"></i>
          <span>{{ $t('common.clear_all') || 'Tozalash' }}</span>
        </button>
      </div>
    </div><!-- /fixed top -->

    <!-- ── Scrollable Cart Items ──────────────────────────────────────────── -->
    <div class="flex-1 overflow-y-auto no-scrollbar px-3 sm:px-5 lg:px-6 pb-2 min-h-0">

      <!-- Empty state -->
      <div
        v-if="cart.length === 0"
        class="h-full flex flex-col items-center justify-center py-12 px-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800/40 rounded-2xl opacity-40"
      >
        <div class="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
          <i class="pi pi-shopping-bag text-2xl text-slate-300 dark:text-slate-700"></i>
        </div>
        <p class="text-[11px] font-black text-slate-600 dark:text-slate-400 tracking-[0.2em] font-outfit">
          {{ $t('pos.cart_empty') }}
        </p>
      </div>

      <!-- Cart items list -->
      <div v-else class="space-y-2">
        <div
          v-for="item in cart"
          :key="item.cartItemId"
          class="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"
        >

          <!-- ── Row 1: Image · Name · Delete ───────────────────────────── -->
          <div class="flex items-center gap-2.5 px-3 pt-3 pb-2">

            <!-- Thumb -->
            <div class="w-8 h-8 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-700/40 flex-shrink-0 overflow-hidden">
              <img
                v-if="item.image || item.product_image || item.photo || item.thumbnail"
                :src="item.image || item.product_image || item.photo || item.thumbnail"
                :alt="item.name"
                class="w-full h-full object-cover rounded-lg"
                @error="(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }"
              />
              <i
                :style="(item.image || item.product_image || item.photo || item.thumbnail) ? 'display:none' : 'display:flex'"
                class="pi pi-box text-slate-300 dark:text-slate-600 text-xs"
              ></i>
            </div>

            <!-- Name + variant -->
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-bold text-slate-800 dark:text-white truncate font-outfit tracking-tight leading-tight m-0">
                {{ item.name }}
              </p>
              <div class="flex items-center gap-1 mt-0.5 flex-wrap">
                <span v-if="item.tur_name" class="px-1.5 py-px rounded text-[9px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 leading-none">
                  {{ item.tur_name }}
                </span>
                <span v-if="item.tur_color" class="px-1.5 py-px rounded text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 leading-none">
                  {{ item.tur_color }}
                </span>
              </div>
            </div>

            <!-- Delete -->
            <button
              @click="$emit('remove', item.cartItemId)"
              class="w-7 h-7 rounded-lg text-slate-300 dark:text-slate-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-150 flex-shrink-0"
              :title="$t('common.remove')"
            >
              <i class="pi pi-times text-[12px]"></i>
            </button>
          </div>

          <!-- ── Row 2: Price · Qty ──────────────────────────────────────── -->
          <div class="flex items-center gap-0 border-t border-slate-50 dark:border-slate-800/50 px-3 pb-2.5 pt-2">

            <!-- Price block -->
            <div class="flex-1 flex flex-col gap-0.5">
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-600 uppercase flex items-center">
                  {{ $t('pos.price') || 'Narx' }}
                  <i
                    v-if="settingsStore.allowPriceMarkup"
                    class="pi pi-pencil ml-1 text-[8px] text-emerald-400"
                    title="Narxni o'zgartirish mumkin"
                  />
                  <i
                    v-else
                    class="pi pi-lock ml-1 text-[8px] text-slate-300 dark:text-slate-600"
                    title="Narxni o'zgartirish o'chirilgan"
                  />
                </span>
                <!-- Markup details -->
                <div v-if="settingsStore.allowPriceMarkup && item.sale_price > item.original_sale_price" class="text-[9px] text-slate-400 flex gap-1 items-center font-semibold">
                   Asl: <span class="line-through">{{ settingsStore.formatNumber(item.original_sale_price) }}</span>
                   <span class="text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded leading-none flex items-center gap-0.5 ml-0.5">
                     <i class="pi pi-arrow-up text-[7px]" />
                     {{ $t('pos.markup') || 'Oshirildi' }}
                   </span>
                </div>
              </div>

              <!-- Editable (markup ON) -->
              <div v-if="settingsStore.allowPriceMarkup" class="flex items-baseline gap-1">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="String(item.sale_price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
                  @focus="(e) => e.target.select()"
                  @input="(e) => {
                    let cursor = e.target.selectionStart;
                    let oldLen = e.target.value.length;
                    
                    const raw = e.target.value.replace(/[\s]/g, '').replace(',', '.');
                    const val = parseFloat(raw);
                    const finalVal = isNaN(val) ? 0 : val;
                    
                    $emit('update-item-price', item.cartItemId, finalVal);
                    
                    if (!e.target.value.endsWith('.')) {
                      const formatted = String(finalVal).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                      e.target.value = formatted;
                      
                      let newLen = formatted.length;
                      let newCursor = cursor + (newLen - oldLen);
                      e.target.setSelectionRange(newCursor, newCursor);
                    }
                  }"
                  @blur="(e) => {
                    if (e.target.value === '') e.target.value = String(item.sale_price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                  }"
                  :class="item.sale_price > item.original_sale_price
                    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/20'
                    : 'text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40'"
                  class="w-[110px] text-[14px] font-black font-outfit border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
                <span class="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase">
                  {{ item.currency_code || settingsStore.currency }}
                </span>
              </div>

              <!-- Read-only (markup OFF) -->
              <div v-else class="flex items-baseline gap-1">
                <span class="text-[14px] font-black font-outfit text-slate-800 dark:text-slate-100">
                  {{ settingsStore.formatNumber(item.sale_price) }}
                </span>
                <span class="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase">
                  {{ item.currency_code || settingsStore.currency }}
                </span>
              </div>

              <!-- Subtotal (qty > 1) -->
              <span v-if="item.qty > 1" class="text-[10px] font-semibold text-slate-400 dark:text-slate-600">
                {{ item.qty }} × {{ settingsStore.formatNumber(item.sale_price) }} =
                <span class="font-black text-slate-600 dark:text-slate-400">
                  {{ settingsStore.formatNumber(item.sale_price * item.qty) }}
                </span>
              </span>
            </div>

            <!-- Qty controls -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                @click="item.qty > 1 ? $emit('update-qty', item.cartItemId, item.qty - 1) : $emit('remove', item.cartItemId)"
                class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition-all duration-150 active:scale-90"
              >−</button>
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
                class="w-9 h-7 text-[13px] font-black text-center text-slate-800 dark:text-white bg-transparent border-none outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                @click="(item.stock_available === undefined || item.qty < item.stock_available) ? $emit('update-qty', item.cartItemId, item.qty + 1) : null"
                :disabled="item.stock_available !== undefined && item.qty >= item.stock_available"
                class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 transition-all duration-150 active:scale-90"
              >+</button>
            </div>

          </div><!-- /row 2 -->

        </div><!-- /item card -->
      </div><!-- /cart list -->

    </div><!-- /scroll area -->

    <!-- ── Sticky Footer ─────────────────────────────────────────────────── -->
    <div class="flex-shrink-0 px-3 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 pt-3 border-t border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0b0f1a]">
      <div class="flex items-center justify-between px-1 mb-3">
        <span class="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-widest uppercase">
          {{ $t('pos.total_caps') }}
        </span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-[22px] font-black text-emerald-500 font-outfit tracking-tight">
            {{ settingsStore.formatNumber(totals.finalTotal) }}
          </span>
          <span class="text-[10px] font-black text-slate-300 dark:text-slate-700 tracking-widest">
            {{ (totals.currency || settingsStore.currency) === 'UZS' ? $t('pos.currency_uzs') : (totals.currency || settingsStore.currency) }}
          </span>
        </div>
      </div>

      <button
        @click="handleCheckout"
        :disabled="cart.length === 0"
        class="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-[12px] tracking-[0.18em] shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <i class="pi pi-credit-card text-sm"></i>
        <span>{{ $t('pos.proceed_to_checkout') }}</span>
        <i class="pi pi-chevron-right text-[10px]"></i>
      </button>
    </div>

    <!-- Zero Price Warning Modal -->
    <Dialog
      v-model:visible="showZeroPriceWarning"
      modal
      :header="$t('common.warning') || 'Diqqat'"
      :style="{ width: '400px' }"
      :closable="false"
      class="border-none"
    >
      <div class="flex flex-col items-center justify-center pt-2 pb-1">
        <div class="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
          <i class="pi pi-exclamation-triangle text-amber-500 text-2xl"></i>
        </div>
        <p class="text-center text-[15px] font-medium text-slate-700 dark:text-slate-300 mb-4 px-2" v-html="$t('pos.zero_price_warning') || `Savatchada narxi <span class='text-rose-500 font-bold'>0</span> bo'lgan mahsulotlar mavjud. To'lovni davom ettirmoqchimisiz?`">
        </p>

        <div class="w-full max-h-40 overflow-y-auto flex flex-col gap-1.5 no-scrollbar mb-2 px-1">
          <div
            v-for="item in zeroPriceItems"
            :key="item.cartItemId"
            class="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800/60"
          >
            <!-- Thumb -->
            <div class="w-8 h-8 bg-white dark:bg-slate-800 rounded-md flex items-center justify-center border border-slate-100 dark:border-slate-700/40 flex-shrink-0 overflow-hidden">
              <img
                v-if="item.image || item.product_image || item.photo || item.thumbnail"
                :src="item.image || item.product_image || item.photo || item.thumbnail"
                :alt="item.name"
                class="w-full h-full object-cover"
                @error="(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }"
              />
              <i
                :style="(item.image || item.product_image || item.photo || item.thumbnail) ? 'display:none' : 'display:flex'"
                class="pi pi-box text-slate-300 dark:text-slate-600 text-xs"
              ></i>
            </div>
            
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <p class="text-[12px] font-bold text-slate-700 dark:text-slate-300 truncate leading-tight">{{ item.name }}</p>
              <p class="text-[9px] text-slate-400 font-medium">{{ $t('pos.qty') || 'Miqdor' }}: {{ item.qty }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full mt-1">
          <button
            @click="showZeroPriceWarning = false"
            class="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-[13px]"
          >
            {{ $t('common.cancel') || 'Bekor qilish' }}
          </button>
          <button
            @click="confirmCheckout"
            class="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 transition-all font-bold text-[13px]"
          >
            {{ $t('pos.proceed') || 'Davom etish' }}
          </button>
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Dialog from 'primevue/dialog'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

// Qaysi mahsulot narxi tahrirlanyotganini kuzatadi
const editingPriceItemId = ref(null)

const props = defineProps({
  cart:             { type: Array,  default: () => [] },
  totals:           { type: Object, default: () => ({}) },
  orders:           { type: Array,  default: () => [] },
  activeOrderIndex: { type: Number, default: 0 }
})

const emit = defineEmits([
  'update-qty',
  'remove',
  'clear',
  'checkout',
  'search-customers',
  'update:selectedCustomer',
  'update-discount',
  'update-item-discount',
  'update-item-price',
  'new-order',
  'switch-order',
  'remove-order'
])

const showZeroPriceWarning = ref(false)
const zeroPriceItems = ref([])

function handleCheckout() {
  zeroPriceItems.value = props.cart.filter(item => Number(item.sale_price) === 0)
  if (zeroPriceItems.value.length > 0) {
    showZeroPriceWarning.value = true
  } else {
    emit('checkout')
  }
}

function confirmCheckout() {
  showZeroPriceWarning.value = false
  emit('checkout')
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
