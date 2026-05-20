<template>
  <div class="security-main-card animate-fade-up">
    <div class="flex items-center gap-4 mb-10">
      <div class="icon-box-rose">
        <i class="pi pi-lock"></i>
      </div>
      <div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">{{ $t('password_change.title') }}</h3>
        <p class="text-sm text-slate-500 font-medium">{{ $t('password_change.subtitle') }}</p>
      </div>
    </div>

    <div class="max-w-2xl space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="space-y-2">
          <label class="field-label">{{ $t('password_change.current_password') }}</label>
          <ProfilePasswordInput 
            v-model="form.current_password" 
            icon="pi-shield" 
            :placeholder="$t('profile.security.current_ph')"
          />
        </div>
        
        <div class="space-y-2 md:col-start-1">
          <label class="field-label">{{ $t('password_change.new_password') }}</label>
          <ProfilePasswordInput 
            v-model="form.new_password" 
            icon="pi-key" 
            :placeholder="$t('profile.security.new_ph')"
          />
        </div>

        <div class="space-y-2">
          <label class="field-label">{{ $t('password_change.confirm_password') }}</label>
          <ProfilePasswordInput 
            v-model="form.new_password2" 
            icon="pi-check-circle" 
            :placeholder="$t('profile.security.confirm_ph')"
          />
        </div>
      </div>

      <div class="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end">
        <button 
          @click="$emit('save')" 
          :disabled="saving"
          class="save-password-btn"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-check-circle text-xs"></i>
          <span>{{ $t('password_change.update') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ProfilePasswordInput from './ProfilePasswordInput.vue'

const { t } = useI18n()

defineProps({
  form: Object,
  saving: Boolean
})
defineEmits(['save'])
</script>

<style scoped>
.security-main-card {
  background-color: white;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem;
  padding: 2.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .security-main-card {
  background-color: #0f172a;
  border-color: #1e293b;
}

.icon-box-rose {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 0.25rem;
}

.save-password-btn {
  height: 2.5rem;
  padding: 0 1.5rem;
  border-radius: 0.5rem;
  background-color: #0f172a;
  color: white;
  font-size: 0.875rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.1);
}
.dark .save-password-btn {
  background-color: #f1f5f9;
  color: #0f172a;
}
.save-password-btn:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
