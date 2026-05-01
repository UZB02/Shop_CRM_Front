<template>
  <div 
    class="relative group rounded-3xl p-6 transition-all duration-500 flex flex-col h-full border overflow-hidden"
    :class="[
      isCurrent 
        ? 'bg-slate-900 border-emerald-500/30 shadow-2xl' 
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 shadow-sm hover:shadow-xl'
    ]"
  >
    <!-- Premium Glow Effects (Toned down) -->
    <div v-if="popular || isCurrent" class="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

    <!-- Popular Badge (More compact) -->
    <div v-if="popular" class="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full z-20 flex items-center gap-1 shadow-lg shadow-emerald-500/20">
      <i class="pi pi-bolt text-[9px]"></i>
      {{ $t('subscription.popular') }}
    </div>

    <!-- Card Header (More compact) -->
    <div class="relative z-10 mb-6 flex items-start gap-4">
      <div 
        class="w-11 h-11 rounded-1.5xl flex-shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
        :class="getIconBgClass"
      >
        <i :class="[getPlanIcon, 'text-lg text-white']"></i>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-[12px] font-black tracking-widest mb-1 truncate" :class="isCurrent ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'">
          {{ $t(`subscription.plans.${plan}`) }}
        </h3>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black tracking-tighter" :class="isCurrent ? 'text-white' : 'text-slate-900 dark:text-slate-100'">
            {{ priceLabel.split(' ')[0] }}
          </span>
          <span class="text-[11px] font-bold text-slate-400 tracking-widest">
            {{ priceLabel.split(' ')[1] }} <span class="opacity-50 font-medium">/ oy</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Current Plan Badge (Inline) -->
    <div v-if="isCurrent" class="mb-4 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/10 inline-flex items-center gap-1 z-10">
        <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
        <span class="text-[10px] font-black tracking-tighter text-emerald-500">{{ $t('subscription.current_plan') }}</span>
    </div>

    <!-- Features List (GRID for compactness) -->
    <div class="relative z-10 grid grid-cols-1 gap-x-3 gap-y-2 mb-8 flex-1">
      <div v-for="(feature, index) in features" :key="index" class="flex items-center gap-2 group/item">
        <i class="pi pi-check text-[9px] font-bold text-emerald-500 flex-shrink-0"></i>
        <span class="text-[12px] font-medium leading-none truncate transition-colors" :class="isCurrent ? 'text-slate-400 group-hover/item:text-slate-200' : 'text-slate-500 dark:text-slate-400 group-hover/item:text-slate-800 dark:group-hover/item:text-slate-200'">
          {{ feature }}
        </span>
      </div>
    </div>

    <!-- Action Button (Streamlined) -->
    <div class="relative z-10 pt-4 border-t border-slate-50 dark:border-slate-800/30">
      <button 
        v-if="!isCurrent"
        @click="$emit('select')"
        class="w-full h-10 rounded-xl text-[12px] font-black tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
        :class="plan === 'free' 
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700' 
          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20'"
      >
        <span>{{ plan === 'free' ? $t('subscription.otish') : $t('subscription.sotib_olish') }}</span>
        <i class="pi pi-arrow-right text-[10px]"></i>
      </button>
      
      <button 
        v-else-if="plan !== 'free'"
        @click="$emit('extend')"
        class="w-full h-10 rounded-xl text-[12px] font-black tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95"
      >
         <i class="pi pi-refresh text-[10px]"></i>
         <span>{{ $t('subscription.uzaytirish') }}</span>
      </button>
      
      <div v-else class="text-center py-2">
         <span class="text-[11px] font-bold text-slate-500 tracking-widest italic opacity-60">{{ $t('subscription.current_plan') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plan: { type: String, required: true },
  priceLabel: { type: String, required: true },
  features: { type: Array, default: () => [] },
  isCurrent: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  cardClass: { type: String, default: '' }
})

defineEmits(['select', 'extend'])

const getPlanIcon = computed(() => {
    switch(props.plan) {
        case 'free': return 'pi pi-compass'
        case 'trial': return 'pi pi-calendar'
        case 'standard': return 'pi pi-bolt'
        case 'premium': 
        case 'enterprise': return 'pi pi-crown'
        default: return 'pi pi-star'
    }
})

const getIconBgClass = computed(() => {
    if (props.isCurrent) return 'bg-emerald-500 shadow-md shadow-emerald-500/20'
    
    switch(props.plan) {
        case 'free': return 'bg-slate-100 dark:bg-slate-800 text-slate-400'
        case 'trial': return 'bg-blue-500'
        case 'standard': return 'bg-emerald-500'
        case 'enterprise': return 'bg-amber-500'
        default: return 'bg-slate-500'
    }
})
</script>

<style scoped>
.group:hover {
  transform: translateY(-4px);
}
</style>


