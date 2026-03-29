<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[1050] flex items-center justify-center p-4 sm:p-6">
        <!-- Modern Blur Backdrop -->
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-[8px]" @click="closeModal"></div>
        
        <!-- Modal Container -->
        <Transition name="scale-up">
          <div v-if="visible" class="relative w-full max-w-[420px] bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col transition-all duration-300">
            
            <!-- Elegant Header with Subtle Mesh Gradient -->
            <div class="relative h-24 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-between px-6">
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)]"></div>
              
              <h3 class="text-white text-sm font-black uppercase tracking-[0.2em] relative z-10 opacity-90">
                {{ $t('profile.title') }}
              </h3>

              <button 
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border-none cursor-pointer relative z-10" 
                @click="closeModal" 
              >
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </div>

            <!-- Profile Overview Section -->
            <div class="px-6 -mt-10 relative z-10">
              <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 group">
                <div class="relative shrink-0">
                  <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
                    <Avatar 
                      v-if="user.avatar_url"
                      :image="user.avatar_url"
                      shape="square"
                      class="!w-full !h-full"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                      <i class="pi pi-user text-2xl"></i>
                    </div>
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-base font-black text-slate-900 dark:text-white truncate">
                    {{ user.first_name }} {{ user.last_name }}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{{ user.worker?.role_display || 'Xodim' }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: #{{ currentWorker?.id || user.id }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scrollable Content -->
            <div class="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div class="space-y-4 animate-in fade-in duration-500">
                <!-- Account Info Group -->
                <div class="grid grid-cols-1 gap-1">
                  <div class="flex items-center px-4 py-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <i class="pi pi-at text-slate-400 mr-4 text-xs"></i>
                    <div class="flex flex-col">
                      <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">{{ $t('profile.username') }}</span>
                      <span class="text-sm font-bold text-slate-700 dark:text-slate-200">@{{ user.username }}</span>
                    </div>
                  </div>

                  <div class="flex items-center px-4 py-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <i class="pi pi-envelope text-slate-400 mr-4 text-xs"></i>
                    <div class="flex flex-col">
                      <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">{{ $t('profile.email') }}</span>
                      <span class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{{ user.email || '—' }}</span>
                    </div>
                  </div>

                  <div class="flex items-center px-4 py-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <i class="pi pi-phone text-slate-400 mr-4 text-xs"></i>
                    <div class="flex flex-col">
                      <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">{{ $t('profile.contact') }}</span>
                      <div class="flex flex-col gap-0.5">
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ currentWorker?.phone1 || user.phone1 }}</span>
                        <span v-if="currentWorker?.phone2 || user.phone2" class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ currentWorker?.phone2 || user.phone2 }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Workplace Badge -->
                <div class="relative overflow-hidden p-4 rounded-3xl bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] border border-emerald-500/10 mt-6 group">
                  <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/5 rotate-12 rounded-full transition-transform group-hover:scale-110"></div>
                  <div class="flex items-start gap-3 relative z-10">
                    <div class="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                      <i class="pi pi-map-marker text-[10px]"></i>
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-[8px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-[0.2em] mb-0.5">{{ $t('profile.workplace') }}</span>
                      <span class="text-xs font-black text-slate-800 dark:text-white uppercase truncate tracking-tight">{{ user.worker?.store_name }}</span>
                      <span class="text-[10px] font-bold text-emerald-500/70">{{ user.worker?.branch_name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex items-center gap-3 pt-6">
                  <button 
                    @click="goToEdit"
                    class="flex-1 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <i class="pi pi-sliders-h text-[9px]"></i>
                    {{ $t('common.edit') }}
                  </button>
                  <button 
                    @click="$emit('logout')"
                    class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white border border-rose-100 dark:border-rose-500/20 active:scale-95 cursor-pointer"
                  >
                    <i class="pi pi-power-off text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import Avatar from 'primevue/avatar'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { workersAPI } from '@/services/api'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, required: true }
})

const emit = defineEmits(['update:visible', 'logout'])
const router = useRouter()

const currentWorker = ref(null)

watch(() => props.visible, async (val) => {
  if (val) {
    try {
      const res = await workersAPI.getMe()
      currentWorker.value = res.data
      console.log('Current Worker Profile (Fetch):', res.data)
    } catch (e) {
      console.error('Error fetching worker me on open:', e)
    }
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

const goToEdit = () => {
  const workerId = currentWorker.value?.id || props.user.worker?.id || props.user.id
  if (!workerId) return
  
  emit('update:visible', false)
  router.push({ name: 'worker-detail', params: { id: workerId } })
}

const closeModal = () => {
  emit('update:visible', false)
}

const handleEsc = (e) => { if (e.key === 'Escape') closeModal() }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to        { opacity: 0; }

.scale-up-enter-active, .scale-up-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-up-enter-from,   .scale-up-leave-to     { opacity: 0; transform: scale(0.95) translateY(10px); }

.animate-in { animation: animateIn 0.5s ease-out both; }
@keyframes animateIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
