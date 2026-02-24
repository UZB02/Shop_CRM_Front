<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" :header="header" :style="{width: '450px'}" :modal="true">
      <div class="flex flex-col gap-4">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
              <p class="text-sm text-slate-500 mb-1">Tanlangan Tarif:</p>
              <p class="font-bold text-lg capitalize">{{ plan }}</p>
              <p class="text-emerald-600 font-bold mt-2">{{ priceLabel }}</p>
          </div>

          <div class="field">
              <label class="block font-medium mb-2">To'lov Turi</label>
              <div class="flex gap-4">
                  <div class="flex-1 p-3 border rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors flex flex-col items-center gap-2"
                       :class="{'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20': method === 'click'}"
                       @click="$emit('update:method', 'click')">
                      <i class="pi pi-credit-card text-2xl text-blue-500"></i>
                      <span class="text-sm font-medium">Click</span>
                  </div>
                   <div class="flex-1 p-3 border rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors flex flex-col items-center gap-2"
                       :class="{'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20': method === 'payme'}"
                       @click="$emit('update:method', 'payme')">
                      <i class="pi pi-wallet text-2xl text-teal-500"></i>
                      <span class="text-sm font-medium">Payme</span>
                   </div>
              </div>
          </div>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm">
              <i class="pi pi-info-circle mr-2"></i>
              Bu test rejimi. "To'lash" tugmasini bosish orqali to'lov muvaffaqiyatli amalga oshirilgan deb hisoblanadi.
          </div>
      </div>

      <template #footer>
          <Button label="Bekor qilish" text @click="$emit('update:visible', false)" />
          <Button label="To'lash" icon="pi pi-check" severity="success" :loading="loading" @click="$emit('process')" />
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
