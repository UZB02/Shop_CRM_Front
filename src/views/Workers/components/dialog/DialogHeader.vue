<template>
  <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
        <i :class="isEdit ? 'pi pi-user-edit' : 'pi pi-user-plus'" class="text-2xl"></i>
      </div>
      <div>
        <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
          {{ isEdit ? 'Xodimni Tahrirlash' : "Yangi Xodim Qo'shish" }}
        </h2>
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
          {{ isEdit ? "Xodim ma'lumotlarini yangilash" : 'Tizimga yangi mutaxassisni biriktirish' }}
        </p>
      </div>
    </div>
    <button
      class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      @click="$emit('close')"
    >
      <i class="pi pi-times text-sm"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isEdit: Boolean,
})
defineEmits(['close'])
</script>
