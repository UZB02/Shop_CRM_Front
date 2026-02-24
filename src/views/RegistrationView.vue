<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">

    <!-- Background ambient glows -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg relative z-10">

      <!-- Card -->
      <div class="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl shadow-black/50 overflow-hidden">

        <!-- Header -->
        <div class="px-8 pt-8 pb-6 text-center border-b border-slate-800">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <i class="pi pi-shop text-emerald-400 text-2xl"></i>
          </div>
          <h1 class="text-2xl font-black text-white tracking-tight">Shop Searem</h1>
          <p class="text-slate-400 text-sm mt-1">Yangi akkaunt yarating</p>
        </div>

        <!-- Form -->
        <div class="px-8 py-7 space-y-5">

          <!-- Error Alert -->
          <Transition name="slide-down">
            <div v-if="errorMessage"
                 class="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
              <i class="pi pi-exclamation-triangle mt-0.5 flex-shrink-0"></i>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Row 1: first_name + last_name -->
          <div class="grid grid-cols-2 gap-4">
            <FieldGroup label="Ism" icon="pi-user" required>
              <InputText v-model.trim="form.first_name"
                         placeholder="Odamcha"
                         class="w-full reg-input"
                         :class="{ 'border-rose-500/50': submitted && !form.first_name }" />
            </FieldGroup>
            <FieldGroup label="Familiya" icon="pi-user" required>
              <InputText v-model.trim="form.last_name"
                         placeholder="Familiyacha"
                         class="w-full reg-input"
                         :class="{ 'border-rose-500/50': submitted && !form.last_name }" />
            </FieldGroup>
          </div>

          <!-- Row 2: username -->
          <FieldGroup label="Foydalanuvchi nomi" icon="pi-at" required>
            <InputText v-model.trim="form.username"
                       placeholder="anonimuser2"
                       class="w-full reg-input"
                       :class="{ 'border-rose-500/50': submitted && !form.username }"
                       autocomplete="username" />
          </FieldGroup>

          <!-- Row 3: phone1 -->
          <FieldGroup label="Telefon raqami" icon="pi-phone" required>
            <InputMask v-model="form.phone1"
                       mask="+999999999999"
                       placeholder="+998890000003"
                       class="w-full reg-input"
                       :class="{ 'border-rose-500/50': submitted && !form.phone1 }" />
          </FieldGroup>

          <!-- Row 4: email -->
          <FieldGroup label="Elektron pochta" icon="pi-envelope">
            <InputText v-model.trim="form.email"
                       type="email"
                       placeholder="anonim@gmail.com"
                       class="w-full reg-input" />
          </FieldGroup>

          <!-- Row 5: password + password2 -->
          <div class="grid grid-cols-2 gap-4">
            <FieldGroup label="Parol" icon="pi-lock" required>
              <Password v-model="form.password"
                        toggleMask
                        :feedback="false"
                        placeholder="••••••••"
                        class="w-full"
                        inputClass="w-full reg-input !pr-10"
                        :class="{ 'p-invalid': submitted && !form.password }"
                        autocomplete="new-password" />
            </FieldGroup>
            <FieldGroup label="Parolni tasdiqlang" icon="pi-lock" required>
              <Password v-model="form.password2"
                        toggleMask
                        :feedback="false"
                        placeholder="••••••••"
                        class="w-full"
                        inputClass="w-full reg-input !pr-10"
                        :class="{ 'p-invalid': submitted && !form.password2 }"
                        autocomplete="new-password" />
            </FieldGroup>
          </div>

          <!-- Submit -->
          <button
            type="button"
            class="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/35 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="handleRegister"
          >
            <i v-if="loading" class="pi pi-spinner animate-spin"></i>
            <i v-else class="pi pi-check-circle"></i>
            {{ loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish" }}
          </button>

          <!-- Login link -->
          <p class="text-center text-sm text-slate-500">
            Akkauntingiz bormi?
            <router-link to="/login" class="text-emerald-400 font-bold hover:text-emerald-300 transition-colors ml-1">
              Kirish →
            </router-link>
          </p>
        </div>

        <!-- Footer -->
        <div class="px-8 pb-6 text-center">
          <p class="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            <i class="pi pi-shield mr-1"></i>Ma'lumotlaringiz xavfsiz saqlanadi
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Password from 'primevue/password'
import { authAPI } from '@/services/api'

const router = useRouter()
const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const form = ref({
  username:   '',
  first_name: '',
  last_name:  '',
  phone1:     '',
  email:      '',
  password:   '',
  password2:  '',
})

// Inline helper component
const FieldGroup = defineComponent({
  props: { label: String, icon: String, required: Boolean },
  setup(props, { slots }) {
    return () => h('div', { class: 'flex flex-col gap-1.5' }, [
      h('label', { class: 'text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5' }, [
        h('i', { class: `pi ${props.icon || 'pi-circle'} text-[9px]` }),
        props.label,
        props.required ? h('span', { class: 'text-rose-400' }, '*') : null,
      ]),
      slots.default?.(),
    ])
  },
})

const handleRegister = async () => {
  submitted.value = true
  errorMessage.value = ''

  // Validation
  if (!form.value.first_name || !form.value.last_name || !form.value.username || !form.value.phone1
      || !form.value.password || !form.value.password2) {
    errorMessage.value = 'Majburiy maydonlarni to\'liq to\'ldiring'
    return
  }
  if (form.value.password !== form.value.password2) {
    errorMessage.value = 'Parollar mos kelmayapti'
    return
  }
  if (form.value.password.length < 6) {
    errorMessage.value = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
    return
  }

  loading.value = true
  try {
    const payload = {
      username:   form.value.username,
      password:   form.value.password,
      password2:  form.value.password2,
      first_name: form.value.first_name,
      last_name:  form.value.last_name,
      phone1:     form.value.phone1,
    }
    if (form.value.email) payload.email = form.value.email

    await authAPI.register(payload)
    router.push({ name: 'login', query: { registered: 'true' } })
  } catch (error) {
    const data = error.response?.data
    if (!data) { errorMessage.value = 'Server bilan ulanishda xatolik'; return }

    if (typeof data === 'string') { errorMessage.value = data; return }

    // Django field errors
    const fieldLabels = {
      username:   'Foydalanuvchi nomi',
      password:   'Parol',
      password2:  'Parol tasdiqi',
      first_name: 'Ism',
      last_name:  'Familiya',
      phone1:     'Telefon',
      email:      'Email',
      non_field_errors: '',
      detail: '',
    }
    const messages = Object.entries(data).map(([key, val]) => {
      const msg = Array.isArray(val) ? val[0] : val
      const label = fieldLabels[key] ?? key
      return label ? `${label}: ${msg}` : msg
    })
    errorMessage.value = messages.join(' | ')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reg-input {
  background: rgb(15 23 42 / 0.7) !important;
  border-color: rgb(51 65 85) !important;
  border-radius: 12px !important;
  height: 44px !important;
  color: white !important;
  font-size: 14px !important;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.reg-input:focus,
.reg-input.p-focus {
  border-color: rgb(16 185 129 / 0.6) !important;
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12) !important;
  outline: none !important;
}
.reg-input::placeholder { color: rgb(100 116 139); }

:deep(.p-password input) {
  background: rgb(15 23 42 / 0.7) !important;
  border-color: rgb(51 65 85) !important;
  border-radius: 12px !important;
  height: 44px !important;
  color: white !important;
  font-size: 14px !important;
}
:deep(.p-password input:focus) {
  border-color: rgb(16 185 129 / 0.6) !important;
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12) !important;
}
:deep(.p-password-toggle-icon) { color: rgb(100 116 139); }

:deep(.p-inputmask) {
  background: rgb(15 23 42 / 0.7) !important;
  border-color: rgb(51 65 85) !important;
  border-radius: 12px !important;
  height: 44px !important;
  color: white !important;
}

.slide-down-enter-active { animation: slidedown 0.25s ease; }
.slide-down-leave-active { animation: slidedown 0.2s reverse ease; }
@keyframes slidedown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
