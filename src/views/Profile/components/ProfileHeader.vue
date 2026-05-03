<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
    <div class="flex items-center gap-4">
      <div class="avatar-box">
        <img v-if="profile?.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover" />
        <i v-else class="pi pi-user text-2xl"></i>
      </div>
      <div>
        <h1 class="text-xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">
          {{ profile?.full_name || '...' }}
        </h1>
        <div class="flex items-center gap-2 mt-1">
          <span class="role-tag">
            {{ profile?.role_display }}
          </span>
          <span class="text-slate-300 dark:text-slate-700 text-[10px]">•</span>
          <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400">
            @{{ profile?.username }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button 
        @click="$emit('edit')"
        class="edit-btn"
      >
        <i class="pi pi-pencil text-xs text-emerald-500"></i>
        <span>Tahrirlash</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  profile: Object
})
defineEmits(['edit'])
</script>

<style scoped>
.avatar-box {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem; /* Standardized to rounded-xl */
  background-color: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.role-tag {
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem; /* Standard sharp tag radius */
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.edit-btn {
  height: 2.5rem;
  padding: 0 1rem;
  border-radius: 0.5rem; /* Precise sharp radius for buttons */
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}
.dark .edit-btn {
  border-color: #1e293b;
  background-color: #1e293b;
  color: #cbd5e1;
}
.edit-btn:hover {
  background-color: #f8fafc;
}
.dark .edit-btn:hover {
  background-color: #334155;
}
</style>
