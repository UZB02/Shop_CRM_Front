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
                <h3 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{{ $t('password_change.title') }}</h3>
                <p class="text-[12px] font-medium text-slate-400 dark:text-slate-500 tracking-widest mt-1">{{ workerName }}</p>
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
                <label for="current_password" class="text-[12px] font-bold text-slate-400 dark:text-slate-500 tracking-widest px-1">{{ $t('password_change.current_password') }}</label>
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
                <small v-if="submitted && !form.current_password" class="text-rose-500 text-[12px] font-semibold px-1">{{ $t('password_change.current_required') }}</small>
              </div>

              <div class="flex flex-col gap-2 group">
                <label for="password" class="text-[12px] font-bold text-slate-400 dark:text-slate-500 tracking-widest px-1">{{ $t('password_change.new_password') }}</label>
                <Password 
                  id="password" 
                  v-model="form.password" 
                  :feedback="false"
                  toggleMask 
                  placeholder="••••••••"
                  class="w-full"
                  inputClass="w-full !p-3.5 !pl-4 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-100 dark:!border-slate-700/50 focus:!border-emerald-500 dark:focus:!border-emerald-500/50 !text-slate-700 dark:!text-slate-200 transition-all"
                  :class="{ 'p-invalid': submitted && !form.password }"
                />
                <small v-if="submitted && !form.password" class="text-rose-500 text-[12px] font-semibold px-1">{{ $t('password_change.new_required') }}</small>
              </div>

              <div class="flex flex-col gap-2 group">
                <label for="password2" class="text-[12px] font-bold text-slate-400 dark:text-slate-500 tracking-widest px-1">{{ $t('password_change.confirm_password') }}</label>
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
                <small v-if="submitted && !form.password2" class="text-rose-500 text-[12px] font-semibold px-1">{{ $t('password_change.confirm_required') }}</small>
                <small v-else-if="submitted && form.password !== form.password2" class="text-rose-500 text-[12px] font-semibold px-1">{{ $t('password_change.mismatch') }}</small>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-6 bg-slate-50/50 dark:bg-slate-800/20 flex gap-3 border-t border-slate-100 dark:border-slate-800/50">
              <Button 
                :label="$t('common.cancel')" 
                text 
                class="flex-1 font-bold text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 transition-all border border-slate-200 dark:border-slate-800 rounded-xl" 
                @click="close" 
              />
              <Button 
                :label="$t('password_change.update')" 
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
import { workersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: { type: Boolean, default: false },
  workerId: { type: [String, Number], required: true },
  workerName: { type: String, default: '' }
})

const emit = defineEmits(['update:visible', 'success'])

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
  
  const payload = {
    current_password: form.current_password,
    password: form.password,
    password2: form.password2
  }
  
  console.log('Worker password change request:', {
    workerId: props.workerId,
    ...payload
  })

  try {
    await workersAPI.changePassword(props.workerId, payload)
    
    toast.add({
      severity: 'success',
      summary: t('password_change.success_title'),
      detail: t('password_change.success_message'),
      life: 5000
    })
    
    emit('success')
    close()
  } catch (error) {
    console.error('Worker password update error:', error)
    toast.add({
      severity: 'error',
      summary: t('password_change.error_title'),
      detail: error.response?.data?.detail || error.response?.data?.message || t('password_change.error_message'),
      life: 5000
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


