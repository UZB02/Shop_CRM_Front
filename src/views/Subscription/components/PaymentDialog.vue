<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" :header="header" :style="{width: '450px'}" :modal="true">
      <div class="flex flex-col gap-4">
          <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p class="text-xs uppercase font-black text-slate-500 mb-1 tracking-widest">{{ $t('subscription.current_plan') }}:</p>
              <p class="font-black text-2xl uppercase tracking-tight text-slate-800 dark:text-slate-100">
                {{ $t(`subscription.plans.${plan}`) }}
              </p>
              <p class="text-emerald-500 font-black text-lg mt-2">{{ priceLabel }}</p>
          </div>

          <div class="field">
              <label class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">To'lov Turi</label>
              <div class="flex gap-4">
                  <div class="flex-1 p-4 border-2 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all flex flex-col items-center gap-2 group"
                       :class="{'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20': method === 'click', 'border-slate-100 dark:border-slate-800': method !== 'click'}"
                       @click="$emit('update:method', 'click')">
                      <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i class="pi pi-credit-card text-2xl text-blue-500"></i>
                      </div>
                      <span class="text-xs font-black uppercase tracking-widest">Click</span>
                  </div>
                   <div class="flex-1 p-4 border-2 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all flex flex-col items-center gap-2 group"
                       :class="{'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20': method === 'payme', 'border-slate-100 dark:border-slate-800': method !== 'payme'}"
                       @click="$emit('update:method', 'payme')">
                      <div class="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i class="pi pi-wallet text-2xl text-teal-500"></i>
                      </div>
                      <span class="text-xs font-black uppercase tracking-widest">Payme</span>
                   </div>
              </div>
          </div>
          
          <div class="bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 p-4 rounded-2xl text-xs font-medium border border-blue-100 dark:border-blue-900/30 flex gap-3 items-start">
              <i class="pi pi-info-circle mt-0.5"></i>
              <span>Bu test rejimi. "To'lash" tugmasini bosish orqali to'lov muvaffaqiyatli amalga oshirilgan deb hisoblanadi.</span>
          </div>
      </div>

      <template #footer>
          <div class="flex gap-3 w-full pt-2">
            <Button :label="$t('common.cancel')" text class="flex-1 !rounded-xl" @click="$emit('update:visible', false)" />
            <Button :label="$t('subscription.pay_action' || 'To\'lash')" icon="pi pi-check" severity="success" class="flex-1 !rounded-xl shadow-lg shadow-emerald-500/20" :loading="loading" @click="$emit('process')" />
          </div>
      </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: Boolean,
  header: String,
  plan: String,
  priceLabel: String,
  method: String,
  loading: Boolean
})

defineEmits(['update:visible', 'update:method', 'process'])
</script>
