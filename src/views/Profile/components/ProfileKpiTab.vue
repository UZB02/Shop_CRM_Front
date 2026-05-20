<template>
  <div class="space-y-6 animate-fade-up">
    <!-- Main KPI Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="stat in mainStats" :key="stat.label" class="kpi-mini-card">
        <p class="label">{{ stat.label }}</p>
        <h4 class="value" :class="stat.color">{{ stat.value }}</h4>
        <div class="footer">
          <i :class="['pi', stat.icon]"></i>
          <span>{{ stat.sub }}</span>
        </div>
      </div>
    </div>

    <!-- Progress Card -->
    <div class="progress-container-card overflow-hidden relative">
      <div class="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
      
      <div class="relative flex flex-col md:flex-row items-center gap-12">
        <div class="flex-shrink-0 relative">
          <svg class="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100 dark:text-slate-800" />
            <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" 
              class="text-indigo-500 transition-all duration-1000"
              :stroke-dasharray="2 * Math.PI * 88"
              :stroke-dashoffset="2 * Math.PI * 88 * (1 - completionPct / 100)"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span class="text-4xl font-black text-slate-900 dark:text-white font-outfit">{{ completionPct }}%</span>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{{ $t('profile.kpi.completed') }}</span>
          </div>
        </div>

        <div class="flex-1 space-y-6 w-full">
          <div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white font-outfit mb-2">{{ $t('profile.kpi.target_title') }}</h3>
            <p class="text-slate-500 font-medium text-sm">{{ $t('profile.kpi.target_desc') }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-8">
            <div>
              <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{{ $t('profile.kpi.target_amount') }}</p>
              <p class="text-xl font-bold text-slate-800 dark:text-slate-200">{{ formatCurrency(kpi?.target_amount) }}</p>
            </div>
            <div>
              <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{{ $t('profile.kpi.net_sales') }}</p>
              <p class="text-xl font-bold text-emerald-500">{{ formatCurrency(kpi?.net_sales_amount) }}</p>
            </div>
          </div>

          <div v-if="kpi?.bonus_amount > 0" class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 animate-bounce-subtle">
            <div class="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <i class="pi pi-star-fill"></i>
            </div>
            <div>
              <p class="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">{{ $t('profile.kpi.bonus') }}</p>
              <p class="text-lg font-black text-slate-900 dark:text-white font-outfit">{{ formatCurrency(kpi?.bonus_amount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  kpi: Object
})

const completionPct = computed(() => parseFloat(props.kpi?.completion_pct || 0).toFixed(2))

const mainStats = computed(() => [
  { label: t('profile.kpi.sales_count'), value: props.kpi?.sales_count || 0, icon: 'pi-shopping-cart', sub: t('profile.kpi.sales_sub'), color: 'text-indigo-500' },
  { label: t('profile.kpi.avg_receipt'), value: formatCurrency(props.kpi?.avg_sale), icon: 'pi-ticket', sub: t('profile.kpi.avg_sub'), color: 'text-slate-800 dark:text-white' },
  { label: t('profile.kpi.returns'), value: props.kpi?.returns_count || 0, icon: 'pi-refresh', sub: formatCurrency(props.kpi?.returns_amount), color: 'text-rose-500' },
  { label: t('profile.kpi.period'), value: `${props.kpi?.year} / ${props.kpi?.month}`, icon: 'pi-calendar', sub: t('profile.kpi.period_sub'), color: 'text-slate-600' }
])

const formatCurrency = (val) => {
  if (!val) return '0 UZS'
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.kpi-mini-card {
  background-color: white;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem; /* Standardized to 12px / rounded-xl */
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .kpi-mini-card {
  background-color: #0f172a;
  border-color: #1e293b;
}

.kpi-mini-card .label {
  font-size: 10px;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.kpi-mini-card .value {
  font-size: 1.25rem;
  font-weight: 900;
  font-family: 'Outfit', sans-serif;
}

.kpi-mini-card .footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f8fafc;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}
.dark .kpi-mini-card .footer {
  border-color: rgba(30, 41, 59, 0.5);
}

.progress-container-card {
  background-color: white;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem; /* Standardized to 12px / rounded-xl */
  padding: 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .progress-container-card {
  background-color: #0f172a;
  border-color: #1e293b;
}

.animate-bounce-subtle {
  animation: bounceSubtle 3s infinite;
}
@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
