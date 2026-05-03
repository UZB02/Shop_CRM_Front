<template>
  <div class="flex flex-col gap-2">
    <button 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="$emit('update:modelValue', tab.id)"
      class="tab-btn group"
      :class="{ 'is-active': modelValue === tab.id }"
    >
      <div 
        class="icon-wrap"
        :class="modelValue === tab.id ? 'active-icon' : 'inactive-icon'"
      >
        <i :class="['pi', tab.icon, 'text-sm']"></i>
      </div>
      <div class="flex-1">
        <p class="label-text" :class="modelValue === tab.id ? 'active-text' : 'inactive-text'">
          {{ tab.label }}
        </p>
        <p class="desc-text" :class="modelValue === tab.id ? 'active-desc' : 'inactive-desc'">
          {{ tab.desc }}
        </p>
      </div>
      <i v-if="modelValue === tab.id" class="pi pi-chevron-right text-[10px] text-indigo-500"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  tabs: Array
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem; /* Standardized to rounded-xl */
  border: 1px solid transparent;
  background-color: transparent;
  text-align: left;
  width: 100%;
  transition: all 0.3s;
  cursor: pointer;
}
.tab-btn.is-active {
  background-color: white;
  border-color: #f1f5f9;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .tab-btn.is-active {
  background-color: #0f172a;
  border-color: #1e293b;
}
.tab-btn:hover:not(.is-active) {
  background-color: rgba(248, 250, 252, 0.8);
}
.dark .tab-btn:hover:not(.is-active) {
  background-color: rgba(30, 41, 59, 0.3);
}

.icon-wrap {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.active-icon {
  background-color: #6366f1;
  color: white;
}
.inactive-icon {
  background-color: #f1f5f9;
  color: #94a3b8;
}
.dark .inactive-icon {
  background-color: #1e293b;
}
.tab-btn:hover .inactive-icon {
  color: #6366f1;
}

.label-text {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.01em;
}
.active-text { color: #0f172a; }
.dark .active-text { color: white; }
.inactive-text { color: #64748b; }

.desc-text {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.125rem;
}
.active-desc { color: #94a3b8; }
.inactive-desc { color: #cbd5e1; }
.dark .inactive-desc { color: #334155; }
</style>
