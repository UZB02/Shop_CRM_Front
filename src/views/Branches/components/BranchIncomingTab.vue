<template>
  <div class="space-y-3">
    <!-- Tab Loading Progress -->
    <div v-if="loading" class="absolute inset-x-0 -top-2 h-0.5 bg-emerald-500/10 overflow-hidden rounded-full z-10">
      <div class="h-full bg-emerald-500/40 animate-loading"></div>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm shadow-slate-100 dark:shadow-none">
      <!-- Tab Header -->
      <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i class="pi pi-history text-emerald-500 text-sm"></i>
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-widest leading-none">{{ $t('warehouse.detail.incoming_title') }}</h3>
            <p class="text-[12px] text-slate-400 mt-1 font-medium">{{ $t('warehouse.detail.total_count', { count: incomingTotal }) }}</p>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div v-if="incomingHistory.length" class="w-full">
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto custom-scrollbar">
          <table class="w-full text-left min-w-[950px]">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('products.col_product') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.amount') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.all') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_worker') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_description') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.date') }}</th>
                <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
              <tr 
                v-for="item in incomingHistory" 
                :key="item.id" 
                class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group"
                :class="{ 'opacity-60 bg-slate-50/10 dark:bg-slate-800/5': item.is_void || item.is_voided || item.status === 'voided' }"
              >
                <!-- Product -->
                <td class="px-5 py-3.5">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center flex-wrap gap-2">
                      <span 
                        class="text-xs font-bold tracking-tight group-hover:text-emerald-500 transition-colors"
                        :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'text-slate-700 dark:text-slate-200' ]"
                      >
                        {{ item.product_name }}
                      </span>
                      <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                    </div>
                    <span class="text-[11px] font-medium text-slate-400">{{ item.product_barcode }} | {{ item.product_unit }}</span>
                  </div>
                </td>
                <!-- Quantity -->
                <td class="px-5 py-3.5 text-right">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[12px]"
                    :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' ]"
                  >
                    {{ item.quantity }}
                  </span>
                </td>
                <!-- Purchase Price -->
                <td class="px-5 py-3.5 text-right text-[12px] font-medium text-slate-500 dark:text-slate-400">
                  {{ Number(item.unit_cost || 0).toLocaleString() }}
                </td>
                <!-- Total Cost -->
                <td class="px-5 py-3.5 text-right font-black text-[12px]">
                  <span 
                    :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'text-slate-800 dark:text-slate-100' ]"
                  >
                    {{ Number(item.total_cost || 0).toLocaleString() }}
                  </span>
                </td>
                <!-- Worker -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white dark:border-slate-700 shadow-sm">
                      {{ item.worker_name?.charAt(0) }}
                    </div>
                    <span class="text-[12px] font-medium text-slate-600 dark:text-slate-400">{{ item.worker_name }}</span>
                  </div>
                </td>
                <!-- Description -->
                <td class="px-5 py-3.5">
                  <div class="flex flex-col gap-1 text-left">
                    <span 
                      class="text-[12px] font-medium max-w-[150px] truncate block" 
                      :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-600 dark:text-slate-300' ]"
                      :title="item.description"
                    >
                      {{ item.description || '—' }}
                    </span>
                    <span 
                      v-if="(item.is_void || item.is_voided || item.status === 'voided') && item.void_reason" 
                      class="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-500 dark:text-rose-400 tracking-wide bg-rose-500/5 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/10 max-w-[180px] truncate"
                      :title="item.void_reason"
                    >
                      <i class="pi pi-info-circle text-[9px]"></i>
                      {{ item.void_reason }}
                    </span>
                  </div>
                </td>
                <!-- Date -->
                <td class="px-5 py-3.5 text-right">
                  <span class="text-[12px] font-bold text-slate-400">{{ item.created_on }}</span>
                </td>
                <!-- Actions -->
                <td class="px-5 py-3.5 text-right">
                  <div class="flex items-center justify-end">
                    <span 
                      v-if="item.is_void || item.is_voided || item.status === 'voided'" 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm"
                      :title="`${$t('warehouse.detail.void_status_voided')}${item.void_reason ? ': ' + item.void_reason : ''}`"
                    >
                      <i class="pi pi-times text-sm"></i>
                    </span>
                    <button 
                      v-else 
                      @click="openVoidDialog(item)" 
                      class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-slate-100 dark:border-slate-800/60 active:scale-90 transition-all flex items-center justify-center" 
                      :title="$t('warehouse.detail.void_btn')"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          <div 
            v-for="item in incomingHistory" 
            :key="`mob-${item.id}`"
            class="p-4 bg-white dark:bg-slate-900 transition-colors"
            :class="{ 'opacity-60 bg-slate-50/50 dark:bg-slate-800/20': item.is_void || item.is_voided || item.status === 'voided' }"
          >
            <!-- Top section: Product & Actions -->
            <div class="flex justify-between items-start mb-3 gap-3">
              <div class="flex flex-col gap-1 min-w-0 flex-1">
                <div class="flex items-center flex-wrap gap-2">
                  <span 
                    class="text-[14px] font-black tracking-tight"
                    :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'text-slate-800 dark:text-slate-100' ]"
                  >
                    {{ item.product_name }}
                  </span>
                  <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                </div>
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <span>{{ item.product_barcode }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span>{{ item.product_unit }}</span>
                </div>
              </div>
              
              <!-- Action Button -->
              <div class="shrink-0 flex items-center">
                <span 
                  v-if="item.is_void || item.is_voided || item.status === 'voided'" 
                  class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm"
                >
                  <i class="pi pi-times text-sm"></i>
                </span>
                <button 
                  v-else 
                  @click="openVoidDialog(item)" 
                  class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-rose-500 border border-slate-100 dark:border-slate-800/60 active:scale-95 transition-all flex items-center justify-center shadow-sm" 
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Warning/Void Note -->
            <div 
              v-if="(item.is_void || item.is_voided || item.status === 'voided') && item.void_reason" 
              class="mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-500 dark:text-rose-400 tracking-wide bg-rose-500/5 dark:bg-rose-500/10 px-2 py-1.5 rounded-lg border border-rose-500/10 w-full"
            >
              <i class="pi pi-info-circle text-[10px] shrink-0"></i>
              <span class="truncate">{{ item.void_reason }}</span>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <!-- Quantity -->
              <div>
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ $t('products.form.amount') }}</span>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded font-bold text-[12px]"
                  :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' ]"
                >
                  {{ item.quantity }}
                </span>
              </div>
              
              <!-- Total Cost -->
              <div class="text-right">
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ $t('common.all') }}</span>
                <div class="flex items-baseline justify-end gap-1">
                  <span 
                    class="text-[13px] font-black"
                    :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'text-slate-800 dark:text-slate-100' ]"
                  >
                    {{ Number(item.total_cost || 0).toLocaleString() }}
                  </span>
                  <span class="text-[9px] font-bold text-slate-400">UZS</span>
                </div>
              </div>

              <!-- Price Per Unit -->
              <div>
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('products.form.purchase_price') }}</span>
                <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">{{ Number(item.unit_cost || 0).toLocaleString() }} <span class="text-[9px] text-slate-400 font-medium">UZS</span></span>
              </div>

              <!-- Worker & Date -->
              <div class="text-right flex flex-col items-end justify-end">
                <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 justify-end">
                  <i class="pi pi-user text-[9px] text-slate-400"></i>
                  {{ item.worker_name }}
                </span>
                <span class="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 justify-end mt-0.5">
                  <i class="pi pi-calendar text-[9px] opacity-70"></i>
                  {{ item.created_on }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="item.description" class="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex gap-1.5">
              <i class="pi pi-align-left text-[10px] mt-0.5 opacity-70"></i>
              <span>{{ item.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 transition-transform hover:scale-110">
          <i class="pi pi-history text-slate-300 text-2xl"></i>
        </div>
        <h4 class="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-widest">{{ $t('warehouse.detail.no_incoming') }}</h4>
        <p class="text-[12px] text-slate-400 mt-2 max-w-[200px] leading-relaxed">{{ $t('common.no_results_desc') }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <TablePagination
      v-if="incomingTotal > incomingRows"
      :current-page="incomingPage + 1"
      :total-records="incomingTotal"
      :rows-per-page="incomingRows"
      @page-change="fetchIncoming($event.page)"
    />

    <!-- Void Confirmation Dialog -->
    <Dialog 
      v-model:visible="voidingDialogVisible"
      modal 
      class="!bg-white dark:!bg-slate-900 !rounded-[2rem] !border-none !shadow-2xl" 
      :showHeader="false"
      pt:mask:class="backdrop-blur-sm bg-slate-900/40 dark:bg-slate-950/60"
    >
      <div class="p-6 sm:p-8 flex flex-col gap-6 w-full max-w-md min-w-[340px] sm:min-w-[420px]">
        <!-- Header -->
        <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <i class="pi pi-ban text-sm"></i>
            </div>
            <div class="text-left">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ $t('warehouse.detail.void_title') }}</h3>
              <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest">{{ $t('common.confirm_title') }}</p>
            </div>
          </div>
          <button @click="voidingDialogVisible = false" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
            <i class="pi pi-times text-[12px]"></i>
          </button>
        </div>
        
        <!-- Info Alert -->
        <div class="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 text-left">
          <div class="text-amber-500 shrink-0">
            <i class="pi pi-exclamation-triangle text-sm mt-0.5"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-amber-700 dark:text-amber-400 leading-tight">{{ $t('warehouse.detail.void_confirm') }}</h4>
            <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {{ $t('warehouse.detail.void_warning_desc') }}
            </p>
          </div>
        </div>

        <!-- Reason Input -->
        <div class="field text-left">
          <label class="text-[12px] font-black tracking-widest text-slate-400 ml-1 mb-1.5 block">
            {{ $t('warehouse.detail.void_reason') }} <span class="text-rose-500">*</span>
          </label>
          <div class="custom-input-wrapper relative group/input flex items-start rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300">
            <Textarea
              v-model="voidingReason"
              rows="3"
              :placeholder="$t('warehouse.detail.void_reason_placeholder')"
              class="w-full h-full"
              pt:root:class="!bg-transparent !border-none !shadow-none !w-full"
              pt:textarea:class="!bg-transparent !border-none !shadow-none !text-[14px] !font-semibold !p-4 !px-4 !w-full !text-slate-700 dark:!text-slate-200 !outline-none !resize-none !min-h-[80px]"
            />
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex gap-3 w-full">
          <button 
            @click="voidingDialogVisible = false"
            class="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-black tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            @click="confirmVoid"
            :disabled="voidingLoading"
            class="flex-[2] py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-slate-900 text-[11px] font-black tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="voidingLoading" class="pi pi-spin pi-spinner text-xs"></i>
            <i v-else class="pi pi-check text-xs"></i>
            {{ voidingLoading ? $t('common.saving') : $t('warehouse.detail.void_btn') }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useBranchIncoming } from '../composables/useBranchIncoming'
import TablePagination from '@/components/TablePagination.vue'
import TurBadge from '@/components/common/TurBadge.vue'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'

const props = defineProps({
  branchId: { type: [Number, String], required: true }
})

const {
  incomingHistory, incomingTotal, incomingPage, incomingRows, loading, 
  fetchIncoming,
  
  // Void exports
  voidingReason, voidingLoading, voidingDialogVisible,
  openVoidDialog, confirmVoid
} = useBranchIncoming(props.branchId)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
.animate-loading {
  animation: loading 1.5s infinite ease-in-out;
}

/* Universal shaffoflik va hamma effektlarni (border, shadow, outline) o'chirish */
.custom-input-wrapper :deep(*),
.custom-input-wrapper :deep(*:hover),
.custom-input-wrapper :deep(*:focus),
.custom-input-wrapper :deep(*::before),
.custom-input-wrapper :deep(*::after) {
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.p-textarea) {
  font-family: inherit !important;
  width: 100% !important;
}
</style>
