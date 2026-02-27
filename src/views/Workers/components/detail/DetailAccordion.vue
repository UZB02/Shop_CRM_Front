<template>
  <div class="w-full">
    <Accordion :value="['0', '1']" multiple class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      
      <!-- Detailed Information Panel -->
      <AccordionPanel value="0" class="!border-none !bg-transparent">
        <AccordionHeader class="!bg-white dark:!bg-slate-900 !rounded-[1.5rem] !p-5 !border !border-slate-200 dark:!border-slate-800 shadow-sm transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner group-hover:scale-110 transition-transform">
              <i class="pi pi-id-card text-lg"></i>
            </div>
            <div class="text-left">
              <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ $t('workers.details') }}</h2>
              <p class="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{{ $t('workers.personal_info') }}</p>
            </div>
          </div>
        </AccordionHeader>
        <AccordionContent class="!bg-transparent !pt-4">
          <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
            <div class="grid grid-cols-2 gap-y-6 gap-x-8">
              <div v-for="item in detailItems" :key="item.label" class="group">
                <div class="flex items-center gap-1.5 mb-1.5">
                  <i v-if="item.icon" :class="['pi', item.icon, 'text-[8px] text-indigo-400']"></i>
                  <span class="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">{{ item.label }}</span>
                </div>
                <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-transparent shadow-sm truncate">
                  {{ item.value || '—' }}
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <!-- Permissions Panel -->
      <AccordionPanel value="1" class="!border-none !bg-transparent">
        <AccordionHeader class="!bg-white dark:!bg-slate-900 !rounded-[1.5rem] !p-5 !border !border-slate-200 dark:!border-slate-800 shadow-sm transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
              <i class="pi pi-shield text-lg"></i>
            </div>
            <div class="text-left">
              <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ $t('workers.permissions') }}</h2>
              <p class="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{{ $t('workers.user_permissions') }}</p>
            </div>
          </div>
        </AccordionHeader>
        <AccordionContent class="!bg-transparent !pt-4">
          <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
            <div class="flex flex-wrap gap-2">
              <div v-for="perm in worker?.permissions" :key="perm" 
                   class="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500/5 border border-slate-200/50 dark:border-slate-700/50 rounded-xl transition-all duration-300 group">
                <div class="w-5 h-5 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-emerald-500">
                  <i class="pi pi-check text-[8px]"></i>
                </div>
                <span class="text-[10px] font-black text-slate-700 dark:text-slate-300 capitalize tracking-wide">{{ perm }}</span>
              </div>
              
              <div v-if="!worker?.permissions?.length" class="w-full py-8 text-center">
                <i class="pi pi-lock text-xl text-slate-300 dark:text-slate-600 block mb-1"></i>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{{ $t('workers.no_permissions') }}</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { useWorkerDetail } from '../../composables/useWorkerDetail'

const props = defineProps({
  worker: Object
})

const { t } = useWorkerDetail()

const detailItems = computed(() => [
  { label: t('workers.full_name'), value: props.worker?.full_name, icon: 'pi-user' },
  { label: t('workers.username'), value: props.worker?.username, icon: 'pi-at' },
  { label: t('workers.email'), value: props.worker?.email, icon: 'pi-envelope' },
  { label: t('workers.phone'), value: props.worker?.phone1, icon: 'pi-phone' },
  { label: t('common.status'), value: props.worker?.status ? t(`workers.statuses.${props.worker.status}`) : '—', icon: 'pi-info-circle' },
  { label: t('workers.role'), value: props.worker?.role_display, icon: 'pi-briefcase' },
  { label: t('workers.branch'), value: props.worker?.branch_name, icon: 'pi-map-marker' },
])
</script>

<style scoped>
:deep(.p-accordionpanel) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-accordionheader) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-accordioncontent-content) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-accordionheader-toggle-icon) {
  color: #94a3b8;
}
</style>
