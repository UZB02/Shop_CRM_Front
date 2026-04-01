<template>
  <Teleport to="body">
    <Transition name="profile-fade">
      <div v-if="visible" class="profile-overlay" @mousedown.self="closeModal">
        <Transition name="profile-pop">
          <div v-if="visible" class="profile-card">

            <!-- ═══ HEADER ═══ -->
            <div class="profile-header">
              <div class="profile-identity">
                <div class="profile-avatar">
                  <img v-if="user.avatar_url" :src="user.avatar_url" alt="avatar" />
                  <i v-else class="pi pi-user"></i>
                  <span class="profile-status-dot"></span>
                </div>
                <div class="profile-name-block">
                  <h2 class="profile-name">{{ user.first_name }} {{ user.last_name }}</h2>
                  <div class="profile-meta">
                    <span class="profile-role">{{ user.worker?.role_display || 'User' }}</span>
                    <span class="profile-dot">·</span>
                    <span class="profile-id">@{{ user.username }}</span>
                  </div>
                </div>
              </div>
              <button class="profile-close" @click="closeModal">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="profile-divider"></div>

            <!-- ═══ VIEW MODE ═══ -->
            <ProfileInfo v-if="!isEditing"
              :user="user"
              :currentWorker="currentWorker"
            />

            <!-- ═══ EDIT MODE ═══ -->
            <ProfileEditForm v-else
              :modelValue="editForm"
              @update:modelValue="updateEditForm"
            />

            <div class="profile-divider"></div>

            <!-- ═══ ACTIONS ═══ -->
            <div class="profile-footer">
              <template v-if="!isEditing">
                <button class="btn-edit" @click="startEditing">
                  <i class="pi pi-pencil"></i>
                  {{ $t('common.edit') }}
                </button>
                <button class="btn-logout" @click="$emit('logout')" :title="$t('profile.logout')">
                  <i class="pi pi-power-off"></i>
                </button>
              </template>
              <template v-else>
                <button class="btn-cancel" @click="isEditing = false">{{ $t('common.cancel') }}</button>
                <button class="btn-save" @click="saveChanges" :disabled="saving">
                  <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-check"></i>
                  {{ $t('common.save') }}
                </button>
              </template>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, toRef } from 'vue'
import { useUserProfile } from '@/composables/useUserProfile'
import ProfileInfo from './Profile/ProfileInfo.vue'
import ProfileEditForm from './Profile/ProfileEditForm.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user:    { type: Object, required: true  }
})

const emit = defineEmits(['update:visible', 'logout', 'updated'])

// Pass user as a reactive ref so composable always gets the latest prop value
const userRef = toRef(props, 'user')

const {
  currentWorker,
  isEditing,
  saving,
  editForm,
  fetchMe,
  startEditing,
  saveChanges
} = useUserProfile(userRef, () => emit('updated'))

// Handle form updates from child component (proper v-model pattern)
const updateEditForm = (newVal) => {
  Object.assign(editForm, newVal)
}

watch(() => props.visible, (val) => {
  if (val) {
    fetchMe()
    document.addEventListener('keydown', onEsc)
  } else {
    isEditing.value = false
    document.removeEventListener('keydown', onEsc)
  }
})

const closeModal = () => emit('update:visible', false)
const onEsc = (e) => { if (e.key === 'Escape') closeModal() }
</script>

<style scoped>
/* ─── Overlay ─── */
.profile-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ─── Card ─── */
.profile-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.9) inset;
  overflow: hidden;
}
.dark .profile-card {
  background: #111827;
  border-color: rgba(255,255,255,0.06);
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
}

/* ─── Header ─── */
.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 18px;
}
.profile-identity { display: flex; align-items: center; gap: 14px; }
.profile-avatar {
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 20px;
}
.dark .profile-avatar { background: #1e293b; border-color: #334155; }
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-status-dot {
  position: absolute;
  bottom: 2px; right: 2px;
  width: 10px; height: 10px;
  background: #10b981;
  border: 2px solid #fff;
  border-radius: 50%;
}
.dark .profile-status-dot { border-color: #111827; }

.profile-name {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 5px;
  letter-spacing: -0.3px;
  line-height: 1;
}
.dark .profile-name { color: #f8fafc; }

.profile-meta { display: flex; align-items: center; gap: 6px; }
.profile-role {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
}
.profile-dot { color: #cbd5e1; font-size: 12px; }
.profile-id  { font-size: 11px; color: #64748b; font-weight: 600; }
.dark .profile-id { color: #94a3b8; }

.profile-close {
  width: 32px; height: 32px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  transition: all 0.15s;
}
.dark .profile-close { border-color: #334155; color: #64748b; }
.profile-close:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }
.dark .profile-close:hover { background: rgba(239,68,68,0.1); }

/* ─── Divider ─── */
.profile-divider { height: 1px; background: #f1f5f9; margin: 0; }
.dark .profile-divider { background: #1e293b; }

/* ─── Footer ─── */
.profile-footer {
  padding: 14px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-edit {
  flex: 1;
  height: 40px;
  border-radius: 12px;
  background: #0f172a;
  color: #ffffff;
  border: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.2s;
}
.dark .btn-edit { background: #f8fafc; color: #0f172a; }
.btn-edit:hover { background: #10b981; color: #fff; transform: translateY(-1px); box-shadow: 0 8px 20px -4px rgba(16,185,129,0.35); }
.dark .btn-edit:hover { background: #10b981; color: #fff; }

.btn-logout {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: transparent;
  color: #94a3b8;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}
.dark .btn-logout { border-color: #334155; }
.btn-logout:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }
.dark .btn-logout:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }

.btn-cancel {
  flex: 1;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.dark .btn-cancel { background: #1e293b; color: #64748b; }
.btn-cancel:hover { background: #e2e8f0; color: #475569; }
.dark .btn-cancel:hover { background: #334155; }

.btn-save {
  flex: 1.6;
  height: 40px;
  border-radius: 12px;
  background: #10b981;
  color: #fff;
  border: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.2s;
  box-shadow: 0 4px 14px -2px rgba(16,185,129,0.4);
}
.btn-save:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -4px rgba(16,185,129,0.45);
}
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Transitions ─── */
.profile-fade-enter-active, .profile-fade-leave-active { transition: opacity 0.25s ease; }
.profile-fade-enter-from, .profile-fade-leave-to { opacity: 0; }

.profile-pop-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.profile-pop-leave-active  { transition: all 0.2s ease; }
.profile-pop-enter-from    { opacity: 0; transform: scale(0.94) translateY(16px); }
.profile-pop-leave-to      { opacity: 0; transform: scale(0.97); }
</style>
