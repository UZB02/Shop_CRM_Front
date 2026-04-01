<template>
  <div class="profile-body">
    <div class="info-grid">
      <div class="info-item">
        <i class="pi pi-envelope info-icon"></i>
        <div class="info-content">
          <span class="info-label">{{ $t('profile.email') }}</span>
          <span class="info-value">{{ currentWorker?.email || user.email || '—' }}</span>
        </div>
      </div>
      <div class="info-item">
        <i class="pi pi-phone info-icon"></i>
        <div class="info-content">
          <span class="info-label">{{ $t('profile.contact') }} 1</span>
          <span class="info-value">{{ currentWorker?.phone1 || user.phone1 || '—' }}</span>
        </div>
      </div>
      <div class="info-item" v-if="currentWorker?.phone2 || user.phone2">
        <i class="pi pi-phone info-icon" style="color: #6366f1;background:rgba(99,102,241,0.08);"></i>
        <div class="info-content">
          <span class="info-label">{{ $t('profile.contact') }} 2</span>
          <span class="info-value">{{ currentWorker?.phone2 || user.phone2 }}</span>
        </div>
      </div>
      <div class="info-item">
        <i class="pi pi-building info-icon"></i>
        <div class="info-content">
          <span class="info-label">{{ $t('profile.workplace') }}</span>
          <span class="info-value">
            {{ currentWorker?.store_name || user.worker?.store_name || '—' }}
            <span v-if="currentWorker?.branch_name || user.worker?.branch_name" class="branch-tag">
              {{ currentWorker?.branch_name || user.worker?.branch_name }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: { type: Object, required: true },
  currentWorker: { type: Object, default: null }
})
</script>

<style scoped>
.profile-body { padding: 18px 20px; }

.info-grid { display: flex; flex-direction: column; gap: 4px; }
.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: transparent;
  transition: background 0.15s;
}
.info-item:hover { background: #f8fafc; }
.dark .info-item:hover { background: rgba(255,255,255,0.03); }

.info-icon {
  font-size: 13px;
  color: #10b981;
  width: 32px; height: 32px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(16,185,129,0.08);
  border-radius: 9px;
}
.info-content { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.info-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}
.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex; align-items: center; gap: 8px;
}
.dark .info-value { color: #e2e8f0; }

.branch-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 5px;
  background: #f1f5f9;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}
.dark .branch-tag { background: #1e293b; color: #94a3b8; }
</style>
