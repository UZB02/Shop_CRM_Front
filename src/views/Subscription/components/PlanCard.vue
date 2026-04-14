<template>
  <div 
    class="relative group rounded-2xl p-6 transition-all duration-300 flex flex-col h-full border border-slate-100 dark:border-slate-800"
    :class="[
      cardClass,
      isCurrent 
        ? 'bg-slate-900 shadow-xl border-emerald-500/50' 
        : 'bg-white dark:bg-slate-900 hover:shadow-lg'
    ]"
  >
    <!-- Popular Badge -->
    <div v-if="popular" class="absolute -top-3 left-6 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md z-20">
      {{ $t('subscription.popular') }}
    </div>

    <!-- Plan Header (Utility Style) -->
    <div class="mb-6 flex flex-col items-start">
      <div 
        class="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        :class="getIconBgClass"
      >
        <i :class="[getPlanIcon, 'text-base text-white']"></i>
      </div>
      <h3 class="text-xs font-bold uppercase tracking-widest mb-1" :class="isCurrent ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'">
        {{ $t(`subscription.plans.${plan}`) }}
      </h3>
      <div class="flex items-baseline gap-1">
        <span class="text-2xl font-black tracking-tight" :class="isCurrent ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
          {{ priceLabel.split(' ')[0] }}
        </span>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ priceLabel.split(' ')[1] }} / {{ $t('subscription.per_month') }}</span>
      </div>
    </div>

    <!-- Plan Features (Compact List) -->
    <ul class="space-y-2 mb-6 flex-1">
      <li v-for="(feature, index) in features" :key="index" class="flex items-center gap-2">
        <i class="pi pi-check text-[9px] font-bold text-emerald-500"></i>
        <span class="text-[10px] font-medium leading-tight" :class="isCurrent ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'">
          {{ feature }}
        </span>
      </li>
    </ul>

    <!-- Action Buttons (Standard size) -->
    <div class="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
      <Button 
        v-if="!isCurrent"
        :label="plan === 'free' ? $t('subscription.otish') : $t('subscription.sotib_olish')" 
        :severity="isCurrent ? 'success' : 'primary'" 
        rounded 
        size="small"
        class="w-full !text-[10px] !font-bold !uppercase !tracking-widest"
        @click="$emit('select')"
      />
      
      <div v-else class="space-y-2 w-full">
         <div class="flex items-center justify-center gap-2 text-emerald-500 mb-1">
            <i class="pi pi-check-circle text-[10px]"></i>
            <span class="text-[9px] font-bold uppercase tracking-widest">{{ $t('subscription.current_plan') }}</span>
         </div>
         <Button 
            v-if="plan !== 'free'"
            :label="$t('subscription.uzaytirish')" 
            severity="success" 
            outlined 
            rounded 
            size="small"
            class="w-full !text-[10px] !font-bold !uppercase !tracking-widest"
            @click="$emit('extend')"
          />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import { computed } from 'vue'

const props = defineProps({
  plan: { type: String, required: true },
  priceLabel: { type: String, required: true },
  features: { type: Array, default: () => [] },
  isCurrent: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  cardClass: { type: String, default: '' },
  buttonSeverity: { type: String, default: 'primary' }
})

defineEmits(['select', 'extend'])

const getPlanIcon = computed(() => {
    switch(props.plan) {
        case 'free': return 'pi pi-compass'
        case 'standard': return 'pi pi-bolt'
        case 'premium': return 'pi pi-crown'
        default: return 'pi pi-star'
    }
})

const getIconBgClass = computed(() => {
    switch(props.plan) {
        case 'free': return 'bg-slate-500'
        case 'standard': return 'bg-emerald-500'
        case 'premium': return 'bg-amber-500'
        default: return 'bg-blue-500'
    }
})
</script>
