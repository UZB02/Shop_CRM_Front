<template>
  <div class="mt-6 flex flex-col min-h-0">
    <!-- Header: sarlavha + count + select-all -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ruxsatlar</span>
        <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] font-black">
          {{ selectedCount }}/{{ total }}
        </span>
      </div>
      <button
        class="text-[9px] font-black uppercase tracking-widest transition-colors"
        :class="allSelected ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'"
        @click="$emit('toggle-all')"
      >
        {{ allSelected ? 'Hammasini olib tashlash' : 'Hammasini tanlash' }}
      </button>
    </div>

    <!-- Permissions list -->
    <div class="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar-thin pr-1">
      <PermissionItem
        v-for="perm in permissionsList"
        :key="perm.value"
        :perm="perm"
        :active="selectedPermissions.includes(perm.value)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import PermissionItem from './PermissionItem.vue'
import { PERMISSIONS_LIST as permissionsList } from '../../composables/useWorkerForm.js'

const props = defineProps({
  selectedPermissions: { type: Array,   default: () => [] },
  allSelected:         { type: Boolean, default: false },
  selectedCount:       { type: Number,  default: 0 },
})

const total = permissionsList.length

defineEmits(['toggle', 'toggle-all'])
</script>

<style scoped>
.custom-scrollbar-thin::-webkit-scrollbar { width: 3px; }
.custom-scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar-thin::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
