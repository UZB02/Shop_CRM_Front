<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[1050] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:visible', false)"></div>
        
        <!-- Modal -->
        <Transition name="scale">
          <div v-if="visible" class="relative w-full max-w-[380px] bg-white dark:bg-[#0F172A] min-h-max overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-2xl flex flex-col">
            
            <!-- Header: More Compact -->
            <div class="relative h-24 bg-gradient-to-br from-[#10B981] to-[#059669] dark:from-[#2D7A5E] dark:to-[#1E4D3C] flex items-start justify-end p-3">
              <div class="absolute inset-0 bg-black/5 dark:bg-black/10"></div>
              <button 
                class="flex items-center justify-center !text-white/90 hover:!text-white hover:bg-white/20 w-7 h-7 rounded-full transition-all z-10 border-none bg-transparent cursor-pointer" 
                @click="$emit('update:visible', false)" 
              >
                <i class="pi pi-times text-xs"></i>
              </button>
              
              <div class="absolute -bottom-8 left-1/2 -translate-x-1/2">
                <div class="relative">
                  <div class="w-20 h-20 rounded-full border-[5px] border-white dark:border-[#0F172A] bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-lg overflow-hidden">
                    <Avatar 
                      v-if="user.avatar_url"
                      :image="user.avatar_url"
                      shape="circle"
                      class="!w-full !h-full"
                    />
                    <i v-else class="pi pi-user text-2xl text-emerald-500/50"></i>
                  </div>
                  <div class="absolute bottom-1 right-1 w-4 h-4 bg-[#22C55E] border-[2px] border-white dark:border-[#0F172A] rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <!-- Main Info -->
            <div class="pt-10 px-6 pb-5">
              <div class="text-center mb-4">
                <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {{ user.first_name }} {{ user.last_name }}
                </h3>
                <div class="flex items-center justify-center gap-2 mt-1">
                  <span class="px-2 py-0.5 bg-emerald-50 dark:bg-[#064E3B] text-emerald-600 dark:text-[#10B981] text-[8px] font-black uppercase rounded tracking-widest border border-emerald-500/20">
                    {{ user.worker?.role_display || 'USER' }}
                  </span>
                  <span class="text-slate-400 dark:text-slate-500 text-[9px] font-medium">• ID: #{{ user.id }}</span>
                </div>
              </div>

              <div class="space-y-2.5">
                <div class="flex items-center gap-4 group">
                  <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700/50 transition-colors group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-500/10">
                    <i class="pi pi-user text-xs"></i>
                  </div>
                  <div class="flex flex-col border-b border-slate-100 dark:border-slate-800/50 pb-1.5 flex-1 transition-all group-hover:border-emerald-500/30">
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Username</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">@{{ user.username }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-4 group">
                  <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700/50 transition-colors group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-500/10">
                    <i class="pi pi-envelope text-xs"></i>
                  </div>
                  <div class="flex flex-col border-b border-slate-100 dark:border-slate-800/50 pb-1.5 flex-1 transition-all group-hover:border-emerald-500/30">
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{{ user.email }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-4 group">
                  <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700/50 transition-colors group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-500/10">
                    <i class="pi pi-phone text-xs"></i>
                  </div>
                  <div class="flex flex-col border-b border-slate-100 dark:border-slate-800/50 pb-1.5 flex-1 transition-all group-hover:border-emerald-500/30">
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Aloqa</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ user.phone1 }}</span>
                    <span v-if="user.phone2" class="text-[10px] text-slate-400 dark:text-slate-500">{{ user.phone2 }}</span>
                  </div>
                </div>
              </div>

              <!-- Branch Snapshot -->
              <div class="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm dark:shadow-inner border border-slate-100 dark:border-slate-700">
                  <i class="pi pi-briefcase text-base"></i>
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ish joyi</span>
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-[13px] text-slate-800 dark:text-white font-bold truncate">{{ user.worker?.store_name }}</span>
                    <span class="text-emerald-500 text-[9px] font-medium">{{ user.worker?.branch_name }}</span>
                  </div>
                </div>
              </div>

              <!-- Change Password Link/Button -->
              <button 
                class="w-full mt-3.5 flex items-center justify-center gap-2 font-bold text-[11px] bg-emerald-50/50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-100 dark:border-emerald-500/10 h-9 transition-all rounded-xl cursor-pointer"
                @click="showChangePassword = true" 
              >
                <i class="pi pi-key text-[9px]"></i>
                Parolni yangilash
              </button>

              <!-- Professional Action Footer -->
              <div class="mt-5 pt-3.5 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/50">
                <Button 
                  label="Chiqish" 
                  severity="danger" 
                  text
                  class="flex-1 font-black text-[10px] uppercase tracking-widest bg-rose-50 dark:bg-rose-500/5 hover:bg-rose-100 dark:hover:bg-rose-500/10 text-rose-500 border border-rose-200 dark:border-rose-500/10 h-9 transition-all rounded-xl"
                  @click="$emit('logout')" 
                />
                <Button 
                  label="Yopish" 
                  text 
                  class="flex-1 font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:text-white h-9 transition-all border border-slate-200 dark:border-slate-800 rounded-xl" 
                  @click="$emit('update:visible', false)" 
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <ChangePasswordDialog v-model:visible="showChangePassword" />
  </Teleport>
</template>

<script setup>
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import ChangePasswordDialog from './ChangePasswordDialog.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, required: true }
})

const emit = defineEmits(['update:visible', 'logout'])

const showChangePassword = ref(false)

// Handle ESC key to close
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

const handleEsc = (e) => {
  if (e.key === 'Escape') emit('update:visible', false)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
