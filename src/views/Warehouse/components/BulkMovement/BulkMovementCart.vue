<template>
  <div class="h-full flex flex-col relative">
    <!-- Workspace Header (Hidden on Mobile, Integrated in Main Header or handled separately) -->
    <div class="hidden lg:flex px-10 py-6 border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#0f172a] items-center justify-between flex-shrink-0 gap-8">
      <div class="flex items-center gap-8 flex-1 min-w-0">
        <div class="flex flex-col shrink-0">
          <h2 class="text-xl font-black text-slate-800 dark:text-white font-outfit tracking-tight">
            {{ $t('warehouse.bulk.products_list') }}
          </h2>
          <span class="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
            {{ validCount }} {{ $t('warehouse.bulk.total_ready_label') }}
          </span>
        </div>

        <!-- Movement Type (Integrated) -->
        <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800 w-[280px] shrink-0">
          <button 
            @click="$emit('update:type', 'in')"
            class="flex-1 py-2 rounded-xl text-[12px] font-black tracking-widest transition-all flex items-center justify-center gap-2"
            :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-600'"
          >
            <i class="pi pi-download text-[9px]"></i>
            {{ $t('warehouse.bulk.type_in') }}
          </button>
          <button 
            @click="$emit('update:type', 'out')"
            class="flex-1 py-2 rounded-xl text-[12px] font-black tracking-widest transition-all flex items-center justify-center gap-2"
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
            class="w-full bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
          />
        </div>
      </div>

    </div>

    <!-- Mobile-only Control Strip (Type and Note) -->
    <div class="lg:hidden px-6 py-4 flex flex-col gap-3 bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800">
       <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button 
            @click="$emit('update:type', 'in')"
            class="flex-1 py-1.5 rounded-lg text-[11px] font-black tracking-widest transition-all"
            :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'"
          >
            {{ $t('warehouse.bulk.type_in') }}
          </button>
          <button 
            @click="$emit('update:type', 'out')"
            class="flex-1 py-1.5 rounded-lg text-[11px] font-black tracking-widest transition-all"
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
          class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[12px] font-bold outline-none"
       />
    </div>

    <!-- Main Content: Compact Row-based Workspace -->
    <div class="flex-1 overflow-y-auto px-4 lg:px-8 py-4 lg:py-6 custom-scrollbar bg-[#f8fafc] dark:bg-[#0f172a]/20">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
        <div class="w-20 h-20 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 shadow-lg">
          <i class="pi pi-shopping-cart text-3xl text-slate-100 dark:text-slate-800"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.2em] uppercase">{{ $t('warehouse.bulk.empty_cart') }}</h3>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 pb-10">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
        >
          <!-- Left/Top: Image & Info -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Image -->
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner">
              <img v-if="item.product.image" :src="item.product.image" class="w-full h-full object-cover" />
              <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-lg"></i>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0 py-0.5">
              <h4 class="text-[13px] font-black text-slate-800 dark:text-white truncate font-outfit mb-0.5 leading-tight">
                {{ item.product.name }}
              </h4>
              <div class="flex items-center gap-1.5 flex-wrap">
                <TurBadge v-if="item.product.tur_name" :tur-name="item.product.tur_name" :tur-color="item.product.tur_color" class="scale-[0.75] origin-left shrink-0" />
                <span class="text-[9px] font-bold text-slate-400 tracking-tighter italic opacity-60 truncate">{{ item.product.barcode }}</span>
              </div>
            </div>
          </div>

          <!-- Right/Bottom: Controls (Full width on mobile) -->
          <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/40 pt-2 sm:pt-0">
            <!-- Qty -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200/40 dark:border-slate-800 shadow-inner">
              <button @click="$emit('update-qty', index, item.quantity - 1)" class="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors">
                <i class="pi pi-minus text-[7px]"></i>
              </button>
              <input 
                type="number" 
                :value="item.quantity" 
                @input="$emit('update-qty', index, parseInt($event.target.value) || 0)" 
                class="w-8 text-center bg-transparent border-none text-[12px] font-black text-slate-800 dark:text-white focus:ring-0 p-0" 
              />
              <button @click="$emit('update-qty', index, item.quantity + 1)" class="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors">
                <i class="pi pi-plus text-[7px]"></i>
              </button>
            </div>

            <!-- Price & Actions -->
            <div class="flex items-center gap-2">
              <div v-if="type === 'in'" class="relative w-24 sm:w-28">
                <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[7px] font-black text-slate-400 tracking-widest uppercase">UZS</span>
                <input 
                  type="number" 
                  :value="item.unit_cost" 
                  @input="$emit('update-price', index, parseFloat($event.target.value) || 0)" 
                  class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-lg pl-8 pr-2 h-8 text-[12px] font-black text-right text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 shadow-inner transition-all" 
                />
              </div>

              <button @click="$emit('remove', index)" class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                <i class="pi pi-trash text-xs"></i>
              </button>
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
