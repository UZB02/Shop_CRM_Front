<template>
  <div class="space-y-6">
    <!-- Header with Action -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <i class="pi pi-sync text-emerald-500 text-sm"></i>
        </div>
        <div>
          <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">O'tkazmalar (Transfers)</h3>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Joylar orasida mahsulot harakati</p>
        </div>
      </div>
      <button 
        @click="openNewTransferAction"
        class="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <i class="pi pi-plus text-[10px]"></i>
        O'tkazma yaratish
      </button>
    </div>

    <!-- Status Filters -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      <button 
        v-for="status in statusOptions" :key="status.id"
        @click="activeStatus = status.id"
        class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
        :class="activeStatus === status.id 
          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
          : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'"
      >
        {{ status.label }}
        <span v-if="status.count" class="ml-2 px-1.5 py-0.5 rounded-md bg-white/20 text-[9px]">{{ status.count }}</span>
      </button>
    </div>

    <!-- Transfer List -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] relative">
      <div v-if="loading" class="absolute inset-0 z-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
        <i class="pi pi-spin pi-spinner text-emerald-500 text-2xl"></i>
      </div>

      <div v-if="!filteredTransfers.length && !loading" class="flex flex-col items-center justify-center py-20 opacity-40">
        <div class="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
          <i class="pi pi-sync text-2xl text-slate-300"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-widest">O'tkazmalar topilmadi</p>
      </div>

      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Sana</th>
              <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Qayerdan</th>
              <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Qayerga</th>
              <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">Mahsulotlar</th>
              <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">Holati</th>
              <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="t in filteredTransfers" :key="t.id" class="group hover:bg-emerald-500/[0.02] transition-colors">
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 tracking-tight">{{ formatDate(t.created_at) }}</span>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: #{{ t.id }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" 
                    :class="t.from_branch ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'"
                  >
                    <i class="pi" :class="t.from_branch ? 'pi-building' : 'pi-box'"></i>
                  </div>
                  <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{{ t.from_branch_name || t.from_warehouse_name }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" 
                    :class="t.to_branch ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'"
                  >
                    <i class="pi" :class="t.to_branch ? 'pi-building' : 'pi-box'"></i>
                  </div>
                  <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{{ t.to_branch_name || t.to_warehouse_name }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{{ t.total_items || (t.items?.length || 0) }} dona</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex justify-center">
                  <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                    :class="statusClass(t.status)"
                  >
                    <div class="w-1 h-1 rounded-full bg-current" :class="t.status === 'pending' ? 'animate-pulse' : ''"></div>
                    {{ t.status }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="viewDetail(t)"
                    class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-all flex items-center justify-center"
                    v-tooltip.top="'Batafsil'"
                  >
                    <i class="pi pi-eye text-[10px]"></i>
                  </button>
                  <template v-if="t.status === 'pending'">
                    <button 
                      @click="confirmAction(t)"
                      class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10 active:scale-95"
                    >
                      Tasdiqlash
                    </button>
                    <button 
                      @click="cancelAction(t)"
                      class="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md shadow-rose-500/10 active:scale-95"
                    >
                      Bekor qilish
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Dialog -->
    <Dialog 
      v-model:visible="detailDialog" 
      modal 
      header=" "
      :showHeader="false"
      class="!bg-white dark:!bg-slate-900 !rounded-[2.5rem] !border-none !shadow-2xl overflow-hidden" 
      style="width: 100%; max-width: 600px;"
      pt:mask:class="backdrop-blur-sm bg-black/40"
    >
      <div v-if="selectedTransfer" class="flex flex-col bg-white dark:bg-slate-900">
        <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">O'tkazma Tafsiloti</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: #{{ selectedTransfer.id }} | {{ formatDate(selectedTransfer.created_at) }}</p>
          </div>
          <button @click="detailDialog = false" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>

        <div class="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
          <!-- Flow Visualization -->
          <div class="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <div class="text-center flex flex-col items-center gap-2">
              <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <i class="pi" :class="selectedTransfer.from_branch ? 'pi-building text-amber-500' : 'pi-box text-emerald-500'"></i>
              </div>
              <span class="text-[9px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">{{ selectedTransfer.from_branch_name || selectedTransfer.from_warehouse_name }}</span>
            </div>
            
            <div class="flex-grow flex flex-col items-center gap-1 mx-4">
              <div class="relative w-full h-px bg-slate-200 dark:bg-slate-700">
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-slate-300 dark:border-slate-600 rotate-45"></div>
              </div>
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ selectedTransfer.status }}</span>
            </div>

            <div class="text-center flex flex-col items-center gap-2">
              <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <i class="pi" :class="selectedTransfer.to_branch ? 'pi-building text-amber-500' : 'pi-box text-emerald-500'"></i>
              </div>
              <span class="text-[9px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">{{ selectedTransfer.to_branch_name || selectedTransfer.to_warehouse_name }}</span>
            </div>
          </div>

          <!-- Items Table -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mahsulotlar Ro'yxati</h4>
            <div class="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
               <table class="w-full text-left border-collapse">
                 <thead class="bg-slate-50 dark:bg-slate-800/50">
                   <tr>
                     <th class="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-slate-400">Mahsulot</th>
                     <th class="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Miqdor</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50 text-[10px]">
                   <tr v-for="item in selectedTransfer.items" :key="item.id" class="dark:bg-slate-900/40">
                     <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">{{ item.product_name }} <span class="block text-[8px] text-slate-400">{{ item.barcode }}</span></td>
                     <td class="px-4 py-3 font-black text-emerald-500 text-center">{{ item.quantity }}</td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </div>

          <!-- Note -->
          <div v-if="selectedTransfer.note" class="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <h5 class="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">Izoh</h5>
            <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400">{{ selectedTransfer.note }}</p>
          </div>
        </div>

        <!-- Footer Actions if pending -->
        <div v-if="selectedTransfer.status === 'pending'" class="p-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button 
            @click="cancelAction(selectedTransfer); detailDialog = false"
            class="flex-1 py-3 rounded-xl bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-rose-500/10"
          >
            Bekor qilish
          </button>
          <button 
            @click="confirmAction(selectedTransfer); detailDialog = false"
            class="flex-[2] py-3 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </Dialog>

    <!-- New Transfer Dialog -->
    <TransferNewDialog 
      v-model="transferDialog"
      :form="transferForm"
      :sub-loading="subLoading"
      :branches="branches"
      :warehouses="warehouses"
      :available-products="availableProducts"
      :source-name="sourceName"
      :source-id="sourceId"
      :source-type="sourceType"
      @submit="handleCreateTransfer"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransfers } from '@/composables/useTransfers'
