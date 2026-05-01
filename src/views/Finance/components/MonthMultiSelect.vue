<template>
  <div class="relative min-w-[200px]" v-outside-click="() => isOpen = false">
    <!-- Trigger -->
    <button
      @click="isOpen = !isOpen"
      class="w-full h-10 px-4 flex items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all group overflow-hidden"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <i class="pi pi-calendar-plus text-[12px] text-slate-400 group-hover:text-emerald-500 transition-colors"></i>
        <span class="text-sm font-black tracking-wider text-slate-700 dark:text-slate-200 truncate">
          {{ label }}
        </span>
      </div>
      <i 
        class="pi pi-chevron-down text-[10px] text-slate-300 dark:text-slate-600 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute top-full left-0 right-0 mt-2 z-[999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 px-1">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ $t('finance.months') }}</span>
          <button 
            @click="toggleAll" 
            class="text-[10px] font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest transition-colors"
          >
            {{ isAllSelected ? $t('common.reset') : $t('common.all') }}
          </button>
        </div>

        <!-- Months Grid -->
        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="(month, idx) in monthNames"
            :key="idx"
            @click="toggleMonth(idx + 1)"
            class="h-9 rounded-lg text-[11px] font-black tracking-widest transition-all border flex items-center justify-center relative overflow-hidden"
            :class="isSelected(idx + 1)
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'"
          >
            {{ month }}
            <!-- Selection Indicator Dot -->
            <div 
              v-if="isSelected(idx + 1)" 
              class="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/50"
            ></div>
          </button>
        </div>

        <!-- Quick Info -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
          <span class="text-[9px] font-bold text-slate-400 italic tracking-tight">
            {{ selectedCountLabel }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const monthNames = computed(() => {
  let currentLocale = (locale.value || 'uz').replace('_', '-')
  
  // Handle specific non-standard tags like uz-cy
  if (currentLocale === 'uz-cy') currentLocale = 'uz-Cyrl'
  
  try {
    const formatter = new Intl.DateTimeFormat(currentLocale, { month: 'short' })
    return Array.from({ length: 12 }, (_, i) => {
      const name = formatter.format(new Date(2024, i, 1))
      return name.replace(/\./g, '').toUpperCase()
    })
  } catch (e) {
    // Fallback to standard 'uz' if the locale is still invalid
    const fallbackFormatter = new Intl.DateTimeFormat('uz', { month: 'short' })
    return Array.from({ length: 12 }, (_, i) => {
      const name = fallbackFormatter.format(new Date(2024, i, 1))
      return name.replace(/\./g, '').toUpperCase()
    })
  }
})

const selectedArray = computed(() => {
  if (!props.modelValue) return []
  return props.modelValue.split(',').map(Number).filter(n => !isNaN(n))
})

const label = computed(() => {
  if (selectedArray.value.length === 0) return t('finance.months')
  if (selectedArray.value.length === 12) return t('common.all')
  if (selectedArray.value.length > 3) return `${selectedArray.value.length} ${t('common.month').toLowerCase()}`
  
  return selectedArray.value
    .sort((a, b) => a - b)
    .map(m => monthNames.value[m - 1])
    .join(', ')
})

const selectedCountLabel = computed(() => {
  return `${selectedArray.value.length} ${t('common.month').toLowerCase()} ${t('subscription.tanlangan').toLowerCase()}`
})
const isAllSelected = computed(() => selectedArray.value.length === 12)

const isSelected = (m) => selectedArray.value.includes(m)

const toggleMonth = (m) => {
  let arr = [...selectedArray.value]
  if (arr.includes(m)) {
    arr = arr.filter(x => x !== m)
  } else {
    arr.push(m)
  }
  emit('update:modelValue', arr.sort((a, b) => a - b).join(','))
}

const toggleAll = () => {
  if (isAllSelected.value) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', '1,2,3,4,5,6,7,8,9,10,11,12')
  }
}

// Directive for outside click
const vOutsideClick = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>
