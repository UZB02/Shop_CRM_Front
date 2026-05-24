<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  activeTicket: Object,
  replies: Array,
  loadingReplies: Boolean,
  replyMessage: String,
  formatDateTime: Function,
  getPriorityBadgeClass: Function,
  getPriorityLabel: Function,
  getStatusBadgeClass: Function,
  getStatusLabel: Function
})

const emit = defineEmits(['update:replyMessage', 'sendReply'])

const textareaRef = ref(null)

const handleLocalInput = (e) => {
  emit('update:replyMessage', e.target.value)
  if (e.target) {
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }
}

const handleLocalKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('sendReply')
    if (textareaRef.value) {
      textareaRef.value.style.height = '36px'
    }
  }
}

// Reset textarea size when activeTicket changes
watch(() => props.activeTicket, () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = '36px'
  }
})
</script>

<template>
  <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col min-h-[550px] overflow-hidden">
    
    <!-- Active ticket header -->
    <div v-if="activeTicket" class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="text-xs font-black text-slate-800 dark:text-white truncate">
            {{ activeTicket.title }}
          </h3>
          <span :class="getStatusBadgeClass(activeTicket.status)" class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            {{ getStatusLabel(activeTicket.status) }}
          </span>
        </div>
        <p class="text-[9px] text-slate-400 mt-0.5">
          {{ $t('support_page.ticket_id') }}: #{{ activeTicket.id }} | {{ $t('support_page.opened_at') }}: {{ formatDateTime(activeTicket.created_on || activeTicket.created_at) }}
        </p>
      </div>
      <span :class="getPriorityBadgeClass(activeTicket.priority)" class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
        {{ getPriorityLabel(activeTicket.priority) }} {{ $t('support_page.priority_label') }}
      </span>
    </div>

    <!-- Chat messages view area -->
    <div class="flex-1 p-4 overflow-y-auto max-h-[380px] bg-slate-50/30 dark:bg-slate-950/20 flex flex-col gap-4">
      
      <!-- Not selected state -->
      <div v-if="!activeTicket" class="my-auto text-center flex flex-col items-center justify-center p-8">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
          <i class="pi pi-comments text-lg"></i>
        </div>
        <h4 class="text-xs font-black text-slate-700 dark:text-slate-300">{{ $t('support_page.view_details') }}</h4>
        <p class="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
          {{ $t('support_page.view_details_desc') }}
        </p>
      </div>

      <template v-else>
        <!-- Original Description pinned at the top -->
        <div class="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-900/20 rounded-xl relative">
          <div class="absolute right-3 top-3 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
            {{ $t('support_page.main_ticket') }}
          </div>
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ $t('support_page.description_title') }}</h4>
          <p class="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">
            {{ activeTicket.description }}
          </p>
        </div>

        <!-- Loader for replies -->
        <div v-if="loadingReplies" class="py-4 flex justify-center">
          <i class="pi pi-spin pi-spinner text-emerald-500 text-sm"></i>
        </div>

        <!-- Message bubble lists -->
        <div 
          v-for="msg in replies" 
          :key="msg.id" 
          class="flex flex-col max-w-[85%] rounded-2xl p-3 text-xs"
          :class="[
            msg.is_admin 
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 mr-auto rounded-tl-none shadow-sm' 
              : 'bg-emerald-500 text-white ml-auto rounded-tr-none shadow-sm shadow-emerald-500/10'
          ]"
        >
          <div class="flex items-center justify-between gap-4 mb-1">
            <span class="text-[9px] font-black tracking-wider uppercase opacity-65">
              {{ msg.is_admin ? $t('support_page.operator') : $t('support_page.you') }}
            </span>
            <span class="text-[8px] opacity-50 font-bold shrink-0">
              {{ formatDateTime(msg.created_on) }}
            </span>
          </div>
          <p class="font-medium whitespace-pre-wrap leading-relaxed">{{ msg.message }}</p>
        </div>
      </template>

    </div>

    <!-- Chat input panel footer -->
    <div v-if="activeTicket" class="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/60 transition-all duration-200 shadow-inner">
        <textarea 
          ref="textareaRef"
          :value="replyMessage"
          @input="handleLocalInput"
          @keydown="handleLocalKeyDown"
          rows="1"
          :placeholder="$t('support_page.chat_input_placeholder')" 
          class="flex-1 max-h-[120px] min-h-[36px] h-9 py-2 px-3 bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border-none outline-none resize-none focus:ring-0 focus:outline-none transition-all leading-relaxed"
        ></textarea>
        <button 
          @click="emit('sendReply')"
          :disabled="!replyMessage.trim()"
          class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-100 dark:disabled:from-slate-800 disabled:to-slate-100 dark:disabled:to-slate-800 text-white disabled:text-slate-400 flex items-center justify-center shadow-md shadow-emerald-500/15 disabled:shadow-none active:scale-95 disabled:scale-100 transition-all duration-150 shrink-0 cursor-pointer"
        >
          <i class="pi pi-send text-xs"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2);
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.4);
}
</style>
