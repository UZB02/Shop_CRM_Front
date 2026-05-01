<template>
  <div class="space-y-3">
    <!-- Desktop View -->
    <KpiTableDesktop 
      :data="data" 
      :fullList="fullList" 
      :loading="loading" 
      @open-target="$emit('open-target', $event)" 
    />

    <!-- Mobile View -->
    <KpiTableMobile 
      :data="data" 
      :fullList="fullList" 
      :loading="loading" 
      @open-target="$emit('open-target', $event)" 
    />
  </div>
</template>

<script setup>
import KpiTableDesktop from './KpiTableDesktop.vue'
import KpiTableMobile from './KpiTableMobile.vue'

defineProps({
  data: Array,
  fullList: Array,
  loading: Boolean
})

defineEmits(['open-target'])
</script>

