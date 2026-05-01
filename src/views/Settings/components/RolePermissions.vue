<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Role Selection -->
    <Card class="border-none shadow-sm h-full">
      <template #title>Rollar va Huquqlar</template>
      <template #content>
        <div class="space-y-4">
          <div v-for="role in roles" :key="role.key" 
               @click="$emit('update:selectedRole', role.key)"
               class="p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between"
               :class="selectedRole === role.key ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'">
            <span class="font-medium">{{ role.label }}</span>
            <i class="pi pi-chevron-right text-xs" :class="selectedRole === role.key ? 'text-emerald-500' : 'text-slate-400'"></i>
          </div>
        </div>
      </template>
    </Card>

    <!-- Permissions Management -->
    <Card class="lg:col-span-2 border-none shadow-sm h-full">
      <template #title>
        <span class="text-emerald-500 capitalize">{{ selectedRole }}</span> roli uchun ruxsatlar
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="section in allSections" :key="section.key" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Checkbox :modelValue="permissions" @update:modelValue="$emit('update:permissions', $event)" :value="section.key" :id="section.key" :disabled="selectedRole === 'superadmin'" />
            <label :for="section.key" class="text-sm font-medium cursor-pointer flex-1">
              <i :class="[section.icon, 'mr-2 text-slate-400']"></i>
              {{ section.label }}
            </label>
          </div>
        </div>
        
        <div v-if="selectedRole === 'superadmin'" class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl text-sm border border-amber-100 dark:border-amber-800">
          <i class="pi pi-info-circle mr-2"></i> Superadmin barcha bo'limlarga cheksiz ruxsatga ega va uni o'zgartirib bo'lmaydi.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'

const props = defineProps({
  roles: Array,
  allSections: Array,
  selectedRole: String,
  permissions: Array
})

defineEmits(['update:selectedRole', 'update:permissions'])
</script>


