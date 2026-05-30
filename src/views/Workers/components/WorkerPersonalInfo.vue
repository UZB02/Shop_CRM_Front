<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
      <span class="w-4 h-4 rounded bg-emerald-500/10 flex items-center justify-center">
        <i class="pi pi-user text-emerald-500" style="font-size:9px"></i>
      </span>
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.personal_info').toUpperCase() }}</span>
    </div>
    <div class="p-4 grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.first_name') }} <span class="text-rose-500">*</span></label>
        <InputText v-model.trim="worker.first_name" class="sr-input w-full"
          :class="{'!border-rose-400': submitted && !worker.first_name}" placeholder="Alisher" />
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.last_name') }} <span class="text-rose-500">*</span></label>
        <InputText v-model.trim="worker.last_name" class="sr-input w-full"
          :class="{'!border-rose-400': submitted && !worker.last_name}" placeholder="Navoiy" />
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.phone1') }} <span class="text-rose-500">*</span></label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">+998</span>
          <InputText v-model="worker.phone1" class="sr-input w-full !pl-12" maxlength="9" inputmode="numeric"
            @input="worker.phone1 = worker.phone1.replace(/\D/g,'').slice(0,9)" placeholder="901234567" />
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.phone2') }}</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">+998</span>
          <InputText v-model="worker.phone2" class="sr-input w-full !pl-12" maxlength="9" inputmode="numeric"
            @input="worker.phone2 = worker.phone2.replace(/\D/g,'').slice(0,9)" placeholder="901234567" />
        </div>
      </div>
      <div class="col-span-2">
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.email') }} <span class="text-rose-500">*</span></label>
        <InputText v-model.trim="worker.email" class="sr-input w-full"
          :class="{'!border-rose-400': submitted && !worker.email}" placeholder="email@example.com" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'

defineProps({
  worker: Object,
  submitted: Boolean
})
</script>
