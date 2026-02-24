<template>
  <Card class="border-none shadow-sm">
    <template #content>
      <DataTable :value="products" :loading="loading" paginator :rows="10" :totalRecords="totalRecords" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="name" header="Mahsulot">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" class="w-full h-full object-cover" />
                <i v-else class="pi pi-image text-xl text-slate-300"></i>
              </div>
              <div>
                <p class="font-medium text-slate-900">{{ slotProps.data.name }}</p>
                <p class="text-xs text-slate-400">{{ slotProps.data.category }}</p>
              </div>
            </div>
          </template>
        </Column>
        <Column field="barcode" header="Barcode"></Column>
        <Column field="amount" header="Mavjudlik">
          <template #body="slotProps">
            <div class="flex flex-col">
              <span :class="{'text-rose-500 font-bold': slotProps.data.amount < 10, 'text-slate-700': slotProps.data.amount >= 10}">
                {{ slotProps.data.amount }} {{ slotProps.data.unit }}
              </span>
              <ProgressBar :value="Math.min((slotProps.data.amount / 100) * 100, 100)" :showValue="false" class="h-1 w-16 mt-1" :severity="slotProps.data.amount < 10 ? 'danger' : 'success'" />
            </div>
          </template>
        </Column>
        <Column field="salePrice" header="Sotish Narxi">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.salePrice) }}
          </template>
        </Column>
        <Column header="Amallar" class="text-right">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
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
import ProgressBar from 'primevue/progressbar'
import Card from 'primevue/card'
import Button from 'primevue/button'

const props = defineProps({
  products: Array,
  loading: Boolean,
  totalRecords: Number
})

const emit = defineEmits(['edit', 'delete'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value)
}
</script>

<style scoped>
:deep(.p-progressbar-value) {
  transition: width 0.5s ease;
}
</style>
