<template>
  <Card class="border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden" 
        :class="[
          cardClass,
          {'ring-2 ring-emerald-500': isCurrent}
        ]">
    <template #header v-if="popular">
        <div class="bg-emerald-500 text-white text-center py-1 text-xs font-bold uppercase tracking-wider">Eng Ommabop</div>
    </template>
    <template #content>
      <div class="text-center p-4">
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{{ plan }}</h3>
        <div class="my-4">
          <span class="text-3xl font-bold text-emerald-600">{{ priceLabel }}</span>
          <span class="text-slate-500">/oy</span>
        </div>
        <ul class="text-left space-y-3 mb-8 text-slate-600 dark:text-slate-400 text-sm">
           <li v-for="feature in features" :key="feature" class="flex items-center gap-2">
             <i class="pi pi-check text-emerald-500"></i> {{ feature }}
           </li>
        </ul>
        <Button v-if="isCurrent && plan === 'free'" label="Tanlangan" disabled outlined class="w-full" />
        <Button v-else-if="isCurrent" label="Joriy Tarif" :severity="buttonSeverity" class="w-full" @click="$emit('extend')" />
        <Button v-else :label="plan === 'free' ? 'O\'tish' : 'Sotib Olish'" :severity="buttonSeverity" :outlined="plan !== 'standard'" class="w-full" @click="$emit('select')" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'

const props = defineProps({
  plan: String,
  priceLabel: String,
  features: Array,
  isCurrent: Boolean,
  popular: Boolean,
  cardClass: String,
  buttonSeverity: {
    type: String,
    default: 'success'
  }
})

defineEmits(['select', 'extend'])
</script>