import TransferNewDialog from './TransferNewDialog.vue'
import Dialog from 'primevue/dialog'

const props = defineProps({
  sourceId: [Number, String],
  sourceType: String, // 'branch' or 'warehouse'
  sourceName: String,
  availableProducts: Array
})

const {
  transfers, loading, subLoading,
  transferDialog, transferForm,
  warehouses, branches,
  fetchTransfers, createTransfer, confirmTransfer, cancelTransfer, openNewTransfer
} = useTransfers()

const activeStatus = ref('all')
const detailDialog = ref(false)
const selectedTransfer = ref(null)

const statusOptions = [
  { id: 'all', label: 'Barchasi' },
  { id: 'pending', label: 'Kutilmoqda' },
  { id: 'confirmed', label: 'Tasdiqlangan' },
  { id: 'cancelled', label: 'Bekor qilingan' }
]

const filteredTransfers = computed(() => {
  let list = transfers.value
  
  // Filter by source location if sourceId is provided
  // We want to see transfers WHERE this location is EITHER Source OR Destination
  if (props.sourceId) {
    const sid = String(props.sourceId)
    list = list.filter(t => {
        if (props.sourceType === 'branch') {
            return String(t.from_branch) === sid || String(t.to_branch) === sid
        } else {
            return String(t.from_warehouse) === sid || String(t.to_warehouse) === sid
        }
    })
  }

  if (activeStatus.value !== 'all') {
    list = list.filter(t => t.status === activeStatus.value)
  }
  
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const openNewTransferAction = () => {
    openNewTransfer({ id: props.sourceId, type: props.sourceType })
}

const handleCreateTransfer = async () => {
    const success = await createTransfer()
    if (success) {
        fetchTransfers()
    }
}

const confirmAction = async (t) => {
    const success = await confirmTransfer(t.id)
    if (success) {
        fetchTransfers()
    }
}

const cancelAction = async (t) => {
    const success = await cancelTransfer(t.id)
    if (success) {
        fetchTransfers()
    }
}

const viewDetail = (t) => {
    selectedTransfer.value = t
    detailDialog.value = true
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('uz-UZ', { 
        year: 'numeric', month: 'short', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    })
  } catch (e) {
    return dateStr
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-500/10 text-amber-600'
    case 'confirmed': return 'bg-emerald-500/10 text-emerald-600'
    case 'cancelled': return 'bg-rose-500/10 text-rose-600'
    default: return 'bg-slate-500/10 text-slate-600'
  }
}

onMounted(() => {
  fetchTransfers()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
