<template>
  <Card class="border-none shadow-sm h-full">
    <template #title>Xaridlar Tarixi</template>
    <template #content>
      <DataTable :value="trades" paginator :rows="10" stripedRows responsiveLayout="scroll">
        <template #empty>
          <div class="text-center py-8 text-gray-500">
            Ushbu mijoz uchun xaridlar tarixi topilmadi.
          </div>
        </template>
        <Column field="tradeId" header="ID">
          <template #body="slotProps">
            <span class="font-mono font-medium text-emerald-600">{{ slotProps.data.tradeId }}</span>
          </template>
        </Column>
        <Column header="Sana">
          <template #body="slotProps">
            {{ formatDateTime(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column header="Mahsulotlar">
          <template #body="slotProps">
            <div class="flex flex-col gap-1">
              <span v-for="(item, index) in slotProps.data.products.slice(0, 2)" :key="index" class="text-sm">
                {{ item.quantity }}x {{ item.product?.name || item.productName }}
              </span>
              <span v-if="slotProps.data.products.length > 2" class="text-xs text-gray-400">
                + yana {{ slotProps.data.products.length - 2 }} ta
              </span>
            </div>
          </template>
        </Column>
        <Column header="Summa">
          <template #body="slotProps">
            <span class="font-bold">{{ formatCurrency(slotProps.data.total) }}</span>
          </template>
        </Column>
        <Column header="Holat">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Card from 'primevue/card'

const props = defineProps({
  trades: Array
})

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Yakunlangan': return 'success';
    case "Qisman to'langan": return 'warning';
    case "To'lanmagan": return 'danger';
    default: return 'info';
  }
}
</script>
