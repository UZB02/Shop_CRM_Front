<template>
  <Card class="border-none shadow-sm">
    <template #title>Asosiy Do'konlar</template>
    <template #content>
      <DataTable :value="stores" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <template #empty>
          <div class="text-center p-4 text-slate-400">Do'konlar mavjud emas.</div>
        </template>
        <Column field="name" header="Nomi"></Column>
        <Column field="location" header="Manzil"></Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
          </template>
        </Column>
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
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Card from 'primevue/card'

const props = defineProps({
  stores: Array,
  loading: Boolean
})

defineEmits(['edit', 'delete'])

const getSeverity = (status) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Inactive': return 'danger';
    default: return null;
  }
}
</script>
