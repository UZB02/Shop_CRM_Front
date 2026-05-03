<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
    <!-- Account Details -->
    <div class="profile-card">
      <div class="card-title-row">
        <div class="icon-box bg-indigo-500/10 text-indigo-500">
          <i class="pi pi-id-card"></i>
        </div>
        <div class="flex-1">
          <h3>Shaxsiy ma'lumotlar</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Bog'lanish ma'lumotlari</p>
        </div>
        <button 
          @click="$emit('toggle-edit')" 
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          :class="isEditing ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400'"
        >
          <i :class="['pi', isEditing ? 'pi-times' : 'pi-pencil', 'text-xs']"></i>
        </button>
      </div>

      <div class="card-content">
        <div class="info-row">
          <span class="label">Username</span>
          <p class="value">@{{ profile?.username }}</p>
        </div>

        <div class="info-row">
          <span class="label">Email manzil</span>
          <div v-if="isEditing" class="edit-input-wrap">
            <i class="pi pi-envelope"></i>
            <input v-model="form.email" placeholder="example@mail.com" />
          </div>
          <p v-else class="value">{{ profile?.email }}</p>
        </div>

        <div class="info-row">
          <span class="label">Asosiy telefon</span>
          <div v-if="isEditing" class="edit-input-wrap">
            <i class="pi pi-phone"></i>
            <InputMask v-model="form.phone1" mask="+999 (99) 999-99-99" placeholder="+998" />
          </div>
          <p v-else class="value">{{ profile?.phone1 }}</p>
        </div>

        <div class="info-row">
          <span class="label">Qo'shimcha telefon</span>
          <div v-if="isEditing" class="edit-input-wrap">
            <i class="pi pi-phone"></i>
            <InputMask v-model="form.phone2" mask="+999 (99) 999-99-99" placeholder="+998" />
          </div>
          <p v-else class="value">{{ profile?.phone2 || '—' }}</p>
        </div>
      </div>

      <!-- Edit Actions -->
      <Transition name="fade">
        <div v-if="isEditing" class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3">
          <button 
            @click="$emit('save')" 
            :disabled="saving"
            class="flex-1 h-11 rounded-lg bg-indigo-500 text-white text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
            <i v-else class="pi pi-check text-xs"></i>
            <span>SAQLASH</span>
          </button>
          <button 
            @click="$emit('toggle-edit')" 
            class="px-5 h-11 rounded-lg text-[13px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            BEKOR QILISH
          </button>
        </div>
      </Transition>
    </div>

    <!-- Workplace Details -->
    <div class="profile-card">
      <div class="card-title-row">
        <div class="icon-box bg-emerald-500/10 text-emerald-500">
          <i class="pi pi-briefcase"></i>
        </div>
        <div>
          <h3>Ish faoliyati</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tizimdagi status va joylashuv</p>
        </div>
      </div>
      <div class="card-content">
        <div class="info-row">
          <span class="label">Do'kon</span>
          <p class="value font-black text-indigo-500">{{ profile?.store_name }}</p>
        </div>
        <div class="info-row">
          <span class="label">Filial</span>
          <p class="value">{{ profile?.branch_name }}</p>
        </div>
        <div class="info-row">
          <span class="label">Oylik maosh</span>
          <p class="value text-emerald-600 font-black">{{ formatCurrency(profile?.salary) }}</p>
        </div>
        <div class="info-row">
          <span class="label">Tizimga kirgan sana</span>
          <p class="value">{{ profile?.created_on }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputMask from 'primevue/inputmask'

defineProps({ 
  profile: Object,
  isEditing: Boolean,
  form: Object,
  saving: Boolean
})

defineEmits(['toggle-edit', 'save'])

const formatCurrency = (val) => {
  if (!val) return '0 UZS'
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.profile-card {
  background-color: white;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem; /* Standardized to 12px / rounded-xl */
  padding: 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .profile-card {
  background-color: #0f172a;
  border-color: #1e293b;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-title-row h3 {
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.icon-box {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  border-bottom: 1px solid #f8fafc;
  padding-bottom: 1rem;
}
.dark .info-row {
  border-color: rgba(30, 41, 59, 0.5);
}
.info-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.info-row .label {
  display: block;
  font-size: 10px;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.375rem;
}

.info-row .value {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}
.dark .info-row .value {
  color: #f1f5f9;
}

.edit-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.edit-input-wrap i {
  position: absolute;
  left: 0.75rem;
  font-size: 0.75rem;
  color: #94a3b8;
  z-index: 10;
}

.edit-input-wrap input, 
.edit-input-wrap :deep(.p-inputtext) {
  width: 100% !important;
  height: 2.5rem !important;
  padding-left: 2.25rem !important;
  padding-right: 0.75rem !important;
  border-radius: 0.5rem !important;
  border-width: 2px !important;
  border-color: #f8fafc !important;
  background-color: rgba(248, 250, 252, 0.5) !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
  color: #334155 !important;
  outline: none !important;
  transition: all 0.2s !important;
}

.dark .edit-input-wrap input,
.dark .edit-input-wrap :deep(.p-inputtext) {
  background-color: rgba(30, 41, 59, 0.5) !important;
  border-color: #1e293b !important;
  color: #e2e8f0 !important;
}

.edit-input-wrap input:focus,
.edit-input-wrap :deep(.p-inputtext:focus) {
  border-color: #6366f1 !important;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
