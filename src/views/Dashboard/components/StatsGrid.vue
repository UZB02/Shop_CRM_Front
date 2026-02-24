<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card v-for="stat in stats" :key="stat.label" class="border-none shadow-sm">
      <template #content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold mt-1">{{ stat.value }}</h3>
            <p class="text-xs mt-2" :class="stat.trendUp ? 'text-emerald-500' : 'text-rose-500'">
              <i :class="stat.trendUp ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'"></i>
              {{ stat.trend }}
            </p>
          </div>
          <div :class="`p-3 rounded-xl ${stat.bg}`">
            <i :class="[stat.icon, stat.color, 'text-xl']"></i>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'

const props = defineProps({
  stats: Array
})
</script>
