<template>
  <div class="profile-body profile-edit-body">
    <!-- Contact Info Section -->
    <div class="edit-section">
      <p class="edit-section-label">{{ $t('profile.edit_title') }}</p>
      <div class="edit-field">
        <label>{{ $t('profile.email') }}</label>
        <div class="input-wrap">
          <i class="pi pi-envelope input-ico"></i>
          <InputText
            :modelValue="modelValue.email"
            @update:modelValue="emit('update:modelValue', { ...modelValue, email: $event })"
            placeholder="email@example.com"
          />
        </div>
      </div>
      <div class="edit-row">
        <div class="edit-field">
          <label>Telefon 1</label>
          <div class="input-wrap">
            <i class="pi pi-phone input-ico"></i>
            <InputMask
              :modelValue="modelValue.phone1"
              @update:modelValue="emit('update:modelValue', { ...modelValue, phone1: $event })"
              mask="+999 (99) 999-99-99"
              placeholder="+998 __ ___-__-__"
            />
          </div>
        </div>
        <div class="edit-field">
          <label>Telefon 2</label>
          <div class="input-wrap">
            <i class="pi pi-phone input-ico"></i>
            <InputMask
              :modelValue="modelValue.phone2"
              @update:modelValue="emit('update:modelValue', { ...modelValue, phone2: $event })"
              mask="+999 (99) 999-99-99"
              placeholder="+998 __ ___-__-__"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="edit-divider"></div>

    <!-- Password Section -->
    <div class="edit-section">
      <p class="edit-section-label">
        <i class="pi pi-lock text-[10px]"></i>
        {{ $t('password_change.title') }}
      </p>
      <div class="edit-field">
        <label>{{ $t('password_change.current_password') }}</label>
        <Password
          :modelValue="modelValue.current_password"
          @update:modelValue="emit('update:modelValue', { ...modelValue, current_password: $event })"
          :feedback="false"
          toggleMask
          class="profile-pw-input"
        />
      </div>
      <div class="edit-row">
        <div class="edit-field">
          <label>{{ $t('password_change.new_password') }}</label>
          <Password
            :modelValue="modelValue.new_password"
            @update:modelValue="emit('update:modelValue', { ...modelValue, new_password: $event })"
            :feedback="false"
            toggleMask
            class="profile-pw-input"
          />
        </div>
        <div class="edit-field">
          <label>{{ $t('password_change.confirm_password') }}</label>
          <Password
            :modelValue="modelValue.new_password2"
            @update:modelValue="emit('update:modelValue', { ...modelValue, new_password2: $event })"
            :feedback="false"
            toggleMask
            class="profile-pw-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import InputMask from 'primevue/inputmask'

const props = defineProps({
  modelValue: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.profile-body { padding: 18px 20px; }
.profile-edit-body { display: flex; flex-direction: column; gap: 0; padding: 16px 20px; }
.edit-section { display: flex; flex-direction: column; gap: 10px; }
.edit-section-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #10b981;
  display: flex; align-items: center; gap: 5px;
  margin-bottom: 2px;
}
.edit-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }
.dark .edit-divider { background: #1e293b; }

.edit-field { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.edit-field label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94a3b8;
}
.edit-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.input-wrap { position: relative; }
.input-ico {
  position: absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #94a3b8;
  z-index: 1;
  pointer-events: none;
  transition: color 0.15s;
}
.input-wrap:focus-within .input-ico { color: #10b981; }

.input-wrap :deep(.p-inputtext),
.input-wrap :deep(input) {
  width: 100%;
  height: 38px;
  padding: 0 12px 0 32px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.15s;
  outline: none;
  box-shadow: none;
}
.dark .input-wrap :deep(.p-inputtext),
.dark .input-wrap :deep(input) {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}
.input-wrap :deep(.p-inputtext:focus),
.input-wrap :deep(input:focus) {
  background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
}
.dark .input-wrap :deep(.p-inputtext:focus),
.dark .input-wrap :deep(input:focus) {
  background: #0f172a;
  border-color: #10b981;
}

.profile-pw-input { width: 100%; }
.profile-pw-input :deep(.p-password-input) {
  width: 100%;
  height: 38px;
  padding: 0 36px 0 12px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.15s;
  outline: none;
  box-shadow: none;
}
.dark .profile-pw-input :deep(.p-password-input) {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}
.profile-pw-input :deep(.p-password-input:focus) {
  background: #fff;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
}
.dark .profile-pw-input :deep(.p-password-input:focus) {
  background: #0f172a;
}
.profile-pw-input :deep(.p-password) { width: 100%; }
.profile-pw-input :deep(.p-password-toggle-mask-icon) {
  color: #94a3b8;
  font-size: 12px;
}
</style>


