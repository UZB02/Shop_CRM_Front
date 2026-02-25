<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12">
    <!-- Header / Quick Info -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-4xl text-white font-black shadow-2xl ring-4 ring-slate-50 dark:ring-slate-800"
               :style="getAvatarGradient(worker?.full_name)">
            {{ getInitials(worker) }}
          </div>
          <span class="absolute bottom-1 right-1 w-8 h-8 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg"
                :class="isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
        </div>

        <div class="flex-1 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ worker?.full_name }}
            </h1>
            <span class="inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border w-fit mx-auto md:mx-0"
                  :class="getRoleBadgeClass(worker?.role)">
              {{ worker?.role_display || worker?.role }}
            </span>
          </div>
          
          <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-1.5">
              <i class="pi pi-at text-emerald-500"></i>
              <span class="font-bold">{{ worker?.username }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="pi pi-map-marker text-emerald-500"></i>
              <span>{{ worker?.branch_name || 'Filial biriktirilmagan' }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="pi pi-calendar text-emerald-500"></i>
              <span>Ro'yxatdan o'tgan: {{ formatDate(worker?.created_on) }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <Button icon="pi pi-chevron-left" label="Orqaga" severity="secondary" text class="rounded-xl font-bold" @click="$router.back()" />
          <Button icon="pi pi-pencil" label="Tahrirlash" severity="success" class="rounded-xl font-bold px-6 shadow-lg shadow-emerald-500/20" @click="handleEdit" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Details -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Detailed Information -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8">
          <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <i class="pi pi-info-circle text-blue-500"></i>
            </div>
            <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Umumiy ma'lumotlar</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div v-for="item in detailItems" :key="item.label" class="space-y-1">
              <span class="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                {{ item.label }}
              </span>
              <p class="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2">
                <i v-if="item.icon" :class="['pi', item.icon, 'text-xs text-slate-400']"></i>
                {{ item.value || '—' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Permissions Section -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <i class="pi pi-shield text-emerald-500"></i>
              </div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ruxsatlar va Huquqlar</h2>
            </div>
            <span class="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{ worker?.permissions?.length || 0 }} faol
            </span>
          </div>

          <div class="flex flex-wrap gap-3">
            <div v-for="perm in worker?.permissions" :key="perm" 
                 class="group relative flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500/5 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/20 rounded-2xl transition-all duration-300">
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{{ perm }}</span>
            </div>
            
            <div v-if="!worker?.permissions?.length" class="w-full py-12 text-center text-slate-400">
              <i class="pi pi-lock text-4xl mb-3 opacity-20 block"></i>
              <p class="font-bold uppercase tracking-widest text-[10px]">Hech qanday ruxsatlar biriktirilmagan</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Sidebar Stats -->
      <div class="space-y-6">
        
        <!-- Status & Salary Card -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div class="relative space-y-6 text-center">
             <div class="space-y-1">
               <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ish Faoliyati</span>
               <div class="flex justify-center">
                 <div class="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md inline-flex items-center gap-2">
                   <span class="w-2 h-2 rounded-full" :class="isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'"></span>
                   <span class="text-xs font-black uppercase tracking-widest">{{ isActive ? 'Faol Xodim' : 'Nofaol' }}</span>
                 </div>
               </div>
             </div>

             <div class="py-4 border-y border-white/5 space-y-1">
               <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Oylik Maosh</span>
               <p class="text-3xl font-black text-emerald-400 tracking-tight">{{ formatCurrency(worker?.salary) }}</p>
               <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">UZS / OY</span>
             </div>

             <div class="space-y-1">
               <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Xodim ID</span>
               <p class="text-xl font-bold font-mono tracking-widest text-slate-300">#00{{ worker?.id }}</p>
             </div>
          </div>
        </div>

        <!-- Extra Permissions / Notes -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
           <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block mb-4">Qo'shimcha sozlamalar</span>
           
           <div class="space-y-4">
             <div v-if="hasExtraPerms" v-for="(val, key) in worker?.extra_permissions" :key="key" class="flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">{{ key }}</span>
                <span :class="val ? 'text-emerald-500' : 'text-slate-400'">
                  <i :class="val ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                </span>
             </div>
             <div v-else class="text-center py-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Maxsus ruxsatlar<br>mavjud emas</p>
             </div>
           </div>
        </div>

        <!-- System Logs / Metadata -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
           <div class="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
             <i class="pi pi-history text-slate-400"></i>
           </div>
           <div>
             <p class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Oxirgi yangilanish</p>
             <p class="text-[11px] font-medium text-slate-500">{{ formatDate(worker?.created_on) }}</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workersAPI } from '@/services/api'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const worker = ref(null)
const loading = ref(false)

const loadWorker = async () => {
    loading.value = true
    try {
        const res = await workersAPI.getById(route.params.id)
        worker.value = res.data
    } catch (e) {
        console.error('Worker load error:', e)
    } finally {
        loading.value = false
    }
}

onMounted(loadWorker)

const detailItems = computed(() => [
  { label: 'To\'liq ism', value: worker.value?.full_name, icon: 'pi-user' },
  { label: 'Username', value: worker.value?.username, icon: 'pi-at' },
  { label: 'Pochta manzili', value: worker.value?.email, icon: 'pi-envelope' },
  { label: 'Asosiy telefon', value: worker.value?.phone1, icon: 'pi-phone' },
  { label: 'Qo\'shimcha telefon', value: worker.value?.phone2 || 'Kiritilmagan', icon: 'pi-phone' },
  { label: 'Filial / Do\'kon', value: worker.value?.branch_name, icon: 'pi-map-marker' },
  { label: 'Holati', value: worker.value?.status === 'active' ? 'Faol ishga qabul qilingan' : 'Nofaol', icon: 'pi-info-circle' },
  { label: 'Lavozim', value: worker.value?.role_display, icon: 'pi-briefcase' },
])

const isActive = computed(() => worker.value?.status === 'active' || worker.value?.is_active)
const hasExtraPerms = computed(() => worker.value?.extra_permissions && Object.keys(worker.value.extra_permissions).length > 0)

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ').format(val || 0)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('uz-UZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (data) => {
  if (!data?.full_name) return '?'
  const parts = data.full_name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

const gradients = [
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
]

const getAvatarGradient = (name) => {
  const index = (name?.charCodeAt(0) || 0) % gradients.length
  return { background: gradients[index] }
}

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'owner':   return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
    case 'admin':   return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
    case 'manager': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
    default:        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
  }
}

const handleEdit = () => {
    // Navigate back to list with edit trigger or just handle it here
    router.push({ name: 'workers', query: { edit: route.params.id } })
}
</script>
