<template>
  <Card class="border-none shadow-sm">
    <template #content>
      <DataTable :value="customers" :loading="loading" paginator :rows="10" responsiveLayout="scroll" class="p-datatable-sm">
        <template #empty>
          <div class="flex flex-col items-center justify-center p-8 text-slate-400">
            <i class="pi pi-users text-4xl mb-3"></i>
            <p>Mijozlar topilmadi.</p>
          </div>
        </template>
        <Column field="name" header="Mijoz Ismi">
          <template #body="slotProps">
            <span class="font-medium text-slate-900">{{ slotProps.data.name }}</span>
          </template>
        </Column>
        <Column field="phone" header="Telefon">
          <template #body="slotProps">
            <span class="text-slate-600">{{ slotProps.data.phone }}</span>
          </template>
        </Column>
        <Column field="branch" header="Biriktirilgan Filial">
          <template #body="slotProps">
            <span class="text-slate-500 text-sm">{{ slotProps.data.branch || '-' }}</span>
          </template>
        </Column>
        <Column field="tradesCount" header="Savdolar soni"></Column>
        <Column field="totalSpent" header="Umumiy xarid">
          <template #body="slotProps">
            <span class="font-bold text-emerald-600">{{ formatCurrency(slotProps.data.totalSpent) }}</span>
          </template>
        </Column>
        <Column header="Amallar" class="text-right">
          <template #body="slotProps">
            <div class="flex gap-1 justify-end">
              <Button icon="pi pi-history" text rounded v-tooltip.top="'Xaridlar tarixi'" @click="$emit('view-history', slotProps.data._id)" />
              <Button icon="pi pi-pencil" text rounded severity="info" @click="$emit('edit', slotProps.data)" />
              <Button icon="pi pi-trash" text rounded severity="danger" @click="$emit('delete', slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'

const props = defineProps({
  customers: Array,
  loading: Boolean
})

const emit = defineEmits(['edit', 'delete', 'view-history'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>
