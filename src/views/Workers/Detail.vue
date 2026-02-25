<template>
  <div class="max-w-[1600px] mx-auto pb-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-all duration-300">
    
    <!-- HEADER: Compact Horizontal Identity Bar -->
    <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
      <!-- Decorative element -->
      <div class="absolute inset-y-0 left-0 w-1.5 bg-emerald-500 hidden sm:block"></div>

      <div class="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl md:text-3xl text-white font-black shadow-lg ring-4 ring-slate-50 dark:ring-slate-800 transition-transform duration-500 group-hover:scale-105"
               :style="getAvatarGradient(worker?.full_name)">
            {{ getInitials(worker) }}
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-lg border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center transition-colors duration-300"
               :class="isActive ? 'bg-emerald-500' : 'bg-rose-500'">
            <i :class="['pi', isActive ? 'pi-check' : 'pi-times', 'text-white text-[8px] md:text-[10px] font-black']"></i>
          </div>
        </div>

        <div class="space-y-1.5 mt-2 sm:mt-0">
          <div class="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
            <h1 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ worker?.full_name }}
            </h1>
            <span class="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
              {{ worker?.role_display || worker?.role }}
            </span>
          </div>
          <div class="flex flex-wrap justify-center sm:justify-start items-center gap-3 md:gap-4">
             <span class="text-[11px] font-bold text-slate-400">@{{ worker?.username }}</span>
             <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
             <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
               <i class="pi pi-map-marker text-emerald-500"></i>
               <span>{{ worker?.branch_name || '—' }}</span>
             </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Integrated (Visible from Medium screens) -->
      <div class="hidden md:flex items-center gap-6 lg:gap-10 border-slate-100 dark:border-slate-800 md:border-x md:px-6 lg:px-10 h-12">
        <div class="text-center">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Oylik Maosh</p>
          <p class="text-xs lg:text-sm font-black text-emerald-500 tracking-tight">{{ formatCurrency(worker?.salary) }} <span class="text-[10px] text-slate-400 font-medium ml-1">UZS</span></p>
        </div>
        <div class="text-center">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Xodim ID</p>
          <p class="text-xs lg:text-sm font-black text-slate-700 dark:text-slate-300 tracking-widest">#00{{ worker?.id }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0 border-slate-100 dark:border-slate-800">
        <Button icon="pi pi-arrow-left" 
                label="Qaytish" 
                text 
                class="!text-slate-400 hover:!text-emerald-500 !font-bold !text-[10px] uppercase tracking-widest"
                @click="$router.back()" />
        <Button icon="pi pi-pencil" 
                label="Tahrirlash" 
                class="!rounded-xl !px-5 !py-2.5 !bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !font-black !text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5" 
                @click="handleEdit" />
      </div>
    </div>

    <!-- MAIN COMPACT CONTENT GRID -->
    <div class="space-y-6">
      
      <!-- Contact Info Section (Responsive Grid) -->
      <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center gap-4 px-2">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
              <i class="pi pi-phone text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefon</p>
              <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ worker?.phone1 || '—' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 px-2">
            <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 flex-shrink-0">
              <i class="pi pi-envelope text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pochta manzili</p>
              <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ worker?.email || '—' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 px-2">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <i class="pi pi-briefcase text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lavozimi</p>
              <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ worker?.role_display || '—' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 px-2">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <i class="pi pi-calendar text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qushilgan sana</p>
              <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ formatDate(worker?.created_on) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordion Grid Containers -->
      <div class="w-full">
        <Accordion :value="['0', '1']" multiple class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          
          <!-- Detailed Information Panel -->
          <AccordionPanel value="0" class="!border-none !bg-transparent">
            <AccordionHeader class="!bg-white dark:!bg-slate-900 !rounded-[1.5rem] !p-5 !border !border-slate-200 dark:!border-slate-800 shadow-sm transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner group-hover:scale-110 transition-transform">
                  <i class="pi pi-id-card text-lg"></i>
                </div>
                <div class="text-left">
                  <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">Xodim Tafsilotlari</h2>
                  <p class="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Batafsil shaxsiy ma'lumotlar</p>
                </div>
              </div>
            </AccordionHeader>
            <AccordionContent class="!bg-transparent !pt-4">
              <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div v-for="item in detailItems" :key="item.label" class="group">
                    <div class="flex items-center gap-1.5 mb-1.5">
                      <i v-if="item.icon" :class="['pi', item.icon, 'text-[8px] text-indigo-400']"></i>
                      <span class="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">{{ item.label }}</span>
                    </div>
                    <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-transparent shadow-sm truncate">
                      {{ item.value || '—' }}
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- Permissions Panel -->
          <AccordionPanel value="1" class="!border-none !bg-transparent">
            <AccordionHeader class="!bg-white dark:!bg-slate-900 !rounded-[1.5rem] !p-5 !border !border-slate-200 dark:!border-slate-800 shadow-sm transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                  <i class="pi pi-shield text-lg"></i>
                </div>
                <div class="text-left">
                  <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">Tizim Kirish Huquqlari</h2>
                  <p class="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Foydalanuvchiga biriktirilgan ruxsatlar</p>
                </div>
              </div>
            </AccordionHeader>
            <AccordionContent class="!bg-transparent !pt-4">
              <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
                <div class="flex flex-wrap gap-2">
                  <div v-for="perm in worker?.permissions" :key="perm" 
                       class="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500/5 border border-slate-200/50 dark:border-slate-700/50 rounded-xl transition-all duration-300 group">
                    <div class="w-5 h-5 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-emerald-500">
                      <i class="pi pi-check text-[8px]"></i>
                    </div>
                    <span class="text-[10px] font-black text-slate-700 dark:text-slate-300 capitalize tracking-wide">{{ perm }}</span>
                  </div>
                  
                  <div v-if="!worker?.permissions?.length" class="w-full py-8 text-center">
                    <i class="pi pi-lock text-xl text-slate-300 dark:text-slate-600 block mb-1"></i>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Ruxsatlar mavjud emas</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workersAPI } from '@/services/api'
import Button from 'primevue/button'
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

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

<style scoped>
:deep(.p-accordionpanel) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-accordionheader) {
  background: transparent !important;
  border: none !important;
}

/* Accordion ichidagi default oq backgroundni olib tashlaymiz */
:deep(.p-accordioncontent-content) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-accordionheader-toggle-icon) {
  color: #94a3b8; /* slate-400 */
}
</style>
