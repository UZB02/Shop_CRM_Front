<template>
  <Card class="border-none shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
    <template #content>
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <p class="text-emerald-100 font-medium mb-1">Joriy Tarif</p>
          <h2 class="text-3xl font-bold uppercase tracking-wide">{{ subscription.plan }}</h2>
          <div class="mt-4 flex items-center gap-2 text-emerald-50" v-if="subscription.endDate">
            <i class="pi pi-calendar"></i>
            <span>Tugash muddati: {{ formatDate(subscription.endDate) }}</span>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
           <Tag :value="getStatusLabel(subscription.status)" :severity="getStatusSeverity(subscription.status)" class="text-lg px-4 py-2" />
           <p v-if="daysLeft !== null" class="text-sm font-medium" :class="{'text-rose-200': daysLeft < 3}">
              {{ daysLeft }} kun qoldi
           </p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import { computed } from 'vue'

const props = defineProps({
  subscription: Object
})

const daysLeft = computed(() => {
    if (!props.subscription.endDate) return null;
    const now = new Date();
    const end = new Date(props.subscription.endDate);
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
})

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

const getStatusLabel = (status) => {
    switch(status) {
        case 'active': return 'Faol';
        case 'warning': return 'Tugamoqda';
        case 'blocked': return 'Bloklangan';
        default: return status;
    }
}

const getStatusSeverity = (status) => {
    switch(status) {
        case 'active': return 'success';
        case 'warning': return 'warning';
        case 'blocked': return 'danger';
        default: return 'info';
    }
}
</script>
