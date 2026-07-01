<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-xl p-4 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group h-fit">
    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000"></div>
    
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-14 h-14 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-100 dark:border-white/10 flex items-center justify-center text-xl font-black mb-3 shadow-inner text-emerald-500">
        {{ initials }}
      </div>
      <h2 class="text-xs sm:text-sm font-black tracking-tight mb-2 text-center w-full">{{ customer.name }}</h2>
      <div class="flex flex-wrap justify-center gap-1.5 mb-6">
        <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{{ customer.status_display || 'ACTIVE' }}</span>
        <span class="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[9px] font-black tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ customer.group_name }}</span>
      </div>
      
      <div class="w-full space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <div class="flex items-center justify-between gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest leading-none">{{ $t('customers.details.phone') }}</span>
            <span class="text-[12px] font-black text-slate-700 dark:text-slate-300 truncate">{{ customer.phone || '—' }}</span>
        </div>
        <div class="flex items-center justify-between gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest leading-none">{{ $t('customers.details.address') }}</span>
            <span class="text-[12px] font-black text-slate-700 dark:text-slate-300 truncate" :title="customer.address">{{ customer.address || '—' }}</span>
        </div>
        <div class="flex items-center justify-between gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest leading-none">{{ $t('customers.details.registered') }}</span>
            <span class="text-[11px] font-black text-slate-700 dark:text-slate-300">{{ customer.created_on || '-' }}</span>
        </div>
        
        <!-- Qarz eslatma sanasi (Fast Edit) -->
        <div class="pt-2 border-t border-slate-100 dark:border-white/5">
          <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-1">
            {{ $t('customers.details.debt_reminder') || 'QARZ ESLATMA SANASI' }}
          </label>
          <div class="relative group/input mt-1">
            <i class="pi pi-calendar absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 group-focus-within/input:text-emerald-500 transition-colors z-10 pointer-events-none"></i>
            <DatePicker 
              :modelValue="parsedReminderDate" 
              @update:modelValue="onReminderDateChange"
              dateFormat="yy-mm-dd" 
              :placeholder="$t('customers.form.debt_reminder_date_placeholder') || 'YYYY-MM-DD'" 
              class="sidebar-reminder-datepicker w-full"
              appendTo="body"
              showButtonBar
            />
          </div>
        </div>
      </div>

      <button 
        v-if="Number(customer.debt_balance) > 0"
        @click="$emit('payDebt')"
        class="w-full mt-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-[11px] font-black tracking-[0.15em] shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <i class="pi pi-credit-card text-[12px]"></i>
        {{ $t('customers.details.pay_debt_title') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  customer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['payDebt', 'updateReminderDate'])

const initials = computed(() => {
  if (!props.customer.name) return '?'
  const parts = props.customer.name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})

const parsedReminderDate = computed(() => {
  return props.customer?.debt_reminder_date ? new Date(props.customer.debt_reminder_date) : null
})

const onReminderDateChange = (val) => {
  emit('updateReminderDate', val)
}
</script>

<style>
/* Sidebar reminder datepicker styling */
.sidebar-reminder-datepicker {
  width: 100% !important;
}

.sidebar-reminder-datepicker .p-datepicker-input,
.sidebar-reminder-datepicker input {
  width: 100% !important;
  height: 2.25rem !important;
  padding-left: 2.25rem !important;
  padding-right: 0.75rem !important;
  border-radius: 0.75rem !important;
  background-color: rgba(248, 250, 252, 1) !important;
  border: 1px solid transparent !important;
  color: rgb(30 41 59) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-align: left !important;
  transition: all 0.2s ease !important;
  outline: none !important;
}

.dark .sidebar-reminder-datepicker .p-datepicker-input,
.dark .sidebar-reminder-datepicker input {
  background-color: rgba(30, 41, 59, 0.4) !important;
  color: #f1f5f9 !important;
}

.sidebar-reminder-datepicker .p-datepicker-input:focus,
.sidebar-reminder-datepicker input:focus {
  background-color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.05) !important;
}

.dark .sidebar-reminder-datepicker .p-datepicker-input:focus,
.dark .sidebar-reminder-datepicker input:focus {
  background-color: rgb(15, 23, 42) !important;
}

.sidebar-reminder-datepicker .p-datepicker-input::placeholder,
.sidebar-reminder-datepicker input::placeholder {
  color: #94a3b8 !important;
}
</style>


