<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
    <!-- Left Column: Primary Status & Coupon -->
    <div class="lg:col-span-12 xl:col-span-4 flex flex-col gap-4">
      <PrimaryStatusCard :subscription="subscription" />
    </div>

    <!-- Middle Column: Limits & Billing -->
    <div class="lg:col-span-6 xl:col-span-4 flex flex-col gap-4">
      <UsageLimitsCard />
      <BalanceSummaryCard :subscription="subscription" :coupons="coupons" />
    </div>

    <!-- Right Column: Features Grid -->
    <div class="lg:col-span-6 xl:col-span-4 flex flex-col gap-4">
      <FeaturesGridCard :subscription="subscription" />
    </div>
  </div>
</template>

<script setup>
import PrimaryStatusCard from './PrimaryStatusCard.vue'
import UsageLimitsCard from './UsageLimitsCard.vue'
import BalanceSummaryCard from './BalanceSummaryCard.vue'
import FeaturesGridCard from './FeaturesGridCard.vue'

defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({})
  },
  coupons: {
    type: Array,
    default: () => []
  }
})

defineEmits(['coupon-applied'])
</script>
