<template>
  <div class="space-y-6">
    <!-- Tabs Navigation -->
    <div class="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar shadow-sm">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-black tracking-widest transition-all duration-300 whitespace-nowrap flex items-center gap-2"
        :class="activeTab === tab.id 
          ? (tab.id === 'permissions' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : (tab.id === 'history' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'))
          : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'"
      >
        <i :class="['pi', tab.icon, 'text-xs']"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tabs-content min-h-[300px]">
      <Transition name="fade-slide" mode="out-in">
        <WorkerInfoTab v-if="activeTab === 'details'" key="details" :worker="worker" />
        <WorkerPermissionsTab v-else-if="activeTab === 'permissions'" key="permissions" :worker="worker" />
        <WorkerHistoryTab v-else-if="activeTab === 'history'" key="history" :worker-id="worker?.id || worker?._id" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Tabs Components
import WorkerInfoTab from './tabs/WorkerInfoTab.vue'
import WorkerPermissionsTab from './tabs/WorkerPermissionsTab.vue'
import WorkerHistoryTab from './tabs/WorkerHistoryTab.vue'

const props = defineProps({
  worker: Object
})

const { t } = useI18n()
const activeTab = ref('details')

const tabs = computed(() => [
  { id: 'details', label: t('workers.details'), icon: 'pi-id-card' },
  { id: 'permissions', label: t('workers.permissions'), icon: 'pi-shield' },
  { id: 'history', label: t('workers.logs') || 'Tizim Jurnali', icon: 'pi-history' }
])
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


