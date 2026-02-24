<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    dismissableMask
    :showHeader="false"
    class="custom-profile-dialog"
    contentClass="!p-0 !bg-transparent !border-none !outline-none !shadow-none !rounded-none"
    :style="{ width: '380px', background: 'transparent', border: 'none', boxShadow: 'none' }" 
  >
    <div v-if="user" class="flex flex-col bg-[#0F172A] min-h-max overflow-hidden rounded-3xl border border-slate-800/60 shadow-2xl shadow-black/60">
      
      <!-- Header: Compact & Professional -->
      <div class="relative h-28 bg-gradient-to-br from-[#2D7A5E] to-[#1E4D3C] flex items-start justify-end p-4">
        <div class="absolute inset-0 bg-black/10"></div>
        <Button 
          icon="pi pi-times" 
          text 
          rounded 
          class="!text-white/70 hover:!text-white hover:bg-white/10 !w-8 !h-8 transition-all" 
          @click="$emit('update:visible', false)" 
        />
        
        <div class="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div class="relative">
            <div class="w-24 h-24 rounded-full border-[6px] border-[#0F172A] bg-slate-800 flex items-center justify-center shadow-2xl overflow-hidden">
              <Avatar 
                v-if="user.avatar_url"
                :image="user.avatar_url"
                shape="circle"
                class="!w-full !h-full"
              />
              <i v-else class="pi pi-user text-3xl text-emerald-500/50"></i>
            </div>
            <div class="absolute bottom-1 right-1 w-5 h-5 bg-[#22C55E] border-[3px] border-[#0F172A] rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Main Info -->
      <div class="pt-12 px-6 pb-6">
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-white tracking-tight">
            {{ user.first_name }} {{ user.last_name }}
          </h3>
          <div class="flex items-center justify-center gap-2 mt-1.5">
            <span class="px-2 py-0.5 bg-[#064E3B] text-[#10B981] text-[9px] font-black uppercase rounded tracking-widest border border-emerald-500/20">
              {{ user.worker?.role_display || 'USER' }}
            </span>
            <span class="text-slate-500 text-[10px] font-medium">• ID: #{{ user.id }}</span>
          </div>
        </div>

        <div class="space-y-3.5">
          <div class="flex items-center gap-4 group">
            <div class="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-emerald-500 border border-slate-700/50 transition-colors group-hover:bg-emerald-500/10">
              <i class="pi pi-user text-xs"></i>
            </div>
            <div class="flex flex-col border-b border-slate-800/50 pb-1.5 flex-1 transition-all group-hover:border-emerald-500/30">
              <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Username</span>
              <span class="text-sm font-semibold text-slate-200">@{{ user.username }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4 group">
            <div class="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-emerald-500 border border-slate-700/50 transition-colors group-hover:bg-emerald-500/10">
              <i class="pi pi-envelope text-xs"></i>
            </div>
            <div class="flex flex-col border-b border-slate-800/50 pb-1.5 flex-1 transition-all group-hover:border-emerald-500/30">
              <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Email</span>
              <span class="text-sm font-semibold text-slate-200 truncate">{{ user.email }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4 group">
            <div class="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-emerald-500 border border-slate-700/50 transition-colors group-hover:bg-emerald-500/10">
              <i class="pi pi-phone text-xs"></i>
            </div>
            <div class="flex flex-col border-b border-slate-800/50 pb-1.5 flex-1 transition-all group-hover:border-emerald-500/30">
              <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Aloqa</span>
              <span class="text-sm font-semibold text-slate-200">{{ user.phone1 }}</span>
              <span v-if="user.phone2" class="text-[10px] text-slate-500">{{ user.phone2 }}</span>
            </div>
          </div>
        </div>

        <!-- Branch Snapshot -->
        <div class="mt-6 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-500 shadow-inner">
            <i class="pi pi-briefcase text-lg"></i>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Ish joyi</span>
            <span class="text-sm text-white font-bold truncate">{{ user.worker?.store_name }}</span>
            <span class="text-emerald-500 text-[10px] font-medium">{{ user.worker?.branch_name }} filiali</span>
          </div>
        </div>

        <!-- Professional Action Footer -->
        <div class="mt-6 pt-4 flex items-center gap-3">
          <Button 
            label="Chiqish" 
            severity="danger" 
            text
            class="flex-1 font-bold text-xs bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/10 h-10 transition-all"
            @click="$emit('logout')" 
          />
          <Button 
            label="Yopish" 
            text 
            class="flex-1 font-bold text-xs text-slate-400 hover:text-white h-10 transition-all border border-slate-800" 
            @click="$emit('update:visible', false)" 
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.custom-profile-dialog.p-dialog),
:deep(.custom-profile-dialog) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.custom-profile-dialog .p-dialog-content) {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  overflow: visible !important;
}

:deep(.custom-profile-dialog .p-dialog-header) {
  display: none !important;
}

/* Wrapper div (PrimeVue adds its own bg) */
:deep(.custom-profile-dialog > .p-dialog) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* Modal backdrop */
:deep(.p-dialog-mask.p-component-overlay) {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>

<script setup>
import Dialog from 'primevue/dialog'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, required: true }
})

defineEmits(['update:visible', 'logout'])
</script>
