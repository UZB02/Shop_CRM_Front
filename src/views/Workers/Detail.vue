<template>
  <div class="space-y-4">
    <!-- Header -->
    <WorkerDetailPageHeader
      :worker="worker"
      @edit="handleEdit"
    />

    <!-- Main layout -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-48"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="worker" class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Sidebar Tabs -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <WorkerTabsSidebar
          :tabs="navTabs"
          :active="activeTab"
          @select="activeTab = $event"
        />
      </div>

      <!-- Right: Tab Content -->
      <div class="flex-1 min-w-0">
        <Transition name="fade-slide" mode="out-in">
          <WorkerInfoTab v-if="activeTab === 'details'" key="details" :worker="worker" />
          <WorkerPermissionsTab v-else-if="activeTab === 'permissions'" key="permissions" :worker="worker" />
          <WorkerKpiTab v-else-if="activeTab === 'kpi'" key="kpi" :worker-id="worker?.id || worker?._id" />
          <WorkerHistoryTab v-else-if="activeTab === 'history'" key="history" :worker-id="worker?.id || worker?._id" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { workersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

import WorkerDetailPageHeader from './components/WorkerDetailPageHeader.vue'
import WorkerTabsSidebar from './components/WorkerTabsSidebar.vue'

// Tab components
import WorkerInfoTab from './components/detail/tabs/WorkerInfoTab.vue'
import WorkerPermissionsTab from './components/detail/tabs/WorkerPermissionsTab.vue'
import WorkerHistoryTab from './components/detail/tabs/WorkerHistoryTab.vue'
import WorkerKpiTab from './components/detail/tabs/WorkerKpiTab.vue'

import { useSettingsStore } from '@/store/settings'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const settingsStore = useSettingsStore()
const worker = ref(null)
const loading = ref(false)
const activeTab = ref(route.query.tab || 'details')

// Prepare tabs
const navTabs = computed(() => {
  const tabs = [
    { id: 'details', label: t('workers.details'), icon: 'pi pi-id-card' },
    { id: 'permissions', label: t('workers.permissions'), icon: 'pi pi-shield' }
  ]
  
  if (settingsStore.isKpiEnabled && settingsStore.hasPlanKpi) {
    tabs.push({ id: 'kpi', label: t('kpi.title'), icon: 'pi pi-chart-bar' })
  }
  
  tabs.push({ id: 'history', label: t('workers.logs') || 'Tizim Jurnali', icon: 'pi pi-history' })
  return tabs
})

const loadWorker = async () => {
    loading.value = true
    try {
        const res = await workersAPI.getById(route.params.id)
        worker.value = res.data
    } catch (e) {
        console.error('Worker load error:', e)
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('workers.messages.load_error') })
    } finally {
        loading.value = false
    }
}

watch(activeTab, (newTab) => {
  router.replace({
    query: {
      ...route.query,
      tab: newTab
    }
  })
})

// Keep activeTab in sync with browser query changes (e.g. back/forward navigation)
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && newTab !== activeTab.value) {
      activeTab.value = newTab
    }
  }
)

onMounted(() => {
    if (route.query.tab) {
        activeTab.value = route.query.tab
    }
    loadWorker()
})

const handleEdit = () => {
    if (!worker.value) return
    router.push({ name: 'worker-edit', params: { id: worker.value.id || worker.value._id } })
}
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
