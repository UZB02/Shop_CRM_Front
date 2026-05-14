<template>
  <div
    class="plan-lock-overlay"
    :class="variant === 'banner' ? 'plan-lock-banner' : 'plan-lock-inline'"
  >
    <div class="plan-lock-inner">
      <i class="pi pi-lock plan-lock-icon"></i>
      <div class="plan-lock-text">
        <p class="plan-lock-title">{{ $t('plan.locked_feature') }}</p>
        <p v-if="hint" class="plan-lock-hint">{{ hint }}</p>
      </div>
      <router-link to="/subscription" class="plan-lock-btn">
        {{ $t('plan.upgrade_btn') }} 🔒
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** 'banner' — full-width banner | 'inline' — ichki qator badge */
  variant: { type: String, default: 'banner' },
  /** Qo'shimcha izoh matni (ixtiyoriy) */
  hint: { type: String, default: '' },
})
</script>

<style scoped>
.plan-lock-overlay {
  border-radius: 10px;
  background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
  overflow: hidden;
}
.dark .plan-lock-overlay {
  background: linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.06) 100%);
  border-color: rgba(251,191,36,0.2);
}

.plan-lock-banner {
  padding: 10px 16px;
}
.plan-lock-inline {
  padding: 7px 12px;
  display: inline-flex;
}

.plan-lock-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.plan-lock-icon {
  font-size: 14px;
  color: #f59e0b;
  flex-shrink: 0;
}

.plan-lock-text {
  flex: 1;
  min-width: 0;
}

.plan-lock-title {
  font-size: 12px;
  font-weight: 700;
  color: #92400e;
  line-height: 1.3;
}
.dark .plan-lock-title {
  color: #fbbf24;
}

.plan-lock-hint {
  font-size: 11px;
  color: #b45309;
  margin-top: 2px;
  line-height: 1.3;
}
.dark .plan-lock-hint {
  color: #d97706;
}

.plan-lock-btn {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 7px;
  background: #f59e0b;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  letter-spacing: 0.03em;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(245,158,11,0.3);
  flex-shrink: 0;
}
.plan-lock-btn:hover {
  background: #d97706;
  box-shadow: 0 4px 12px rgba(245,158,11,0.4);
}
</style>
