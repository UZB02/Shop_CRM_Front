<template>
  <Card class="border-none shadow-sm">
    <template #title>
      <div class="flex justify-between items-center">
        <span>Filiallar</span>
        <Button label="Filial qo'shish" icon="pi pi-plus" text size="small" @click="$emit('add')" />
      </div>
    </template>
    <template #content>
      <DataTable :value="branches" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <template #empty>
          <div class="text-center p-4 text-slate-400">Filiallar mavjud emas.</div>
        </template>
        <Column field="name" header="Filial"></Column>
        <Column field="parentStoreName" header="Asosiy Do'kon"></Column>
        <Column field="location" header="Manzil"></Column>
        <Column header="Amallar">
          <template #body="slotProps">
            <div class="flex gap-2">
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
  branches: Array,
  loading: Boolean
})

defineEmits(['edit', 'delete', 'add'])
</script>
