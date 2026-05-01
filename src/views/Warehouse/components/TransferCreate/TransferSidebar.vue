<template>
  <div class="w-full lg:w-72 flex flex-col gap-3 sm:gap-4 shrink-0 overflow-y-auto no-scrollbar pb-10">

    <!-- Destination Card -->
    <div class="bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3 sm:space-y-3.5">
      <div class="flex items-center justify-between">
        <h3 class="text-[12px] sm:text-[13px] font-black text-slate-400 tracking-[0.1em] uppercase opacity-70">{{ $t('warehouse.transfer.receiver') }}</h3>
        <span class="text-[11px] sm:text-[12px] font-bold text-rose-500 uppercase tracking-tighter">* {{ $t('warehouse.transfer.required') }}</span>
      </div>

      <!-- Branch / Warehouse Toggle -->
      <div class="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/20 dark:border-slate-800/50 shadow-inner">
        <button
          @click="updateTargetType('branch')"
          class="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 rounded-lg text-[13px] sm:text-[14px] font-black tracking-widest transition-all uppercase"
          :class="targetType === 'branch'
            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md border border-emerald-500/10'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
        >
          <i class="pi pi-building text-[12px]"></i>
          {{ $t('warehouse.transfer.branch') }}
        </button>
        <button
          @click="updateTargetType('warehouse')"
          class="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 rounded-lg text-[13px] sm:text-[14px] font-black tracking-widest transition-all uppercase"
          :class="targetType === 'warehouse'
            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md border border-amber-500/10'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
        >
          <i class="pi pi-box text-[12px]"></i>
          {{ $t('warehouse.transfer.warehouse') }}
        </button>
      </div>

      <!-- Select Dropdown -->
      <div class="relative group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi text-[14px]" :class="targetType === 'branch' ? 'pi-map-marker' : 'pi-home'"></i>
        </div>
        <select
          v-if="targetType === 'branch'"
          v-model="transferForm.to_branch"
          class="w-full h-10 pl-10 pr-8 text-[15px] sm:text-[16px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all appearance-none"
        >
          <option :value="null" disabled>{{ $t('warehouse.transfer.select_branch') }}</option>
          <option v-for="b in filteredBranches" :key="b.id || b._id" :value="b.id || b._id">{{ b.name }}</option>
        </select>
        <select
          v-else
          v-model="transferForm.to_warehouse"
          class="w-full h-10 pl-10 pr-8 text-[15px] sm:text-[16px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all appearance-none"
        >
          <option :value="null" disabled>{{ $t('warehouse.transfer.select_warehouse') }}</option>
          <option v-for="w in filteredWarehouses" :key="w.id || w._id" :value="w.id || w._id">{{ w.name }}</option>
        </select>
        <i class="pi pi-chevron-down text-[10px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:rotate-180 transition-transform"></i>
      </div>

      <!-- Selected Destination Badge -->
      <Transition name="fade">
        <div
          v-if="selectedDestinationName"
          class="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10"
        >
          <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-emerald-100/50 dark:border-emerald-500/10 shrink-0">
            <i class="pi text-emerald-500 text-[13px]" :class="targetType === 'branch' ? 'pi-building' : 'pi-box'"></i>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-[11px] font-black text-emerald-500 tracking-widest uppercase opacity-80 leading-none mb-1">{{ $t('warehouse.transfer.receiver') }}</span>
            <span class="text-[14px] sm:text-[15px] font-black text-emerald-700 dark:text-emerald-400 truncate">{{ selectedDestinationName }}</span>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Summary Card -->
    <div class="bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3 sm:space-y-3.5">
      <h3 class="text-[12px] sm:text-[13px] font-black text-slate-400 tracking-[0.1em] uppercase opacity-70">{{ $t('warehouse.transfer.summary') }}</h3>

      <div class="space-y-2 sm:space-y-2.5">
        <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
          <div class="flex flex-col min-w-0">
            <span class="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-widest uppercase mb-0.5 opacity-60 leading-none truncate">{{ $t('warehouse.transfer.source') }}</span>
            <span class="text-[13px] sm:text-[14px] font-black text-slate-700 dark:text-white truncate max-w-[80px] sm:max-w-[100px]">{{ sourceName || '—' }}</span>
          </div>
          <i class="pi pi-arrow-right text-[12px] text-slate-300 shrink-0"></i>
          <div class="flex flex-col text-right min-w-0">
            <span class="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-widest uppercase mb-0.5 opacity-60 leading-none truncate">{{ $t('warehouse.transfer.destination') }}</span>
            <span class="text-[13px] sm:text-[14px] font-black text-slate-700 dark:text-white truncate max-w-[80px] sm:max-w-[100px]">{{ selectedDestinationName || '—' }}</span>
          </div>
        </div>


      </div>

      <!-- Validation Errors -->
      <div v-if="!isValid" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 space-y-1 sm:space-y-1.5">
        <div
          v-if="!selectedDestinationName"
          class="flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-rose-600 dark:text-rose-400"
        >
          <i class="pi pi-exclamation-circle text-[12px]"></i>
          {{ $t('warehouse.transfer.no_receiver') }}
        </div>
        <div
          v-if="!transferForm.items.length"
          class="flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-rose-600 dark:text-rose-400"
        >
          <i class="pi pi-exclamation-circle text-[12px]"></i>
          {{ $t('warehouse.transfer.at_least_one') }}
        </div>
      </div>
    </div>

    <!-- Note Card -->
    <div class="bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-2 sm:space-y-2.5">
      <div class="flex items-center justify-between">
        <label class="text-[12px] sm:text-[13px] font-black text-slate-400 tracking-[0.1em] uppercase opacity-70">{{ $t('warehouse.transfer.note') }}</label>
        <span class="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase opacity-60">{{ $t('warehouse.transfer.optional') }}</span>
      </div>
      <textarea
        v-model="transferForm.note"
        rows="2"
        :placeholder="$t('warehouse.transfer.note_ph')"
        class="w-full text-[15px] sm:text-[16px] font-bold rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white placeholder-slate-400 p-2.5 sm:p-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 resize-none transition-all shadow-inner"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  targetType: String,
  transferForm: Object,
  filteredBranches: Array,
  filteredWarehouses: Array,
  sourceName: String,
  selectedDestinationName: String,
  isValid: Boolean
});

const emit = defineEmits(['update:targetType']);

const updateTargetType = (type) => {
  emit('update:targetType', type);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-5px); }
</style>


