<template>
  <div class="space-y-4 animate-in">
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="pi pi-envelope text-emerald-500"></i>
          {{ $t('support_page.title') }}
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          {{ $t('support_page.subtitle') }}
        </p>
      </div>
      <button 
        @click="showCreateDialog = true"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
      >
        <i class="pi pi-plus"></i>
        {{ $t('support_page.create_btn') }}
      </button>
    </div>

    <!-- Stats & Filters panel -->
    <SupportFilters
      v-model:search="search"
      v-model:selectedStatus="selectedStatus"
      v-model:selectedPriority="selectedPriority"
    />

    <!-- Main side-by-side split grid layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      
      <!-- Left: Ticket List Panel -->
      <SupportTicketList
        :tickets="tickets"
        :loading="loading"
        :activeTicket="activeTicket"
        :formatDateTime="formatDateTime"
        :getPriorityBadgeClass="getPriorityBadgeClass"
        :getPriorityLabel="getPriorityLabel"
        :getStatusBadgeClass="getStatusBadgeClass"
        :getStatusLabel="getStatusLabel"
        @select="selectTicket"
      />

      <!-- Right: Live Chat Room Panel -->
      <SupportChatRoom
        :activeTicket="activeTicket"
        :replies="replies"
        :loadingReplies="loadingReplies"
        v-model:replyMessage="replyMessage"
        :formatDateTime="formatDateTime"
        :getPriorityBadgeClass="getPriorityBadgeClass"
        :getPriorityLabel="getPriorityLabel"
        :getStatusBadgeClass="getStatusBadgeClass"
        :getStatusLabel="getStatusLabel"
        @sendReply="handleSendReply"
      />

    </div>

    <!-- PrimeVue Dialog for ticket creation -->
    <SupportCreateDialog
      v-model:visible="showCreateDialog"
      :newTicket="newTicket"
      :submittings="submittings"
      @create="handleCreateTicket"
    />

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSupport } from './composables/useSupport'
import SupportFilters from './components/SupportFilters.vue'
import SupportTicketList from './components/SupportTicketList.vue'
import SupportChatRoom from './components/SupportChatRoom.vue'
import SupportCreateDialog from './components/SupportCreateDialog.vue'

const { t } = useI18n()

const {
  search,
  selectedStatus,
  selectedPriority,
  activeTicket,
  replyMessage,
  showCreateDialog,
  newTicket,
  submittings,
  tickets,
  replies,
  loading,
  loadingReplies,
  selectTicket,
  handleSendReply,
  handleCreateTicket,
  formatDateTime
} = useSupport()

const getPriorityLabel = (priority) => {
  return t(`support_page.priorities.${priority}`, priority)
}

// Badge classes configuration matching admin dashboard perfectly
const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
    case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
    default: return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'open': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
    case 'in_progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
    case 'resolved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    case 'closed': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
    default: return 'bg-slate-100 text-slate-500'
  }
}

const getStatusLabel = (status) => {
  return t(`support_page.statuses.${status}`, status)
}
</script>

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
