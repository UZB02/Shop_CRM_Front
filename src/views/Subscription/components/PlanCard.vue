<template>
  <div
    class="plan-card relative flex flex-col rounded-2xl overflow-hidden border h-full"
    :class="[
      isCurrent
        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/15 card-current'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm card-idle'
    ]"
  >
    <!-- Ambient glow (current / popular) -->
    <div
      v-if="popular || isCurrent"
      class="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-[90px] opacity-40"
      :class="isCurrent ? 'bg-emerald-400' : 'bg-amber-400'"
    />

    <!-- ─── POPULAR BADGE  (top-left ribbon, doesn't overlap anything) ─── -->
    <div
      v-if="popular"
      class="absolute top-0 left-0 z-30 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-br-xl shadow-md shadow-amber-500/30"
    >
      <i class="pi pi-bolt text-[8px]" />
      {{ $t('subscription.popular') }}
    </div>

    <!-- ══════════ HEADER ══════════ -->
    <div
      class="relative z-10 px-5 pb-4"
      :class="[
        popular ? 'pt-8' : 'pt-5',
        isCurrent ? 'border-b border-emerald-500/10' : 'border-b border-slate-100 dark:border-slate-800'
      ]"
    >
      <!-- Row 1: Icon + plan_type_display -->
      <div class="flex items-center gap-3 mb-2.5">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="iconBgClass"
        >
          <i :class="[planIcon, 'text-sm text-white']" />
        </div>

        <div class="flex-1 min-w-0">
          <!-- plan_type_display label -->
          <p
            class="text-[10px] font-black tracking-[0.18em] uppercase leading-none"
            :class="isCurrent ? 'text-emerald-400' : 'text-slate-400 dark:text-slate-500'"
          >
            {{ planData.plan_type_display || $t(`subscription.plans.${planData.plan_type}`) }}
          </p>

          <!-- Plan name -->
          <h3
            class="text-lg font-black leading-tight mt-0.5"
            :class="isCurrent ? 'text-white' : 'text-slate-900 dark:text-slate-100'"
          >
            {{ planData.name }}
          </h3>
        </div>

        <!-- Current plan indicator chip (top-right of icon row) -->
        <div
          v-if="isCurrent"
          class="flex-shrink-0 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-[9px] font-black text-emerald-400 tracking-wide whitespace-nowrap">
            {{ $t('subscription.current_plan') }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p
        v-if="planData.description"
        class="text-[11px] leading-relaxed mb-3"
        :class="isCurrent ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'"
      >
        {{ planData.description }}
      </p>

      <!-- Price block -->
      <div class="flex items-end gap-1.5 mt-1">
        <span
          class="text-[28px] font-black tracking-tight leading-none"
          :class="isCurrent ? 'text-white' : 'text-slate-900 dark:text-slate-100'"
        >
          {{ formattedPrice }}
        </span>
        <span
          class="text-[11px] font-semibold leading-none mb-0.5"
          :class="isCurrent ? 'text-slate-500' : 'text-slate-400'"
        >
          so'm&nbsp;<span class="opacity-55">/ {{ $t('subscription.monthly') }}</span>
        </span>
      </div>
    </div>

    <!-- ══════════ LIMITS ══════════ -->
    <div
      class="relative z-10 px-5 py-3"
      :class="isCurrent ? 'border-b border-emerald-500/10' : 'border-b border-slate-100 dark:border-slate-800'"
    >
      <p
        class="text-[9px] font-black uppercase tracking-[0.18em] mb-2"
        :class="isCurrent ? 'text-slate-500' : 'text-slate-400 dark:text-slate-600'"
      >
        {{ $t('subscription.limits.title') }}
      </p>

      <div class="grid grid-cols-2 gap-1.5">
        <div
          v-for="limit in limitItems"
          :key="limit.key"
          class="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
          :class="isCurrent ? 'bg-white/5' : 'bg-slate-50 dark:bg-slate-800/60'"
        >
          <i
            :class="[limit.icon, 'text-[11px] flex-shrink-0', isCurrent ? 'text-emerald-400' : 'text-emerald-500']"
          />
          <div class="min-w-0">
            <div
              class="text-[9px] font-semibold tracking-wide truncate leading-none mb-0.5"
              :class="isCurrent ? 'text-slate-500' : 'text-slate-400'"
            >
              {{ limit.label }}
            </div>
            <div
              class="text-[12px] font-black leading-none"
              :class="isCurrent ? 'text-white' : 'text-slate-800 dark:text-slate-100'"
            >
              {{ limit.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ FEATURES ══════════ -->
    <div class="relative z-10 px-5 py-3 flex-1">
      <p
        class="text-[9px] font-black uppercase tracking-[0.18em] mb-2"
        :class="isCurrent ? 'text-slate-500' : 'text-slate-400 dark:text-slate-600'"
      >
        {{ $t('subscription.features.title') }}
      </p>

      <div class="flex flex-col gap-1.5">
        <!-- Enabled -->
        <div
          v-for="(feat, i) in enabledFeatures"
          :key="'on-' + i"
          class="flex items-center gap-2"
        >
          <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/12">
            <i class="pi pi-check text-[8px] text-emerald-500" />
          </div>
          <span
            class="text-[11px] font-medium leading-none"
            :class="isCurrent ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'"
          >
            {{ feat }}
          </span>
        </div>

        <!-- Disabled (grey, strikethrough) -->
        <div
          v-for="(feat, i) in disabledFeatures"
          :key="'off-' + i"
          class="flex items-center gap-2 opacity-30"
        >
          <div
            class="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
            :class="isCurrent ? 'bg-white/5' : 'bg-slate-100 dark:bg-slate-800'"
          >
            <i class="pi pi-times text-[8px] text-slate-400" />
          </div>
          <span class="text-[11px] font-medium leading-none text-slate-400 line-through">
            {{ feat }}
          </span>
        </div>
      </div>
    </div>

    <!-- ══════════ ACTION ══════════ -->
    <div
      class="relative z-10 px-5 pt-3 pb-5"
      :class="isCurrent ? 'border-t border-emerald-500/10' : 'border-t border-slate-100 dark:border-slate-800'"
    >
      <!-- Extend (current, non-free) -->
      <button
        v-if="isCurrent && planData.plan_type !== 'free'"
        @click="$emit('extend')"
        class="w-full h-10 rounded-xl text-[11px] font-black tracking-wider flex items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 active:scale-95 transition-all duration-200"
      >
        <i class="pi pi-refresh text-[10px]" />
        <span>{{ $t('subscription.uzaytirish') }}</span>
      </button>

      <!-- Current free -->
      <div v-else-if="isCurrent && planData.plan_type === 'free'" class="text-center py-2">
        <span class="text-[11px] font-bold text-slate-400 tracking-widest italic opacity-60">
          {{ $t('subscription.current_plan') }}
        </span>
      </div>

      <!-- Select -->
      <button
        v-else
        @click="$emit('select')"
        class="w-full h-10 rounded-xl text-[11px] font-black tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all duration-200"
        :class="planData.plan_type === 'free'
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/20'"
      >
        <span>{{ planData.plan_type === 'free' ? $t('subscription.otish') : $t('subscription.sotib_olish') }}</span>
        <i class="pi pi-arrow-right text-[10px]" />
      </button>

      <!-- Yearly hint -->
      <p
        v-if="planData.price_yearly && planData.plan_type !== 'free'"
        class="text-center text-[10px] mt-2 font-medium"
        :class="isCurrent ? 'text-slate-500' : 'text-slate-400'"
      >
        {{ $t('subscription.yearly') }}:
        <span
          class="font-black"
          :class="isCurrent ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-500'"
        >
          {{ formattedYearlyPrice }} so'm
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  planData: { type: Object, required: true },
  isCurrent: { type: Boolean, default: false },
  popular: { type: Boolean, default: false }
})

defineEmits(['select', 'extend'])

// ── Price formatting ──────────────────────────────────────────────────────────

const fmt = (v) => new Intl.NumberFormat('uz-UZ').format(v ?? 0)

const formattedPrice = computed(() => fmt(props.planData?.price_monthly))
const formattedYearlyPrice = computed(() => fmt(props.planData?.price_yearly))

// ── Icon / bg ─────────────────────────────────────────────────────────────────

const planIcon = computed(() => {
  switch (props.planData?.plan_type) {
    case 'free':       return 'pi pi-compass'
    case 'trial':      return 'pi pi-calendar'
    case 'basic':
    case 'standard':   return 'pi pi-bolt'
    case 'pro':
    case 'premium':    return 'pi pi-star'
    case 'enterprise': return 'pi pi-crown'
    default:           return 'pi pi-bolt'
  }
})

const iconBgClass = computed(() => {
  if (props.isCurrent) return 'bg-emerald-500 shadow-md shadow-emerald-500/30'
  switch (props.planData?.plan_type) {
    case 'free':       return 'bg-slate-400 dark:bg-slate-600'
    case 'trial':      return 'bg-blue-500'
    case 'basic':
    case 'standard':   return 'bg-emerald-500'
    case 'pro':
    case 'premium':    return 'bg-indigo-500'
    case 'enterprise': return 'bg-amber-500'
    default:           return 'bg-slate-500'
  }
})

// ── Limits ────────────────────────────────────────────────────────────────────

const unlimited = computed(() => t('subscription.limits.unlimited'))

const limitItems = computed(() => {
  const p = props.planData
  if (!p) return []
  const isUnlimited = (v) => v == null || v === 0
  return [
    {
      key: 'branches',
      icon: 'pi pi-building',
      label: t('subscription.limits.max_branches'),
      value: isUnlimited(p.max_branches) ? unlimited.value : p.max_branches
    },
    {
      key: 'workers',
      icon: 'pi pi-users',
      label: t('subscription.limits.max_workers'),
      value: isUnlimited(p.max_workers) ? unlimited.value : p.max_workers
    },
    {
      key: 'products',
      icon: 'pi pi-box',
      label: t('subscription.limits.max_products'),
      value: isUnlimited(p.max_products) ? unlimited.value : fmt(p.max_products)
    },
    {
      key: 'warehouses',
      icon: 'pi pi-warehouse',
      label: t('subscription.limits.max_warehouses'),
      value: isUnlimited(p.max_warehouses) ? unlimited.value : p.max_warehouses
    }
  ]
})

// ── Features ──────────────────────────────────────────────────────────────────

const ALL_FEATURE_KEYS = [
  'has_subcategory', 'has_sale_return', 'has_wastage', 'has_stock_audit',
  'has_kpi', 'has_multi_currency', 'has_supplier', 'has_export',
  'has_dashboard', 'has_qr_bulk', 'has_audit_log', 'has_telegram',
  'has_shift', 'has_discount', 'has_receipt_design'
]

const enabledFeatures = computed(() =>
  ALL_FEATURE_KEYS.filter(k => !!props.planData?.[k]).map(k => t(`subscription.features.${k}`))
)

const disabledFeatures = computed(() =>
  ALL_FEATURE_KEYS.filter(k => !props.planData?.[k]).map(k => t(`subscription.features.${k}`))
)
</script>

<style scoped>
.plan-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease,
              border-color 0.3s ease;
}

/* Lift only non-current cards on hover */
.card-idle:hover {
  transform: translateY(-5px);
  border-color: rgb(52 211 153 / 0.3);
}
</style>
