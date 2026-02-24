<template>
  <Card class="border-none shadow-sm h-full">
    <template #title>Oxirgi Amallar</template>
    <template #content>
      <div v-if="loading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-slate-400"></i>
      </div>
      <div v-else class="space-y-4">
        <div v-for="act in activity" :key="act.id" class="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
          <div class="p-2 rounded-lg bg-slate-50 text-slate-500">
            <i :class="act.icon"></i>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ act.title }}</p>
            <p class="text-xs text-slate-400">{{ formatTime(act.time) }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'

const props = defineProps({
  activity: Array,
  loading: Boolean
})

const formatTime = (date) => {
  const now = new Date()
  const activityDate = new Date(date)
  const diffMs = now - activityDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} daqiqa oldin`
  if (diffHours < 24) return `${diffHours} soat oldin`
  if (diffDays === 0) return 'Bugun'
  if (diffDays === 1) return 'Kecha'
  return activityDate.toLocaleDateString('uz-UZ')
}
</script>
