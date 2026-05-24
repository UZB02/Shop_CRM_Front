<script setup>
defineProps({
  tickets: Array,
  loading: Boolean,
  activeTicket: Object,
  formatDateTime: Function,
  getPriorityBadgeClass: Function,
  getPriorityLabel: Function,
  getStatusBadgeClass: Function,
  getStatusLabel: Function
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col min-h-[550px] overflow-hidden">
    <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <span class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{{ $t('support_page.list_title') }}</span>
      <span class="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
        {{ tickets.length }} {{ $t('support_page.count_suffix') }}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto max-h-[500px]">
      <!-- Loading skeleton -->
      <div v-if="loading" class="p-8 flex flex-col gap-3 items-center justify-center">
        <i class="pi pi-spin pi-spinner text-emerald-500 text-xl"></i>
        <span class="text-[10px] font-bold text-slate-400 tracking-wider">{{ $t('support_page.loading') }}</span>
      </div>

      <!-- Empty list state -->
      <div v-else-if="tickets.length === 0" class="p-8 text-center flex flex-col items-center justify-center">
        <i class="pi pi-inbox text-slate-300 text-3xl mb-2"></i>
        <h4 class="text-xs font-extrabold text-slate-600 dark:text-slate-300">{{ $t('support_page.empty_title') }}</h4>
        <p class="text-[10px] text-slate-400 mt-1">{{ $t('support_page.empty_desc') }}</p>
      </div>

      <!-- Ticket list -->
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-800/50">
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id"
          @click="emit('select', ticket)"
          class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all relative animate-in"
          :class="activeTicket?.id === ticket.id ? 'bg-slate-50 dark:bg-slate-800/50 border-l-4 border-l-emerald-500 font-bold' : ''"
        >
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-xs font-black text-slate-700 dark:text-slate-200 line-clamp-1">
              {{ ticket.title }}
            </h4>
            <span :class="getPriorityBadgeClass(ticket.priority)" class="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider shrink-0 uppercase">
              {{ getPriorityLabel(ticket.priority) }}
            </span>
          </div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
            {{ ticket.description }}
          </p>
          <div class="flex items-center justify-between gap-2 mt-3">
            <span :class="getStatusBadgeClass(ticket.status)" class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {{ getStatusLabel(ticket.status) }}
            </span>
            <span class="text-[9px] font-semibold text-slate-400">
              {{ formatDateTime(ticket.created_on || ticket.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation: animate-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
