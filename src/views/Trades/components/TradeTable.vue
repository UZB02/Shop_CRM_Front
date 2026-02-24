<template>
  <Card class="border-none shadow-sm">
    <template #content>
      <DataTable :value="trades" paginator :rows="10" responsiveLayout="scroll" class="p-datatable-sm">
        <template #empty>
          <div class="text-center p-4 text-slate-400">Savdolar mavjud emas.</div>
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="date" header="Sana"></Column>
        <Column field="customer" header="Mijoz"></Column>
        <Column field="total" header="Umumiy summa">
          <template #body="slotProps">
            <span class="font-bold">{{ formatCurrency(slotProps.data.total) }}</span>
          </template>
        </Column>
        <Column field="paid" header="To'landi">
          <template #body="slotProps">
            <span class="text-emerald-500">{{ formatCurrency(slotProps.data.paid) }}</span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </Column>
        <Column header="Amallar" class="text-right">
          <template #body="slotProps">
            <Button icon="pi pi-eye" text rounded @click="$emit('view', slotProps.data)" />
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
import Button from 'primevue/button'
import Card from 'primevue/card'

const props = defineProps({
  trades: Array
})

defineEmits(['view'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Yakunlangan': return 'success';
        case "Qisman to'langan": return 'warning';
        case "To'lanmagan": return 'danger';
        default: return 'info';
    }
}
</script>
