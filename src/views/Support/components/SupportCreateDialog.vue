<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  visible: Boolean,
  newTicket: Object,
  submittings: Boolean
})

const emit = defineEmits(['update:visible', 'create'])
</script>

<template>
  <Dialog 
    v-slot:default
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    :header="$t('support_page.create_modal_title')"
    class="!max-w-md w-full !bg-white dark:!bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl pt-2"
    :pt="{
      root: { class: 'rounded-2xl border-none shadow-2xl backdrop-blur-xl transition-all duration-300 p-4 mb-3' },
      header: { class: 'text-sm font-black border-none bg-transparent !pb-2' },
      content: { class: '!pb-4' }
    }"
  >
    <form @submit.prevent="emit('create')" class="space-y-4 pt-2">
      <!-- Title input -->
      <div class="space-y-1">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">{{ $t('support_page.create_modal_subject') }}</label>
        <input 
          :value="newTicket.title"
          @input="newTicket.title = $event.target.value"
          type="text"
          required
          :placeholder="$t('support_page.create_modal_subject_placeholder')"
          class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>

      <!-- Priority Select -->
      <div class="space-y-1">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">{{ $t('support_page.create_modal_priority') }}</label>
        <div class="relative">
          <select 
            :value="newTicket.priority"
            @change="newTicket.priority = $event.target.value"
            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 appearance-none transition-all cursor-pointer"
          >
            <option value="low">{{ $t('support_page.priorities.low') }} (Low)</option>
            <option value="medium">{{ $t('support_page.priorities.medium') }} (Medium)</option>
            <option value="high">{{ $t('support_page.priorities.high') }} (High)</option>
            <option value="urgent">{{ $t('support_page.priorities.urgent') }} (Urgent)</option>
          </select>
          <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]"></i>
        </div>
      </div>

      <!-- Description textarea -->
      <div class="space-y-1">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">{{ $t('support_page.create_modal_desc') }}</label>
        <textarea 
          :value="newTicket.description"
          @input="newTicket.description = $event.target.value"
          rows="4"
          required
          :placeholder="$t('support_page.create_modal_desc_placeholder')"
          class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button 
          type="button" 
          @click="emit('update:visible', false)"
          class="px-4 py-2 text-xs font-extrabold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
        >
          {{ $t('support_page.cancel') }}
        </button>
        <button 
          type="submit"
          :disabled="submittings || !newTicket.title || !newTicket.title.trim() || !newTicket.description || !newTicket.description.trim()"
          class="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-100 disabled:to-slate-100 dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white disabled:text-slate-400 text-xs font-black shadow-lg shadow-emerald-500/15 rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          <i v-if="submittings" class="pi pi-spin pi-spinner text-xs"></i>
          {{ $t('support_page.submit') }}
        </button>
      </div>
    </form>
  </Dialog>
</template>
