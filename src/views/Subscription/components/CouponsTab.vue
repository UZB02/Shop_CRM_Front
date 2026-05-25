<template>
  <div v-if="loadingCoupons" class="flex flex-col gap-6 py-20 items-center justify-center">
    <i class="pi pi-spin pi-spinner text-3xl text-emerald-500"></i>
    <p class="text-xs font-bold text-slate-400 tracking-widest">{{ $t('common.loading') || 'Yuklanmoqda...' }}</p>
  </div>
  <div v-else class="space-y-6 animate-in">
    <div class="mb-4">
      <h2 class="text-sm font-black tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">{{ $t('subscription.coupons_title') }}</h2>
      <p class="text-[12px] text-slate-400 font-semibold tracking-widest mt-1">{{ $t('subscription.coupons_desc') }}</p>
    </div>

    <!-- 2-Column Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
      <!-- Left: Apply Coupon Form -->
      <div class="lg:col-span-4 space-y-4">
        <CouponCard @coupon-applied="$emit('coupon-applied')" />
      </div>

      <!-- Right: Applied Coupons List -->
      <div class="lg:col-span-8 flex flex-col gap-4">
        <!-- Empty State -->
        <div v-if="coupons.length === 0" class="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
            <i class="pi pi-ticket text-slate-300"></i>
          </div>
          <p class="text-[12px] font-bold text-slate-400 tracking-widest italic">{{ $t('subscription.no_coupons') }}</p>
        </div>

        <!-- Coupons Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(c, idx) in coupons" :key="idx" 
               class="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group min-h-[140px]">
              
            <!-- Ticket Dashed Border Deco (Left Side) -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800"></div>

            <div class="p-5 pl-7 flex-1 flex flex-col justify-between">
              <!-- Header Section -->
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 shadow-sm group-hover:scale-105 transition-transform">
                      <i class="pi pi-ticket text-[10px]"></i>
                      {{ c.code }}
                    </span>
                  </div>
                  <p class="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5">
                    {{ c.type_display || "Chegirma" }}
                  </p>
                </div>

                <!-- Glowy Discount Value -->
                <div class="text-right">
                  <p class="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {{ formatDiscountValue(c) }}
                  </p>
                </div>
              </div>

              <!-- Divider -->
              <div class="my-4 border-t border-dashed border-slate-100 dark:border-slate-800"></div>

              <!-- Bottom Info -->
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <i class="pi pi-calendar-plus text-[10px]"></i>
                  <span class="text-[10px] font-bold tracking-wider uppercase">{{ c.applied_at }}</span>
                </div>
                
                <!-- Note pill if present -->
                <span v-if="c.note" class="text-[9px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-500/20 max-w-[120px] truncate" v-tooltip.bottom="c.note">
                  {{ c.note }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coupons Pagination -->
        <div v-if="couponsCount > couponsPageSize" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-50 dark:border-slate-800/50 mt-4">
          <p class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
            {{ $t('subscription.showing_coupons', { 
              start: (couponsPage - 1) * couponsPageSize + 1, 
              end: Math.min(couponsPage * couponsPageSize, couponsCount), 
              total: couponsCount 
            }) }}
          </p>
          <Paginator
            :rows="couponsPageSize"
            :totalRecords="couponsCount"
            :first="(couponsPage - 1) * couponsPageSize"
            @page="onCouponsPageChange"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            class="!bg-transparent !border-none !p-0 custom-paginator"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Paginator from 'primevue/paginator'
import CouponCard from './CouponCard.vue'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  loadingCoupons: {
    type: Boolean,
    default: false
  },
  coupons: {
    type: Array,
    default: () => []
  },
  couponsCount: {
    type: Number,
    default: 0
  },
  couponsPage: {
    type: Number,
    default: 1
  },
  couponsPageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['coupon-applied', 'update:couponsPage'])

const settingsStore = useSettingsStore()
const formatCurrency = (value) => settingsStore.formatPrice(value)

const formatDiscountValue = (coupon) => {
  if (!coupon || coupon.discount_value === undefined) return ''
  const val = parseFloat(coupon.discount_value)
  
  const typeKeys = [
    coupon.type,
    coupon.discount_type,
    coupon.coupon_type,
    coupon.type_display,
    coupon.discount_type_display
  ]
  
  const matches = (keywords) => {
    return typeKeys.some(v => {
      if (!v) return false
      const str = String(v).toLowerCase()
      return keywords.some(keyword => str.includes(keyword))
    })
  }

  if (matches(['percent', 'percentage', 'foiz', '%'])) {
    return `${val}%`
  }
  if (matches(['free_days', 'free-days', 'kun'])) {
    return `+${parseInt(coupon.discount_value)} kun`
  }
  return formatCurrency(coupon.discount_value)
}

const onCouponsPageChange = (event) => {
  emit('update:couponsPage', event.page + 1)
}
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
