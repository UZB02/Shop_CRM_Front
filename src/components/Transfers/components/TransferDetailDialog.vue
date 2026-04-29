<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :showHeader="false"
    style="width: 100%; max-width: 520px;"
    pt:root:class="!rounded-2xl !border-none !shadow-2xl overflow-hidden"
    pt:mask:class="backdrop-blur-sm bg-black/40"
  >
    <div v-if="transfer" class="flex flex-col">

      <!-- Dialog Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base font-bold text-slate-800 dark:text-slate-100">{{ $t('transfers.title') }} #{{ transfer.id }}</span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="statusClass(transfer.status)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"
                :class="transfer.status === 'pending' ? 'animate-pulse' : ''"></span>
              {{ $t('transfers.status.' + transfer.status) }}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">{{ transfer.created_on }}</p>
        </div>
        <button
          @click="$emit('update:visible', false)"
          class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <div class="p-6 space-y-5 max-h-[65vh] overflow-y-auto no-scrollbar">

        <!-- From → To flow -->
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
          <div class="flex-1 flex flex-col items-center gap-1.5 text-center">
            <div class="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <i class="pi text-sm"
                :class="[
                  locationIcon(transfer.from_location_type),
                  transfer.from_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500'
                ]"
              ></i>
            </div>
            <div>
              <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ transfer.from_location_name }}</div>
              <div class="text-[10px] text-slate-400 capitalize">{{ transfer.from_location_type }}</div>
            </div>
          </div>

          <div class="flex flex-col items-center gap-1 shrink-0">
            <div class="flex items-center gap-1">
              <div class="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
              <i class="pi pi-arrow-right text-[10px] text-slate-400"></i>
              <div class="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
            </div>
          </div>

          <div class="flex-1 flex flex-col items-center gap-1.5 text-center">
            <div class="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <i class="pi text-sm"
                :class="[
                  locationIcon(transfer.to_location_type),
                  transfer.to_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500'
                ]"
              ></i>
            </div>
            <div>
              <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ transfer.to_location_name }}</div>
              <div class="text-[10px] text-slate-400 capitalize">{{ transfer.to_location_type }}</div>
            </div>
          </div>
        </div>

        <!-- Items list -->
        <div>
          <h4 class="text-xs font-semibold text-slate-400 tracking-wide mb-2">
            {{ $t('warehouse.detail.products') }} ({{ transfer.items?.length ?? transfer.item_count ?? 0 }})
          </h4>
          <div class="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-400">{{ $t('products.table.product') }}</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold text-slate-400">{{ $t('products.form.amount') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr
                  v-for="item in transfer.items"
                  :key="item.product_id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td class="px-4 py-2.5">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-slate-700 dark:text-slate-200">{{ item.product_name }}</span>
                      <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                    </div>
                    <span v-if="item.product_unit" class="ml-1.5 text-xs text-slate-400">{{ item.product_unit }}</span>
                  </td>
                  <td class="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {{ item.quantity }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Meta info row -->
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div v-if="transfer.worker_name"
            class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
          >
            <div class="text-xs text-slate-400 mb-0.5">{{ $t('transfers.col_worker') }}</div>
            <div class="font-medium text-slate-700 dark:text-slate-200">{{ transfer.worker_name }}</div>
          </div>
          <div v-if="transfer.confirmed_at"
            class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20"
          >
            <div class="text-xs text-emerald-600 dark:text-emerald-400 mb-0.5">{{ $t('transfers.status.confirmed') }}</div>
            <div class="font-medium text-slate-700 dark:text-slate-200">{{ transfer.confirmed_at }}</div>
          </div>
        </div>

        <!-- Note -->
        <div v-if="transfer.note"
          class="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20"
        >
          <i class="pi pi-info-circle text-amber-500 mt-0.5 shrink-0"></i>
          <p class="text-sm text-slate-600 dark:text-slate-300">{{ transfer.note }}</p>
        </div>
      </div>

      <!-- Footer actions -->
      <div v-if="transfer.status === 'pending'"
        class="flex items-center gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
      >
        <button
          @click="$emit('cancel', transfer)"
          class="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30 text-sm font-medium transition-all"
        >
          {{ $t('transfers.cancel_btn') }}
        </button>
        <button
          v-if="transfer.direction === 'in'"
          @click="$emit('confirm', transfer)"
          class="flex-[2] h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all"
        >
          {{ $t('transfers.confirm_btn') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import TurBadge from '@/components/common/TurBadge.vue'

defineProps({
  visible: Boolean,
  transfer: Object
});

defineEmits(['update:visible', 'confirm', 'cancel']);

const locationIcon = (locationType) => {
  return locationType === 'branch' ? 'pi-building' : 'pi-box';
}

const statusClass = (status) => {
  switch (status) {
    case 'pending':   return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'confirmed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    case 'cancelled': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    default:          return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
