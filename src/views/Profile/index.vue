<template>
  <div class="space-y-4 animate-in">
    <!-- Header Section -->
    <ProfileHeader 
      :profile="currentWorker" 
      @edit="isEditingMode = !isEditingMode"
    />

    <div v-if="loading" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-48"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="currentWorker" class="flex flex-col lg:flex-row gap-4 items-start">
      <!-- Left Sidebar -->
      <aside class="w-full lg:w-60 xl:w-64 shrink-0">
        <ProfileTabs 
          v-model="activeTab"
          :tabs="navTabs"
        />

        <!-- Mini performance widget: Standardized rounding -->
        <div v-if="currentWorker?.current_kpi" class="mt-4 p-5 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/10">
          <p class="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Oylik KPI</p>
          <div class="flex items-end justify-between mb-4">
            <h4 class="text-xl font-black font-outfit">{{ currentWorker.current_kpi.completion_pct }}%</h4>
            <span class="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md">{{ currentWorker.current_kpi.sales_count }} sotuv</span>
          </div>
          <div class="h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white rounded-full transition-all duration-1000" :style="{ width: currentWorker.current_kpi.completion_pct + '%' }"></div>
          </div>
        </div>
      </aside>

      <!-- Right Content Area -->
      <main class="flex-1 min-w-0">
        <Transition name="fade-slide" mode="out-in">
          <ProfileInfoTab 
            v-if="activeTab === 'details'" 
            key="details" 
            :profile="currentWorker" 
            :is-editing="isEditingMode"
            :form="editForm"
            :saving="saving"
            @toggle-edit="isEditingMode = !isEditingMode"
            @save="handleSave"
          />
          
          <ProfileKpiTab 
            v-else-if="activeTab === 'kpi'" 
            key="kpi" 
            :kpi="currentWorker?.current_kpi" 
          />
          
          <ProfilePermissionsTab 
            v-else-if="activeTab === 'permissions'" 
            key="permissions" 
            :permissions="currentWorker?.permissions" 
          />
          
          <ProfileSecurityTab 
            v-else-if="activeTab === 'security'" 
            key="security" 
            :form="editForm" 
            :saving="saving" 
            @save="saveChanges"
          />
        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUserProfile } from '@/composables/useUserProfile'
import { useI18n } from 'vue-i18n'

// Local Components
import ProfileHeader from './components/ProfileHeader.vue'
import ProfileTabs from './components/ProfileTabs.vue'
import ProfileInfoTab from './components/ProfileInfoTab.vue'
import ProfileKpiTab from './components/ProfileKpiTab.vue'
import ProfilePermissionsTab from './components/ProfilePermissionsTab.vue'
import ProfileSecurityTab from './components/ProfileSecurityTab.vue'

const authStore = useAuthStore()
const { t } = useI18n()
const activeTab = ref('details')
const loading = ref(false)
const isEditingMode = ref(false)

const {
  currentWorker,
  saving,
  editForm,
  fetchMe,
  saveChanges
} = useUserProfile(ref(authStore.user))

const navTabs = computed(() => [
  { id: 'details',    label: 'Ma\'lumotlar',  icon: 'pi-id-card', desc: 'Profil ma\'lumotlari' },
  { id: 'kpi',        label: 'KPI Natijalar', icon: 'pi-chart-bar', desc: 'Ish ko\'rsatkichlari' },
  { id: 'permissions', label: 'Ruxsatlar',     icon: 'pi-shield',    desc: 'Vakolatlar' },
  { id: 'security',    label: 'Xavfsizlik',    icon: 'pi-lock',      desc: 'Parol va himoya' }
])

const handleSave = async () => {
  await saveChanges()
  isEditingMode.value = false
  await fetchMe()
}

onMounted(async () => {
  loading.value = true
  await fetchMe()
  loading.value = false
})
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

.animate-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
