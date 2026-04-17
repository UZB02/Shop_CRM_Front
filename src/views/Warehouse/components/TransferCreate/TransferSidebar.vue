<template>
  <div class="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto no-scrollbar">

    <!-- Destination card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ $t('warehouse.transfer.receiver') }}</h3>
        <span class="text-xs text-rose-500 font-medium">* {{ $t('warehouse.transfer.required') }}</span>
      </div>

      <!-- Branch / Warehouse toggle -->
      <div class="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          @click="updateTargetType('branch')"
          class="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all"
          :class="targetType === 'branch'
            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
        >
          <i class="pi pi-building text-[11px]"></i>
          {{ $t('warehouse.transfer.branch') }}
        </button>
        <button
          @click="updateTargetType('warehouse')"
          class="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all"
          :class="targetType === 'warehouse'
            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
        >
          <i class="pi pi-box text-[11px]"></i>
          {{ $t('warehouse.transfer.warehouse') }}
        </button>
      </div>

      <!-- Select dropdown -->
      <div class="relative">
        <select
          v-if="targetType === 'branch'"
          v-model="transferForm.to_branch"
          class="w-full h-9 pl-3 pr-8 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 appearance-none transition-all"
          :class="!transferForm.to_branch ? 'text-slate-400' : ''"
        >
          <option :value="null" disabled>{{ $t('warehouse.transfer.select_branch') }}</option>
          <option v-for="b in filteredBranches" :key="b.id || b._id" :value="b.id || b._id">{{ b.name }}</option>
        </select>
        <select
          v-else
          v-model="transferForm.to_warehouse"
          class="w-full h-9 pl-3 pr-8 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 appearance-none transition-all"
          :class="!transferForm.to_warehouse ? 'text-slate-400' : ''"
        >
          <option :value="null" disabled>{{ $t('warehouse.transfer.select_warehouse') }}</option>
          <option v-for="w in filteredWarehouses" :key="w.id || w._id" :value="w.id || w._id">{{ w.name }}</option>
        </select>
        <i class="pi pi-chevron-down text-[10px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
      </div>

      <!-- Selected destination preview -->
      <div
        v-if="selectedDestinationName"
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-sm"
      >
        <i class="pi text-emerald-500 text-xs"
          :class="targetType === 'branch' ? 'pi-building' : 'pi-box'"></i>
        <span class="font-medium text-emerald-700 dark:text-emerald-400">{{ selectedDestinationName }}</span>
      </div>
    </div>

    <!-- Transfer summary -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ $t('warehouse.transfer.summary') }}</h3>

      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>{{ $t('warehouse.transfer.source') }}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
            <i class="pi pi-box text-[11px] text-emerald-500"></i>
            {{ sourceName || '—' }}
          </span>
        </div>
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>{{ $t('warehouse.transfer.destination') }}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
            <i class="pi text-[11px] text-amber-500"
              :class="targetType === 'branch' ? 'pi-building' : 'pi-box'"></i>
            {{ selectedDestinationName || '—' }}
          </span>
        </div>
        <div class="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>{{ $t('warehouse.transfer.products') }}</span>
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ $t('warehouse.transfer.unit_count', { count: transferForm.items.length }) }}</span>
        </div>
      </div>

      <!-- Validation hints -->
      <div v-if="!isValid" class="space-y-1.5 pt-1">
        <div
          v-if="!selectedDestinationName"
          class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
        >
          <i class="pi pi-exclamation-circle text-[11px]"></i>
          {{ $t('warehouse.transfer.no_receiver') }}
        </div>
        <div
          v-if="!transferForm.items.length"
          class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
        >
          <i class="pi pi-exclamation-circle text-[11px]"></i>
          {{ $t('warehouse.transfer.at_least_one') }}
        </div>
      </div>
    </div>

    <!-- Note card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
      <label class="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
        {{ $t('warehouse.transfer.note') }}
        <span class="text-xs text-slate-400 font-normal">{{ $t('warehouse.transfer.optional') }}</span>
      </label>
      <textarea
        v-model="transferForm.note"
        rows="4"
        :placeholder="$t('warehouse.transfer.note_ph')"
        class="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 p-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-none transition-all"
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
</style>
