<template>
  <div class="space-y-3">
    <label class="text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-widest ml-1">To'lov usuli</label>
    <div class="flex p-1 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800/50 gap-1 overflow-x-auto no-scrollbar">
      <button 
        v-for="method in methods" 
        :key="method.id"
        @click="$emit('update:paymentType', method.id)"
        class="flex-1 py-2.5 px-2 rounded-lg text-[11px] font-black tracking-wider transition-all duration-300 flex items-center justify-center gap-2 min-w-[80px]"
        :class="[
          paymentType === method.id 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-slate-800'
        ]"
      >
        <i :class="method.icon" class="text-[12px]"></i>
        {{ method.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  methods: Array,
  paymentType: String
})
defineEmits(['update:paymentType'])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


