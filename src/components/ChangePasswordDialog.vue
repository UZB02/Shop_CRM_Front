<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
        
        <!-- Modal -->
        <Transition name="scale">
          <div v-if="visible" class="relative w-full max-w-[400px] bg-white dark:bg-[#0F172A] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-2xl flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/50">
              <div class="flex flex-col">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Parolni yangilash</h3>
                <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Xavfsizlik sozlamalari</p>
              </div>
              <button 
                class="flex items-center justify-center text-slate-400 hover:!text-slate-600 dark:hover:!text-white hover:bg-slate-100 dark:hover:bg-slate-800 w-8 h-8 rounded-full transition-all border-none bg-transparent cursor-pointer" 
                @click="close" 
              >
                <i class="pi pi-times text-sm"></i>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">
              <div class="flex flex-col gap-2 group">
                <label for="current_password" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Joriy parol</label>
                <div class="relative">
                  <Password 
                    id="current_password" 
                    v-model="form.current_password" 
                    :feedback="false" 
                    toggleMask 
                    placeholder="••••••••"
                    class="w-full"
                    inputClass="w-full !p-3.5 !pl-4 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-100 dark:!border-slate-700/50 focus:!border-emerald-500 dark:focus:!border-emerald-500/50 !text-slate-700 dark:!text-slate-200 transition-all"
                    :class="{ 'p-invalid': submitted && !form.current_password }"
                  />
                </div>
                <small v-if="submitted && !form.current_password" class="text-rose-500 text-[10px] font-semibold px-1">Joriy parolni kiritish shart</small>
              </div>

              <div class="flex flex-col gap-2 group">
                <label for="password" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Yangi parol</label>
                <Password 
                  id="password" 
                  v-model="form.password" 
                  toggleMask 
                  placeholder="••••••••"
                  class="w-full"
                  inputClass="w-full !p-3.5 !pl-4 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-100 dark:!border-slate-700/50 focus:!border-emerald-500 dark:focus:!border-emerald-500/50 !text-slate-700 dark:!text-slate-200 transition-all"
                  :class="{ 'p-invalid': submitted && !form.password }"
                  promptLabel="Parolni kiriting"
                  weakLabel="Zaif"
                  mediumLabel="O'rtacha"
                  strongLabel="Kuchli"
                />
                <small v-if="submitted && !form.password" class="text-rose-500 text-[10px] font-semibold px-1">Yangi parolni kiritish shart</small>
              </div>

              <div class="flex flex-col gap-2 group">
                <label for="password2" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Parolni tasdiqlash</label>
                <Password 
                  id="password2" 
                  v-model="form.password2" 
                  :feedback="false" 
                  toggleMask 
                  placeholder="••••••••"
                  class="w-full"
                  inputClass="w-full !p-3.5 !pl-4 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-100 dark:!border-slate-700/50 focus:!border-emerald-500 dark:focus:!border-emerald-500/50 !text-slate-700 dark:!text-slate-200 transition-all"
                  :class="{ 'p-invalid': submitted && (!form.password2 || form.password !== form.password2) }"
                />
                <small v-if="submitted && !form.password2" class="text-rose-500 text-[10px] font-semibold px-1">Tasdiqlash shart</small>
                <small v-else-if="submitted && form.password !== form.password2" class="text-rose-500 text-[10px] font-semibold px-1">Parollar mos kelmadi</small>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-6 bg-slate-50/50 dark:bg-slate-800/20 flex gap-3 border-t border-slate-100 dark:border-slate-800/50">
              <Button 
                label="Bekor qilish" 
                text 
                class="flex-1 font-bold text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 transition-all border border-slate-200 dark:border-slate-800 rounded-xl" 
                @click="close" 
              />
              <Button 
                label="Yangilash" 
                :loading="loading"
                class="flex-1 font-bold text-xs bg-emerald-500 hover:bg-emerald-600 !text-white border-none h-11 transition-all rounded-xl shadow-lg shadow-emerald-500/20" 
                @click="handleSubmit" 
              />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { authAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible'])

const toast = useToast()
const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  current_password: '',
  password: '',
  password2: ''
})

const close = () => {
  emit('update:visible', false)
  resetForm()
}

const resetForm = () => {
  form.current_password = ''
  form.password = ''
  form.password2 = ''
  submitted.value = false
}

const handleSubmit = async () => {
  submitted.value = true
  
  if (!form.current_password || !form.password || !form.password2 || form.password !== form.password2) {
    return
  }

  loading.value = true
  try {
    await authAPI.changePassword({
      current_password: form.current_password,
      password: form.password,
      password2: form.password2
    })
    
    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyatli',
      detail: 'Parolingiz muvaffaqiyatli yangilandi',
      life: 3000
    })
    
    close()
  } catch (error) {
    console.error('Password change error:', error)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: error.response?.data?.detail || error.response?.data?.message || 'Parolni yangilashda xatolik yuz berdi',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Handle ESC key to close
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

const handleEsc = (e) => {
  if (e.key === 'Escape') close()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

:deep(.p-password-input) {
  width: 100%;
}
</style>
