<template>
  <Card class="border-none shadow-sm hover:ring-1 hover:ring-emerald-500 transition-all cursor-pointer group relative">
    <template #title>
      <div class="flex justify-between items-center">
        <span class="truncate pr-8">{{ warehouse.name }}</span>
        <Tag :value="warehouse.status === 'Active' ? 'Faol' : 'NoFaol'" :severity="warehouse.status === 'Active' ? 'success' : 'secondary'" />
        
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button icon="pi pi-pencil" text rounded severity="info" size="small" @click.stop="$emit('edit', warehouse)" />
          <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click.stop="$emit('delete', warehouse)" />
        </div>
      </div>
    </template>
    <template #content>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between text-slate-500">
          <span>Jihozlanganlik:</span>
          <span class="text-slate-900 font-medium">{{ warehouse.occupancy || 0 }}%</span>
        </div>
        <ProgressBar :value="warehouse.occupancy || 0" :showValue="false" class="h-2" />
        <div class="flex justify-between mt-4">
          <span>Mahsulot turlari:</span>
          <span class="font-semibold">{{ warehouse.productTypes || 0 }} ta</span>
        </div>
        <div v-if="warehouse.store" class="text-xs text-slate-400 mt-2 italic">
          <i class="pi pi-map-pin mr-1"></i> {{ warehouse.store.name }}
        </div>
      </div>
      <Button label="omborga kirish" icon="pi pi-arrow-right" iconPos="right" text class="w-full mt-4" />
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'

const props = defineProps({
  warehouse: Object
})

defineEmits(['edit', 'delete'])
</script>
