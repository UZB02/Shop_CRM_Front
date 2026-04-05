<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)" 
    modal 
    header="Muvaffaqiyatli savdo" 
    :style="{ width: '400px' }" 
    class="receipt-dialog"
    :closable="false"
  >
    <div class="flex flex-col items-center gap-6 py-4">
      <!-- Success Icon -->
      <div class="w-20 h-20 rounded-[32px] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
        <i class="pi pi-check-circle text-4xl animate-success-pop"></i>
      </div>

      <!-- Transaction Summary Card -->
      <div id="printable-receipt" class="w-full bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6">
        <div class="text-center font-outfit border-b border-dashed border-slate-200 dark:border-slate-700 pb-4">
          <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sirius CRM</h3>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ formatDate(transaction?.created_at) }}</p>
        </div>

        <div class="space-y-3">
          <div v-for="item in transaction?.items" :key="item.id" class="flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate">{{ item.product_name || 'Mahsulot' }}</p>
              <p class="text-[10px] text-slate-400 font-bold">{{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
            </div>
            <span class="text-[11px] font-black text-slate-800 dark:text-white shrink-0">
              {{ formatCurrency(item.quantity * item.price) }}
            </span>
          </div>
        </div>

        <div class="pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex justify-between text-[11px] font-bold">
            <span class="text-slate-400 uppercase">Oraliq jami:</span>
            <span class="text-slate-700 dark:text-slate-300">{{ formatCurrency(transaction?.total_price) }}</span>
          </div>
          <div v-if="transaction?.discount_amount > 0" class="flex justify-between text-[11px] font-bold">
            <span class="text-rose-400 uppercase">Chegirma:</span>
            <span class="text-rose-500">-{{ formatCurrency(transaction?.discount_amount) }}</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase font-outfit">Yakuniy:</span>
            <span class="text-xl font-black text-[#10b981] font-outfit">
              {{ formatCurrency(transaction?.paid_amount) }}
            </span>
          </div>
        </div>
        
        <div class="text-center p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50">
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">To'lov turi</p>
           <p class="text-xs font-black text-slate-700 dark:text-emerald-400 uppercase tracking-wider">{{ transaction?.payment_type }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3 w-full">
        <button 
          @click="$emit('download')"
          class="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
        >
          <i class="pi pi-download"></i>
          Chekni yuklash
        </button>
        <button 
          @click="$emit('print')"
          class="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
        >
          <i class="pi pi-print"></i>
          Chop etish
        </button>
        <button 
          @click="$emit('update:visible', false)"
          class="col-span-2 py-4 bg-[#10b981] text-white rounded-2xl text-[11px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:bg-[#059669] transition-all"
        >
          Yangi savdo boshlash
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

const props = defineProps({
  visible: Boolean,
  transaction: Object
})

defineEmits(['update:visible', 'print', 'download'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

const formatDate = (val) => {
  const d = val ? new Date(val) : new Date()
  return d.toLocaleString('uz-UZ')
}
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

@keyframes success-pop {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-success-pop {
  animation: success-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

:deep(.receipt-dialog) {
  border-radius: 40px !important;
  border: none;
  overflow: hidden;
  box-shadow: 0 50px 100px -20px rgb(0 0 0 / 0.25);
}

:deep(.receipt-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  background: white;
  font-family: 'Outfit', sans-serif;
  text-align: center;
}

:deep(.receipt-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
  background: white;
}

.dark :deep(.receipt-dialog .p-dialog-header),
.dark :deep(.receipt-dialog .p-dialog-content) {
  background: #0f172a;
}
</style>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-receipt, #printable-receipt * {
    visibility: visible;
  }
  #printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
