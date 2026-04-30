<template>
  <div class="h-full flex flex-col relative">
    <!-- Workspace Header (Hidden on Mobile, Integrated in Main Header or handled separately) -->
    <div class="hidden lg:flex px-10 py-6 border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#0f172a] items-center justify-between flex-shrink-0 gap-8">
      <div class="flex items-center gap-8 flex-1 min-w-0">
        <div class="flex flex-col shrink-0">
          <h2 class="text-lg font-black text-slate-800 dark:text-white font-outfit tracking-tight">
            {{ $t('warehouse.bulk.products_list') }}
          </h2>
          <span class="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
            {{ validCount }} {{ $t('warehouse.bulk.total_ready_label') }}
          </span>
        </div>

        <!-- Movement Type (Integrated) -->
        <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800 w-[280px] shrink-0">
          <button 
            @click="$emit('update:type', 'in')"
            class="flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center justify-center gap-2"
            :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-600'"
          >
            <i class="pi pi-download text-[9px]"></i>
            {{ $t('warehouse.bulk.type_in') }}
          </button>
          <button 
            @click="$emit('update:type', 'out')"
            class="flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center justify-center gap-2"
            :class="type === 'out' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-lg shadow-rose-500/10' : 'text-slate-400 hover:text-slate-600'"
          >
            <i class="pi pi-upload text-[9px]"></i>
            {{ $t('warehouse.bulk.type_out') }}
          </button>
        </div>

        <!-- Notes (Integrated in Header) -->
        <div class="relative group flex-1 max-w-xl">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            <i class="pi pi-pencil text-[10px]"></i>
          </div>
          <input 
            :value="note"
            @input="$emit('update:note', $event.target.value)"
            type="text" 
            :placeholder="$t('warehouse.bulk.note_ph')" 
            class="w-full bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
          />
        </div>
      </div>

    </div>

    <!-- Mobile-only Control Strip (Type and Note) -->
    <div class="lg:hidden px-6 py-4 flex flex-col gap-3 bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800">
       <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button 
            @click="$emit('update:type', 'in')"
            class="flex-1 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all"
            :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'"
          >
            {{ $t('warehouse.bulk.type_in') }}
          </button>
          <button 
            @click="$emit('update:type', 'out')"
            class="flex-1 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all"
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
          class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
       />
    </div>

    <!-- Main Content: Compact Row-based Workspace -->
    <div class="flex-1 overflow-y-auto px-4 lg:px-8 py-4 lg:py-6 custom-scrollbar bg-[#f8fafc] dark:bg-[#0f172a]/20">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
        <div class="w-20 h-20 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 shadow-lg">
          <i class="pi pi-shopping-cart text-3xl text-slate-100 dark:text-slate-800"></i>
        </div>
        <h3 class="text-[9px] font-black tracking-[0.2em] uppercase">{{ $t('warehouse.bulk.empty_cart') }}</h3>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 pb-10">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3 pl-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <!-- Product Info (Compact Row) -->
          <div class="flex-1 min-w-[140px] flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner">
              <img v-if="item.product.image" :src="item.product.image" class="w-full h-full object-cover" />
              <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-sm"></i>
            </div>
            <div class="flex flex-col min-w-0">
              <h4 class="text-[10px] font-black text-slate-800 dark:text-white truncate font-outfit">{{ item.product.name }}</h4>
              <div class="flex items-center gap-2 mt-0.5">
                <TurBadge v-if="item.product.tur_name" :tur-name="item.product.tur_name" :tur-color="item.product.tur_color" class="scale-[0.7] origin-left" />
                <span class="text-[7px] font-bold text-slate-400 tracking-tighter italic opacity-60">{{ item.product.barcode }}</span>
              </div>
            </div>
          </div>

          <!-- Controls Container (Quantity + Price) -->
          <div class="flex items-center gap-3 ml-auto sm:ml-0">
            <!-- Quantity Control -->
            <div class="shrink-0">
              <div class="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200/40 dark:border-slate-800 shadow-inner">
                <button @click="$emit('update-qty', index, item.quantity - 1)" class="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-400">
                  <i class="pi pi-minus text-[6px]"></i>
                </button>
                <input type="number" :value="item.quantity" @input="$emit('update-qty', index, parseInt($event.target.value) || 0)" class="w-8 text-center bg-transparent border-none text-[10px] font-black text-slate-800 dark:text-white focus:ring-0" />
                <button @click="$emit('update-qty', index, item.quantity + 1)" class="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-400">
                  <i class="pi pi-plus text-[6px]"></i>
                </button>
              </div>
            </div>

            <!-- Price Input (Compact) -->
            <div v-if="type === 'in'" class="shrink-0">
              <div class="relative group/price w-24 sm:w-32">
                <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[6px] font-black text-slate-300 transition-colors uppercase tracking-widest">UZS</span>
                <input type="number" :value="item.unit_cost" @input="$emit('update-price', index, parseFloat($event.target.value) || 0)" class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-xl pl-6 sm:pl-8 pr-2 py-1.5 text-[10px] font-black text-right text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 shadow-inner" />
              </div>
            </div>

            <!-- Actions -->
            <button @click="$emit('remove', index)" class="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
              <i class="pi pi-trash text-[9px]"></i>
            </button>
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
