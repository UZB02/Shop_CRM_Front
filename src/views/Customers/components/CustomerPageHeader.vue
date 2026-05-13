<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard" class="text-[12px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-home text-[11px]"></i>
          {{ $t('menu.dashboard') }}
        </router-link>
        <i class="pi pi-chevron-right text-[10px] text-slate-300"></i>
        <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">{{ $t('customers.title') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('customers.management_title') || 'Mijozlar Boshqaruvi' }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ totalRecords }} {{ $t('customers.subtitle') }}</p>
    </div>
    
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
      <div class="relative group/search w-full md:w-[260px]">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] transition-colors group-focus-within/search:text-emerald-500"></i>
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text" 
          :placeholder="$t('customers.search_placeholder')" 
          class="w-full h-10 sm:h-9 pl-9 pr-4 text-[13px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all outline-none"
        />
      </div>
      
      <div class="grid grid-cols-2 sm:flex sm:items-center gap-2">
        <button 
          @click="$emit('download-template')"
          :disabled="templateLoading"
          class="h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i :class="templateLoading ? 'pi pi-spin pi-spinner' : 'pi pi-download'" class="text-[12px]"></i>
          <span class="hidden sm:inline">{{ $t('reports.download_template') }}</span>
          <span class="sm:hidden">Shablon</span>
        </button>

        <!-- Import Button -->
        <div v-if="canImport" class="relative">
          <input 
            type="file" 
            accept=".xlsx" 
            hidden 
            ref="fileInput" 
            @change="handleFileChange" 
          />
          <button
            @click="triggerFileInput"
            :disabled="importing"
            class="w-full h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-900/10 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i :class="importing ? 'pi pi-spin pi-spinner' : 'pi pi-upload'" class="text-[12px]"></i>
            <span class="hidden sm:inline">{{ $t('reports.import_btn') }}</span>
            <span class="sm:hidden">Import</span>
          </button>
        </div>

        <button 
          @click="$router.push('/dashboard/customers/groups')"
          class="h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <i class="pi pi-users text-[12px]"></i>
          <span class="hidden sm:inline">{{ $t('customers.groups_btn') }}</span>
          <span class="sm:hidden">Guruhlar</span>
        </button>

        <button 
          @click="$emit('add')"
          class="h-10 sm:h-9 px-3 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-lg shadow-emerald-500/20"
        >
          <i class="pi pi-plus text-[12px]"></i>
          <span>{{ $t('customers.new_customer') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  totalRecords: { type: Number, default: 0 },
  searchQuery: { type: String, default: '' },
  templateLoading: { type: Boolean, default: false },
  importing: { type: Boolean, default: false },
  canImport: { type: Boolean, default: false }
})
const emit = defineEmits(['update:searchQuery', 'add', 'download-template', 'import'])

const fileInput = ref(null)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '' 
    fileInput.value.click()
  }
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    emit('import', file)
  }
}
</script>


