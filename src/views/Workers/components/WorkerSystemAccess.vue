<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
      <span class="w-4 h-4 rounded bg-amber-500/10 flex items-center justify-center">
        <i class="pi pi-shield text-amber-500" style="font-size:9px"></i>
      </span>
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.system_access_permissions').toUpperCase() }}</span>
    </div>
    <div class="p-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">

      <!-- Left: Login credentials -->
      <div class="space-y-3">
        <!-- Enable login toggle -->
        <div class="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div>
            <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200">{{ $t('workers.form.system_access') }}</p>
            <p class="text-[10px] text-slate-400">{{ $t('workers.form.create_login_desc') }}</p>
          </div>
          <button @click="$emit('update:createLogin', !createLogin)"
            class="w-10 h-5 rounded-full transition-all relative shrink-0"
            :class="createLogin ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'">
            <span class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
              :class="createLogin ? 'left-5' : 'left-0.5'"></span>
          </button>
        </div>

        <template v-if="createLogin">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.username') }}</label>
            <InputText v-model="worker.username" class="sr-input w-full" placeholder="username" />
          </div>
          <div v-if="!worker.id">
            <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.password') }}</label>
            <Password v-model="worker.password" toggleMask :feedback="false"
              inputClass="sr-input !pl-10 w-full" class="w-full" placeholder="••••••••" />
          </div>
        </template>

        <div v-if="!createLogin" class="flex flex-col items-center justify-center py-8 opacity-40 text-center">
          <i class="pi pi-lock text-3xl text-slate-300 block mb-2"></i>
          <p class="text-xs text-slate-400">{{ $t('workers.form.login_disabled') }}</p>
        </div>
      </div>

      <!-- Right: Permissions grid (no scroll) -->
      <div v-if="createLogin && !isManager">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('workers.form.permissions') }}</span>
            <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[11px] font-black">
              {{ worker.permissions?.length || 0 }}/{{ PERMISSIONS_LIST.length }}
            </span>
          </div>
          <button @click="toggleAll"
            class="text-[11px] font-black transition-all hover:opacity-80"
            :class="allSelected ? 'text-rose-400' : 'text-emerald-500'">
            {{ allSelected ? $t('workers.form.unselect_all') : $t('workers.form.select_all') }}
          </button>
        </div>

        <!-- 2-column permissions grid -->
        <div class="grid grid-cols-2 gap-1.5">
          <button v-for="perm in PERMISSIONS_LIST" :key="perm.value"
            @click="togglePerm(perm.value)"
            class="flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all"
            :class="isSelected(perm.value)
              ? 'bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'">
            <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
              :class="isSelected(perm.value)
                ? 'bg-emerald-500'
                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'">
              <i v-if="isSelected(perm.value)" class="pi pi-check text-white" style="font-size:9px"></i>
              <i v-else :class="perm.icon" class="text-slate-400" style="font-size:9px"></i>
            </div>
            <span class="text-[12px] font-semibold truncate"
              :class="isSelected(perm.value)
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-300'">
              {{ $t('workers.permissions_list.' + perm.value + '.label') }}
            </span>
          </button>
        </div>
      </div>

      <div v-else-if="!isManager" class="flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
        <p class="text-xs text-slate-400 py-6">{{ $t('workers.form.permissions_on_login') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const isManager = computed(() => {
  const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
  return role === 'manager'
})

defineProps({
  worker: Object,
  createLogin: Boolean,
  PERMISSIONS_LIST: Array,
  allSelected: Boolean,
  isSelected: Function,
  togglePerm: Function,
  toggleAll: Function
})
defineEmits(['update:createLogin'])
</script>
