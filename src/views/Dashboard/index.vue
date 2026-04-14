<template>
  <div class="space-y-6">
    <!-- Stats Grid Component -->
    <StatsGrid :stats="stats" />

    <!-- Charts and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-2 border-none shadow-sm h-full">
        <template #title>Haftalik Savdo Dinamikasi</template>
        <template #content>
          <div class="h-80 flex items-center justify-center text-slate-400">
             <div class="text-center">
               <i class="pi pi-chart-bar text-4xl mb-2"></i>
               <p>Grafik yuklanmoqda...</p>
             </div>
          </div>
        </template>
      </Card>

      <!-- Recent Activity Component -->
      <RecentActivity :activity="activity" :loading="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import StatsGrid from './components/StatsGrid.vue'
import RecentActivity from './components/RecentActivity.vue'
import { dashboardAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const loading = ref(true)
const stats = ref([
  { label: 'Umumiy Savdo', value: '0', trend: '0%', trendUp: true, icon: 'pi pi-dollar', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Mahsulotlar', value: '0', trend: '0%', trendUp: false, icon: 'pi pi-box', color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Mijozlar', value: '0', trend: '0%', trendUp: true, icon: 'pi pi-users', color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Xarajatlar', value: '0', trend: '0%', trendUp: false, icon: 'pi pi-wallet', color: 'text-rose-500', bg: 'bg-rose-50' },
])

const activity = ref([])

const formatCurrency = (value) => {
  return settingsStore.formatNumber(Math.floor((value || 0) / 1000000)) + 'M'
}

onMounted(async () => {
  try {
    const statsResponse = await dashboardAPI.getStats()
    const data = statsResponse.data

    stats.value = [
      { 
        label: 'Umumiy Savdo', 
        value: formatCurrency(data.totalSales || 0), 
        trend: '12% o\'sish', 
        trendUp: true, 
        icon: 'pi pi-dollar', 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-50' 
      },
      { 
        label: 'Mahsulotlar', 
        value: data.totalProducts || 0, 
        trend: data.lowStockCount ? `${data.lowStockCount} kam` : 'Yaxshi', 
        trendUp: !data.lowStockCount, 
        icon: 'pi pi-box', 
        color: 'text-blue-500', 
        bg: 'bg-blue-50' 
      },
      { 
        label: 'Mijozlar', 
        value: data.totalCustomers || 0, 
        trend: '8% o\'sish', 
        trendUp: true, 
        icon: 'pi pi-users', 
        color: 'text-purple-500', 
        bg: 'bg-purple-50' 
      },
      { 
        label: 'Xarajatlar', 
        value: formatCurrency(data.totalExpenses || 0), 
        trend: '2% o\'sish', 
        trendUp: false, 
        icon: 'pi pi-wallet', 
        color: 'text-rose-500', 
        bg: 'bg-rose-50' 
      },
    ]

    const activitiesResponse = await dashboardAPI.getActivities({ limit: 5 })
    activity.value = activitiesResponse.data

    loading.value = false
  } catch (error) {
    console.error('Error loading dashboard:', error)
    loading.value = false
  }
})
</script>
