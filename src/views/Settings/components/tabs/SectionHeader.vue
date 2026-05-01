<template>
  <div class="section-header">
    <i :class="['pi', icon, 'text-sm', color]"></i>
    <span><slot /></span>
  </div>
</template>

<script setup>
defineProps({
  icon:  { type: String, default: 'pi-cog' },
  color: { type: String, default: 'text-slate-500' }
})
</script>




