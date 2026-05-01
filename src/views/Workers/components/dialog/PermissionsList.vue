<template>
  <div class="flex flex-col min-h-0 overflow-hidden font-inter">
    <!-- Header: title + count + select-all -->
    <div class="flex items-center justify-between mb-4 px-1">
      <div class="flex items-center gap-2">
        <span class="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.permissions') }}</span>
        <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[12px] font-black">
          {{ selectedCount }}/{{ total }}
        </span>
      </div>
      <button
        class="text-[12px] font-black tracking-widest transition-all hover:opacity-80 active:scale-95"
        :class="allSelected ? 'text-rose-400' : 'text-emerald-500'"
        @click="$emit('toggle-all')"
      >
        {{ allSelected ? $t('workers.form.unselect_all') : $t('workers.form.select_all') }}
      </button>
    </div>

    <!-- Permissions list -->
    <div class="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar transition-all pr-1 min-h-[300px]">
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
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>


