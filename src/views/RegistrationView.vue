<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
    <!-- Card -->
    <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 relative z-10">

      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center gap-3 mb-4">
          <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i class="pi pi-star-fill text-white text-2xl"></i>
          </div>
          <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            Sirius <span class="text-emerald-500 italic">POS</span>
          </span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Yangi akkaunt yarating</p>
      </div>

      <!-- Form Content -->
      <div class="space-y-5">
        <!-- Error Alert -->
        <Transition name="slide-down">
          <div v-if="errorMessage"
               class="flex items-start gap-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-lg text-sm mb-4">
            <i class="pi pi-exclamation-triangle mt-0.5 flex-shrink-0"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <!-- Grid for Names -->
        <div class="grid grid-cols-2 gap-4">
          <FieldGroup label="Ism" icon="pi-user" required>
            <InputText v-model.trim="form.first_name" placeholder="Odamcha" class="sr-input"
                       :class="{ '!border-rose-500': submitted && !form.first_name }" />
          </FieldGroup>
          <FieldGroup label="Familiya" icon="pi-user" required>
            <InputText v-model.trim="form.last_name" placeholder="Familiyacha" class="sr-input"
                       :class="{ '!border-rose-500': submitted && !form.last_name }" />
          </FieldGroup>
        </div>

        <!-- Username -->
        <FieldGroup 
          label="Foydalanuvchi nomi" 
          icon="pi-at" 
          required 
          help-text="Ushbu nom tizimga kirish uchun login sifatida ishlatiladi. U unikal bo'lishi shart."
        >
          <InputText v-model.trim="form.username" placeholder="username" class="sr-input"
                     :class="{ '!border-rose-500': submitted && !form.username }" />
        </FieldGroup>

        <!-- Phone -->
        <FieldGroup label="Telefon raqami" icon="pi-phone" required>
          <InputMask v-model="form.phone1" mask="+999999999999" placeholder="+998" class="sr-input"
                     :class="{ '!border-rose-500': submitted && !form.phone1 }" />
        </FieldGroup>

        <!-- Email -->
        <FieldGroup label="Elektron pochta" icon="pi-envelope">
          <InputText v-model.trim="form.email" type="email" placeholder="misol@gmail.com" class="sr-input" />
        </FieldGroup>

        <!-- Password Grid -->
        <div class="grid grid-cols-2 gap-4">
          <FieldGroup label="Parol" icon="pi-lock" required>
            <Password v-model="form.password" :feedback="false" toggleMask placeholder="••••••••" 
                      class="w-full" inputClass="sr-input" :class="{ 'p-invalid': submitted && !form.password }" />
          </FieldGroup>
          <FieldGroup label="Tasdiqlash" icon="pi-lock" required>
            <Password v-model="form.password2" :feedback="false" toggleMask placeholder="••••••••" 
                      class="w-full" inputClass="sr-input" :class="{ 'p-invalid': submitted && !form.password2 }" />
          </FieldGroup>
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          class="w-full mt-4 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          :disabled="loading"
          @click="handleRegister"
        >
          <i v-if="loading" class="pi pi-spinner animate-spin"></i>
          {{ loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish" }}
        </button>

        <div class="text-center mt-6 text-sm">
          <span class="text-slate-500">Akkauntingiz bormi? </span>
          <router-link to="/login" class="text-emerald-500 font-medium hover:underline">Kirish</router-link>
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
  props: { label: String, icon: String, required: Boolean, helpText: String },
  setup(props, { slots }) {
    const isVisible = ref(false)
    
    // Close tooltip when clicking outside
    const closeTooltip = () => { isVisible.value = false }
    
    return () => h('div', { class: 'flex flex-col gap-1.5' }, [
      h('label', { class: 'text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-1.5' }, [
        h('i', { class: `pi ${props.icon || 'pi-circle'} text-[11px]` }),
        h('span', null, props.label),
        props.required ? h('span', { class: 'text-rose-400' }, '*') : null,
        
        // Custom Tooltip
        props.helpText ? h('div', { 
          class: 'group/tooltip relative ml-auto',
          onClick: (e) => e.stopPropagation() // Prevent bubbling
        }, [
          // The Icon
          h('span', { 
            class: `w-4 h-4 rounded-full flex items-center justify-center cursor-help transition-all border text-[11px] font-black ${
              isVisible.value 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'bg-slate-800 text-slate-500 border-slate-700 group-hover/tooltip:bg-emerald-500/10 group-hover/tooltip:text-emerald-400 group-hover/tooltip:border-emerald-500/30'
            }`,
            onClick: () => { isVisible.value = !isVisible.value }
          }, '!'),
          
          // The Tooltip Window
          h('div', { 
            class: [
              'absolute bottom-full right-0 mb-2 w-56 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl text-[12px] text-slate-600 dark:text-slate-300 font-medium normal-case tracking-normal leading-relaxed transition-all duration-200 z-50 pointer-events-none',
              isVisible.value 
                ? 'opacity-100 visible translate-y-0' 
                : 'opacity-0 invisible translate-y-1 md:group-hover/tooltip:opacity-100 md:group-hover/tooltip:visible md:group-hover/tooltip:translate-y-0'
            ]
          }, [
            h('div', { class: 'relative' }, [
              h('i', { class: 'pi pi-info-circle text-emerald-500 dark:text-emerald-400 mr-1.5 text-[12px]' }),
              props.helpText,
              // Arrow
              h('div', { class: 'absolute -bottom-4 right-1 border-[6px] border-transparent border-t-slate-200 dark:border-t-slate-700' }),
              h('div', { class: 'absolute -bottom-[15px] right-1 border-[6px] border-transparent border-t-white dark:border-t-slate-900' }),
            ])
          ])
        ]) : null,
      ]),
      slots.default?.(),
    ])
  },
})

import { onMounted, onUnmounted } from 'vue'

const handleGlobalClick = () => {
  // This is a simple way since FieldGroup is inline
  // If we had many, we'd use a store or event bus
  // But for this registration page, it's efficient enough
  document.querySelectorAll('.group\\/tooltip').forEach(() => {
    // In this specific case, Vue's reactivity handles it if we manage it correctly
  })
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})
onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick)
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
.slide-down-enter-active { animation: slidedown 0.25s ease; }
.slide-down-leave-active { animation: slidedown 0.2s reverse ease; }
@keyframes slidedown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>


