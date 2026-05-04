<template>
  <div class="h-full flex flex-col relative">
    <!-- Workspace Header (Hidden on Mobile, Integrated in Main Header or handled separately) -->
    <div class="hidden lg:flex px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#0f172a] items-center justify-between flex-shrink-0 gap-6">
      <div class="flex items-center gap-6 flex-1 min-w-0">
        <div class="flex flex-col shrink-0">
          <h2 class="text-[14px] sm:text-[15px] font-black text-slate-800 dark:text-white font-outfit tracking-tight uppercase">
            {{ $t('warehouse.bulk.products_list') }}
          </h2>
          <span class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
            {{ validCount }} {{ $t('warehouse.bulk.total_ready_label') }}
          </span>
        </div>

        <!-- Movement Type (Integrated) -->
        <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 w-[260px] shrink-0">
          <button 
            @click="$emit('update:type', 'in')"
            class="flex-1 py-1.5 rounded-lg text-[13px] font-black tracking-widest transition-all flex items-center justify-center gap-2"
            :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-600'"
          >
            <i class="pi pi-download text-[11px]"></i>
            {{ $t('warehouse.bulk.type_in') }}
          </button>
          <button 
            @click="$emit('update:type', 'out')"
            class="flex-1 py-1.5 rounded-lg text-[13px] font-black tracking-widest transition-all flex items-center justify-center gap-2"
            :class="type === 'out' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-lg shadow-rose-500/10' : 'text-slate-400 hover:text-slate-600'"
          >
            <i class="pi pi-upload text-[11px]"></i>
            {{ $t('warehouse.bulk.type_out') }}
          </button>
        </div>

        <!-- Notes (Integrated in Header) -->
        <div class="relative group flex-1 max-w-xl">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            <i class="pi pi-pencil text-[12px]"></i>
          </div>
          <input 
            :value="note"
            @input="$emit('update:note', $event.target.value)"
            type="text" 
            :placeholder="$t('warehouse.bulk.note_ph')" 
            class="w-full bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-2 text-[14px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
          />
        </div>
      </div>

    </div>

    <!-- Mobile-only Control Strip (Type and Note) -->
    <div class="lg:hidden px-6 py-4 flex flex-col gap-3 bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800">
       <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button 
            @click="$emit('update:type', 'in')"
            class="flex-1 py-1.5 rounded-lg text-[13px] font-black tracking-widest transition-all"
            :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'"
          >
            {{ $t('warehouse.bulk.type_in') }}
          </button>
          <button 
            @click="$emit('update:type', 'out')"
            class="flex-1 py-1.5 rounded-lg text-[13px] font-black tracking-widest transition-all"
            :class="type === 'out' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-400'"
          >
            {{ $t('warehouse.bulk.type_out') }}
          </button>
       </div>
       <input 
          :value="note"
          @input="$emit('update:note', $event.target.value)"
          type="text" 
          :placeholder="$t('warehouse.bulk.note_ph')" 
          class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[14px] font-bold outline-none"
       />
    </div>

    <!-- Main Content: Card Grid -->
    <div class="flex-1 overflow-y-auto px-4 lg:px-6 py-4 custom-scrollbar bg-[#f8fafc] dark:bg-[#0f172a]/20">
      
      <!-- Empty state -->
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
        <div class="w-20 h-20 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 shadow-lg">
          <i class="pi pi-shopping-cart text-3xl text-slate-100 dark:text-slate-800"></i>
        </div>
        <h3 class="text-[13px] font-black tracking-[0.2em] uppercase">{{ $t('warehouse.bulk.empty_cart') }}</h3>
      </div>

      <!-- Cards Grid: 2 → 3 → 4 columns -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-10">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-200 group flex flex-col"
        >
          <!-- Image Banner (compact) -->
          <div class="relative h-20 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center overflow-hidden">
            <img 
              v-if="item.product.image" 
              :src="item.product.image" 
              class="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" 
            />
            <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-3xl"></i>

            <!-- Quantity badge (top-left) -->
            <div 
              class="absolute top-1.5 left-1.5 min-w-[20px] h-5 px-1 rounded-lg flex items-center justify-center text-[10px] font-black border border-white/60 dark:border-slate-700 shadow transition-colors"
              :class="item.quantity > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'"
            >
              {{ item.quantity }}
            </div>

            <!-- Delete (top-right) -->
            <button
              @click="$emit('remove', index)"
              class="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm border border-white/40 dark:border-slate-600/40 active:scale-90"
            >
              <i class="pi pi-trash text-[10px]"></i>
            </button>
          </div>

          <!-- Card Body -->
          <div class="flex flex-col gap-2 p-2.5 flex-1">

            <!-- Name & variant -->
            <div>
              <h4 class="text-[13px] font-black text-slate-800 dark:text-white leading-tight tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1">
                {{ item.product.name }}
              </h4>
              <div class="flex items-center gap-1 flex-wrap">
                <TurBadge
                  v-if="item.product.tur_name"
                  :tur-name="item.product.tur_name"
                  :tur-color="item.product.tur_color"
                  class="scale-[0.82] origin-left -ml-1 shrink-0"
                />
                <code v-else class="text-[10px] text-slate-400 dark:text-slate-500 tracking-wide truncate">
                  {{ item.product.barcode || '—' }}
                </code>
              </div>
            </div>

            <div class="h-px bg-slate-100 dark:bg-slate-700/50 mt-auto"></div>

            <!-- Miqdor -->
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{{ $t('products.form.amount') }}</span>
              <div class="flex items-center bg-slate-100 dark:bg-slate-700/60 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-600/40">
                <button
                  @click="item.quantity > 1 ? $emit('update-qty', index, item.quantity - 1) : $emit('remove', index)"
                  class="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shrink-0"
                >
                  <i class="pi pi-minus text-[9px]"></i>
                </button>
                <input
                  type="number"
                  :value="item.quantity"
                  @input="$emit('update-qty', index, parseInt($event.target.value) || 0)"
                  class="flex-1 min-w-0 h-9 text-center bg-white dark:bg-slate-800 border-x border-slate-200 dark:border-slate-600/40 text-[15px] font-black text-slate-800 dark:text-white focus:ring-0 focus:outline-none p-0"
                />
                <button
                  @click="$emit('update-qty', index, item.quantity + 1)"
                  class="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all shrink-0"
                >
                  <i class="pi pi-plus text-[9px]"></i>
                </button>
              </div>
            </div>

            <!-- Xarid narxi (faqat kirim uchun) -->
            <div v-if="type === 'in'" class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{{ $t('products.form.purchase_price') }}</span>
              <div class="relative">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-400 select-none leading-none z-10">UZS</span>
                <input
                  type="text"
                  inputmode="numeric"
                  :value="item.unit_cost > 0 ? Number(item.unit_cost).toLocaleString('ru-RU') : ''"
                  placeholder="0"
                  @keydown="e => {
                    // Ruxsat: backspace, delete, tab, esc, enter, home, end, arrows
                    if ([8, 9, 13, 27, 35, 36, 37, 38, 39, 40, 46].includes(e.keyCode)) return;
                    // Ruxsat: Ctrl/Cmd + A/C/V/X
                    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) return;
                    // Faqat raqamlar — qolgan barcha tugmalarni bloklash
                    if (!/^\d$/.test(e.key)) e.preventDefault();
                  }"
                  @input="e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const num = parseInt(raw) || 0;
                    e.target.value = raw ? Number(raw).toLocaleString('ru-RU') : '';
                    $emit('update-price', index, num);
                  }"
                  class="w-full h-9 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/50 rounded-lg pl-9 pr-2 text-[14px] font-black text-right text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  items: Array,
  type: String,
  note: String,
  saving: Boolean,
  validCount: Number
})

const emit = defineEmits(['update:type', 'update:note', 'remove', 'update-qty', 'update-price', 'save'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 10px; }
</style>


