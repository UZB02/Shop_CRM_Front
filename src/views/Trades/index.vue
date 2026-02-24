<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Savdolar</h1>
      <Button label="Yangi savdo" icon="pi pi-cart-plus" severity="success" />
    </div>

    <!-- Trade Table Component -->
    <TradeTable :trades="trades" @view="viewTrade" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import TradeTable from './components/TradeTable.vue'

const trades = ref([
  { id: 'TR-1001', date: '2026-02-07 14:30', customer: 'Olim G\'aniyev', total: 12500000, paid: 12500000, status: 'Yakunlangan' },
  { id: 'TR-1002', date: '2026-02-07 15:45', customer: 'Mijoz #241', total: 450000, paid: 450000, status: 'Yakunlangan' },
  { id: 'TR-1003', date: '2026-02-07 16:20', customer: 'Azizbek Karimov', total: 8900000, paid: 5000000, status: 'Qisman to\'langan' },
])

const viewTrade = (data) => {
    console.log('View trade:', data)
}
</script>
