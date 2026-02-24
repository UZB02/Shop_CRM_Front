<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)" 
    modal 
    header="Sotuv Cheki" 
    :style="{ width: '350px' }" 
    :closable="false"
  >
    <div id="printable-receipt" class="p-4 bg-white text-slate-900 font-mono text-sm">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-emerald-600">Shop Searem</h2>
        <p class="text-[10px] text-slate-500">Professional CRM Tizimi</p>
        <div class="border-b border-dashed border-slate-300 my-4"></div>
        <p class="text-xs">Chek #: {{ transaction?.id }}</p>
        <p class="text-xs">{{ transaction?.date }}</p>
      </div>

      <div class="space-y-2 mb-6">
        <div v-for="item in transaction?.items" :key="item.id" class="flex justify-between gap-4">
          <span class="flex-1 truncate">{{ item.name }}</span>
          <span class="whitespace-nowrap">{{ item.qty }} x {{ formatCurrency(item.price) }}</span>
        </div>
      </div>

      <div class="border-t border-dashed border-slate-300 pt-4 space-y-2">
        <div class="flex justify-between">
          <span>Mijoz:</span>
          <span class="font-bold">{{ transaction?.customer }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold">
          <span>Umumiy:</span>
          <span>{{ formatCurrency(transaction?.total || 0) }}</span>
        </div>
      </div>

      <div class="text-center mt-8 text-[10px] text-slate-400">
        Xaridingiz uchun rahmat!<br>
        www.shopsearem.uz
      </div>
    </div>
    
    <template #footer>
      <div class="flex gap-2 w-full">
        <Button label="Yopish" severity="secondary" @click="$emit('close')" class="flex-1" />
        <Button label="Chop etish" icon="pi pi-print" @click="$emit('print')" class="flex-1" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: Boolean,
  transaction: Object
})

defineEmits(['update:visible', 'close', 'print'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>

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
