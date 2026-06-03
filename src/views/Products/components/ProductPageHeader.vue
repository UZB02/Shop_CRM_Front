<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">Mahsulotlar</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ $t('products.subtitle', { count: totalProducts }) }}</p>
    </div>
    <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 shrink-0">
      <button
        @click="$emit('download-template')"
        :disabled="templateLoading"
        class="h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i :class="templateLoading ? 'pi pi-spin pi-spinner' : 'pi pi-download'" class="text-[12px]"></i>
        <span class="hidden sm:inline">{{ $t('reports.download_template') }}</span>
        <span class="sm:hidden">Shablon</span>
      </button>

      <button
        v-if="settingsStore.hasPlanExport"
        @click="$emit('export-stocks')"
        class="h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-file-excel text-[12px]"></i>
        <span class="hidden sm:inline">{{ $t('common.export') }}</span>
        <span class="sm:hidden">Eksport</span>
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
        @click="router.push('/dashboard/products/categories')"
        class="h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-folder text-[12px]"></i>
        <span class="hidden sm:inline">{{ $t('categories.title') }}</span>
        <span class="sm:hidden">Kategoriyalar</span>
      </button>

      <!-- ✅ has_promotion: faqat tarif ruxsat bersa ko'rinadi -->
      <button
        v-if="settingsStore.hasPlanPromotion"
        @click="router.push('/dashboard/products/promotions')"
        class="h-10 sm:h-9 px-3 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-percentage text-[12px]"></i>
        <span class="hidden sm:inline">Aksiyalar</span>
        <span class="sm:hidden">Aksiyalar</span>
      </button>

      <button
        @click="notificationStore.canAddProduct ? router.push('/dashboard/products/create') : null"
        v-tooltip.bottom="limitTooltip"
        class="h-10 sm:h-9 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-lg shadow-emerald-500/20"
        :class="[
          notificationStore.canAddProduct 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
        ]"
      >
        <i :class="notificationStore.canAddProduct ? 'pi pi-plus' : 'pi pi-lock'" class="text-[12px]"></i>
        <span>{{ $t('products.new_product') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notifications'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const router = useRouter()
const notificationStore = useNotificationStore()
const settingsStore = useSettingsStore()

const limitTooltip = computed(() => {
  if (notificationStore.canAddProduct) return null
  const p = notificationStore.usage?.products
  if (!p) return null
  return t('subscription.limit_reached', { used: p.used, limit: p.limit })
})

defineProps({
  totalProducts: Number,
  templateLoading: { type: Boolean, default: false },
  importing: { type: Boolean, default: false },
  canImport: { type: Boolean, default: false }
})
const emit = defineEmits(['add-category', 'add-product', 'export-stocks', 'download-template', 'import'])

const fileInput = ref(null)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '' // Natijani tozalash uchun, xuddi shu faylni qayta tanlaganda ham trigger bo'lishi kerak
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


