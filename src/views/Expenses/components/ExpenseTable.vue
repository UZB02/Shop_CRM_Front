<template>
  <Card class="border-none shadow-sm overflow-hidden">
    <template #content>
      <DataTable 
        :value="expenses" 
        :loading="loading"
        paginator 
        :rows="10" 
        dataKey="_id"
        responsiveLayout="stack" 
        breakpoint="960px"
        class="p-datatable-sm"
        v-model:filters="filters"
        :globalFilterFields="['name', 'category', 'description', 'seller']"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} - {last} / {totalRecords}"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 justify-between items-center px-2">
            <span class="text-xl font-bold text-slate-800 dark:text-slate-100">Xarajatlar Ro'yxati</span>
            <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Qidiruv..." class="w-full md:w-auto" />
            </IconField>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center p-8 text-slate-500">
            <i class="pi pi-folder-open text-4xl mb-4"></i>
            <p>Xarajatlar topilmadi</p>
          </div>
        </template>

        <Column field="date" header="Sana" sortable class="w-32">
          <template #body="slotProps">
            <div class="flex items-center gap-2 text-slate-600">
              <i class="pi pi-calendar text-slate-400"></i>
              <span>{{ formatDate(slotProps.data.date) }}</span>
            </div>
          </template>
        </Column>

        <Column field="name" header="Nomi" sortable>
          <template #body="slotProps">
            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column field="category" header="Kategoriya" sortable>
          <template #body="slotProps">
            <Tag :value="slotProps.data.category" :severity="getCategorySeverity(slotProps.data.category)" class="px-3" />
          </template>
        </Column>

        <Column field="amount" header="Summa" sortable>
          <template #body="slotProps">
            <span class="font-bold text-rose-600">{{ formatCurrency(slotProps.data.amount) }}</span>
          </template>
        </Column>

        <Column field="seller" header="Mas'ul" sortable></Column>

        <Column header="Amallar" class="w-24 text-right" :exportable="false">
          <template #body="slotProps">
            <div class="flex justify-end gap-1">
              <Button icon="pi pi-pencil" text rounded severity="info" v-tooltip.top="'Tahrirlash'" @click="$emit('edit', slotProps.data)" />
              <Button icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'O\'chirish'" @click="$emit('delete', slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const props = defineProps({
  expenses: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete'])

const filters = ref({
    global: { value: null, matchMode: 'contains' }
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { 
    style: 'currency', 
    currency: 'UZS', 
    maximumFractionDigits: 0 
  }).format(val || 0)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('uz-UZ')
}

const getCategorySeverity = (category) => {
  switch (category) {
    case 'Ijara': return 'danger';
    case 'Kommunal': return 'info';
    case 'Soliq': return 'warning';
    case 'Maosh': return 'success';
    case 'Transport': return 'help';
    case 'Marketing': return 'primary';
    default: return 'secondary';
  }
}
</script>

<style scoped>
:deep(.p-datatable-header) {
  background: transparent;
  padding: 1rem 0;
  border: none;
}
</style>
