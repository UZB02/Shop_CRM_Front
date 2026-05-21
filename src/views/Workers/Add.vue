<template>
  <div class="font-inter">

    <!-- TOP NAV BAR -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button @click="router.back()"
          class="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition-all shadow-sm">
          <i class="pi pi-arrow-left text-xs"></i>
        </button>
        <div>
          <p class="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
            <router-link :to="{ name:'workers' }" class="hover:text-emerald-500 transition-colors">{{ $t('workers.title') }}</router-link>
            <i class="pi pi-angle-right text-[9px]"></i>
            <span>{{ isEdit ? $t('workers.actions.edit') : $t('workers.new_worker') }}</span>
          </p>
          <h1 class="text-sm font-black text-slate-800 dark:text-white leading-none">{{ isEdit ? $t('workers.actions.edit') : $t('workers.actions.add') }}</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <router-link :to="{ name:'workers' }"
          class="h-8 px-4 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center">
          {{ $t('common.cancel') }}
        </router-link>
        <button @click="handleSave" :disabled="saving"
          class="h-8 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-1.5">
          <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'" class="text-[10px]"></i>
          {{ $t('common.save_worker') }}
        </button>
      </div>
    </div>

    <!-- MAIN GRID: Left (wide) | Right (compact sticky) -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

      <!-- ══════════════ LEFT COLUMN ══════════════ -->
      <div class="space-y-3">

        <!-- ① Shaxsiy ma'lumotlar -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-emerald-500/10 flex items-center justify-center">
              <i class="pi pi-user text-emerald-500" style="font-size:9px"></i>
            </span>
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.personal_info').toUpperCase() }}</span>
          </div>
          <div class="p-4 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.first_name') }} <span class="text-rose-500">*</span></label>
              <InputText v-model.trim="worker.first_name" class="sr-input w-full"
                :class="{'!border-rose-400': submitted && !worker.first_name}" placeholder="Alisher" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.last_name') }} <span class="text-rose-500">*</span></label>
              <InputText v-model.trim="worker.last_name" class="sr-input w-full"
                :class="{'!border-rose-400': submitted && !worker.last_name}" placeholder="Navoiy" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.phone1') }} <span class="text-rose-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">+998</span>
                <InputText v-model="worker.phone1" class="sr-input w-full !pl-12" maxlength="9" inputmode="numeric"
                  @input="worker.phone1 = worker.phone1.replace(/\D/g,'').slice(0,9)" placeholder="901234567" />
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.phone2') }}</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">+998</span>
                <InputText v-model="worker.phone2" class="sr-input w-full !pl-12" maxlength="9" inputmode="numeric"
                  @input="worker.phone2 = worker.phone2.replace(/\D/g,'').slice(0,9)" placeholder="901234567" />
              </div>
            </div>
            <div class="col-span-2">
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.email') }} <span class="text-rose-500">*</span></label>
              <InputText v-model.trim="worker.email" class="sr-input w-full"
                :class="{'!border-rose-400': submitted && !worker.email}" placeholder="email@example.com" />
            </div>
          </div>
        </div>

        <!-- ② Ish faoliyati -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center">
              <i class="pi pi-briefcase text-blue-500" style="font-size:9px"></i>
            </span>
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.work_info').toUpperCase() }}</span>
          </div>
          <div class="p-4 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.branch') }} <span class="text-rose-500">*</span></label>
              <Select v-model="worker.branch" :options="branches" optionLabel="name" optionValue="id"
                size="small" class="sr-select w-full !text-sm"
                :class="{'!border-rose-400': submitted && !worker.branch}" :placeholder="$t('common.choose')" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.role') }}</label>
              <Select v-model="worker.role" :options="localizedRoles" optionLabel="label" optionValue="value"
                size="small" class="sr-select w-full !text-sm" @change="onRoleChange" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.salary') }}</label>
              <InputNumber v-model="worker.salary" mode="decimal" class="sr-number w-full"
                inputClass="!text-emerald-500 !font-black !text-sm !py-2" placeholder="0" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.status') }}</label>
              <Select v-model="worker.status" :options="localizedStatuses" optionLabel="label" optionValue="value"
                size="small" class="sr-select w-full !text-sm" />
            </div>
          </div>
        </div>

        <!-- ③ Tizimga kirish + Ruxsatlar (full width, no scroll) -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-amber-500/10 flex items-center justify-center">
              <i class="pi pi-shield text-amber-500" style="font-size:9px"></i>
            </span>
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.system_access_permissions').toUpperCase() }}</span>
          </div>
          <div class="p-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">

            <!-- Left: Login credentials -->
            <div class="space-y-3">
              <!-- Enable login toggle -->
              <div class="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200">{{ $t('workers.form.system_access') }}</p>
                  <p class="text-[10px] text-slate-400">{{ $t('workers.form.create_login_desc') }}</p>
                </div>
                <button @click="createLogin = !createLogin"
                  class="w-10 h-5 rounded-full transition-all relative shrink-0"
                  :class="createLogin ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'">
                  <span class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                    :class="createLogin ? 'left-5' : 'left-0.5'"></span>
                </button>
              </div>

              <template v-if="createLogin">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.username') }}</label>
                  <InputText v-model="worker.username" class="sr-input w-full" placeholder="username" />
                </div>
                <div v-if="!worker.id">
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.password') }}</label>
                  <Password v-model="worker.password" toggleMask :feedback="false"
                    inputClass="sr-input !pl-10 w-full" class="w-full" placeholder="••••••••" />
                </div>
              </template>

              <div v-if="!createLogin" class="flex flex-col items-center justify-center py-8 opacity-40 text-center">
                <i class="pi pi-lock text-3xl text-slate-300 block mb-2"></i>
                <p class="text-xs text-slate-400">{{ $t('workers.form.login_disabled') }}</p>
              </div>
            </div>

            <!-- Right: Permissions grid (no scroll) -->
            <div v-if="createLogin">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('workers.form.permissions') }}</span>
                  <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[11px] font-black">
                    {{ worker.permissions?.length || 0 }}/{{ PERMISSIONS_LIST.length }}
                  </span>
                </div>
                <button @click="toggleAll"
                  class="text-[11px] font-black transition-all hover:opacity-80"
                  :class="allSelected ? 'text-rose-400' : 'text-emerald-500'">
                  {{ allSelected ? $t('workers.form.unselect_all') : $t('workers.form.select_all') }}
                </button>
              </div>

              <!-- 2-column permissions grid -->
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="perm in PERMISSIONS_LIST" :key="perm.value"
                  @click="togglePerm(perm.value)"
                  class="flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all"
                  :class="isSelected(perm.value)
                    ? 'bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'">
                  <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                    :class="isSelected(perm.value)
                      ? 'bg-emerald-500'
                      : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'">
                    <i v-if="isSelected(perm.value)" class="pi pi-check text-white" style="font-size:9px"></i>
                    <i v-else :class="perm.icon" class="text-slate-400" style="font-size:9px"></i>
                  </div>
                  <span class="text-[12px] font-semibold truncate"
                    :class="isSelected(perm.value)
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300'">
                    {{ $t('workers.permissions_list.' + perm.value + '.label') }}
                  </span>
                </button>
              </div>
            </div>

            <div v-else class="flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-400 py-6">{{ $t('workers.form.permissions_on_login') }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- ══════════════ RIGHT COLUMN (sticky compact) ══════════════ -->
      <div class="hidden xl:flex flex-col gap-4 sticky top-4 self-start">

        <!-- Profile preview -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <span class="w-5 h-5 rounded-md bg-violet-500/10 flex items-center justify-center">
              <i class="pi pi-eye text-violet-500" style="font-size:10px"></i>
            </span>
            <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 tracking-widest">{{ $t('workers.form.view').toUpperCase() }}</span>
          </div>
          <div class="p-4">
            <!-- Avatar + name -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center font-black text-sm text-white shadow-sm"
                :style="avatarStyle">
                <span v-if="worker.first_name || worker.last_name">
                  {{ (worker.first_name?.[0]||'').toUpperCase() }}{{ (worker.last_name?.[0]||'').toUpperCase() }}
                </span>
                <i v-else class="pi pi-user text-base"></i>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-black text-slate-800 dark:text-white truncate">
                  {{ [worker.first_name, worker.last_name].filter(Boolean).join(' ') || $t('workers.form.avatar_fallback') }}
                </p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[11px] text-slate-400 capitalize">{{ worker.role }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span class="text-[11px] flex items-center gap-1"
                    :class="worker.status==='active' ? 'text-emerald-500' : 'text-slate-400'">
                    <span class="w-1.5 h-1.5 rounded-full"
                      :class="worker.status==='active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                    {{ getStatusLabel }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Checklist -->
            <div class="space-y-1.5">
              <div v-for="row in checklist" :key="row.key"
                class="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                :class="row.done ? 'bg-emerald-50 dark:bg-emerald-500/5' : 'bg-slate-50 dark:bg-slate-800/30'">
                <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  :class="row.done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'">
                  <i class="pi pi-check text-white" style="font-size:8px"></i>
                </div>
                <span class="text-[11px] flex-1"
                  :class="row.done ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'">
                  {{ row.label }}
                </span>
                <span v-if="row.done && row.value" class="text-[10px] text-slate-400 truncate max-w-[80px]">{{ row.value }}</span>
              </div>
            </div>

            <!-- Progress -->
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] font-bold text-slate-400">{{ $t('workers.form.ready') }}</span>
                <span class="text-[11px] font-black" :class="fillPercent===100 ? 'text-emerald-500' : 'text-blue-400'">{{ fillPercent }}%</span>
              </div>
              <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                  :class="fillPercent===100 ? 'bg-emerald-500' : 'bg-blue-400'"
                  :style="{ width: fillPercent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRaw, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import InputText   from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Password    from 'primevue/password'
import Select      from 'primevue/select'
import { workersAPI, branchesAPI } from '@/services/api'
import { useNotificationStore } from '@/store/notifications'
import { ROLE_PERMISSIONS, WORKER_ROLES, WORKER_STATUSES, PERMISSIONS_LIST } from './composables/useWorkerForm'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const notificationStore = useNotificationStore()

const workerId = computed(() => route.params.id)
const isEdit = computed(() => !!workerId.value)

const worker = ref({
  first_name:'', last_name:'', username:'', email:'',
  phone1:'', phone2:'', password:'',
  role:'seller', salary:0, branch:null,
  status:'active', permissions:[...ROLE_PERMISSIONS.seller]
})
const branches    = ref([])
const saving      = ref(false)
const submitted   = ref(false)
const createLogin = ref(true)

const localizedRoles    = computed(() => WORKER_ROLES.map(r => ({ ...r, label: t(`workers.roles.${r.value}`) })))
const localizedStatuses = computed(() => WORKER_STATUSES.map(s => ({ ...s, label: t(`workers.statuses.${s.value}`) })))

const getStatusLabel = computed(() => {
  return localizedStatuses.value.find(s => s.value === worker.value.status)?.label || worker.value.status
})

const onRoleChange = (e) => {
  if (ROLE_PERMISSIONS[e.value]) worker.value.permissions = [...ROLE_PERMISSIONS[e.value]]
}

// Permissions helpers
const isSelected  = (val) => worker.value.permissions?.includes(val) ?? false
const allSelected = computed(() => PERMISSIONS_LIST.every(p => isSelected(p.value)))
const togglePerm  = (val) => {
  if (!Array.isArray(worker.value.permissions)) worker.value.permissions = []
  const idx = worker.value.permissions.indexOf(val)
  if (idx === -1) worker.value.permissions.push(val)
  else worker.value.permissions.splice(idx, 1)
}
const toggleAll = () => {
  worker.value.permissions = allSelected.value ? [] : PERMISSIONS_LIST.map(p => p.value)
}

// Avatar
const avatarColors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4']
const avatarStyle  = computed(() => {
  const c = avatarColors[(worker.value.first_name?.charCodeAt(0) || 0) % avatarColors.length]
  return { background: `linear-gradient(135deg, ${c}99, ${c})` }
})

// Fill progress
const fillPercent = computed(() => {
  const f = [worker.value.first_name, worker.value.last_name, worker.value.email, worker.value.phone1, worker.value.branch, worker.value.role]
  return Math.round(f.filter(Boolean).length / f.length * 100)
})

// Right panel checklist
const checklist = computed(() => [
  { key:'name',    label: t('workers.form.checklist_name'), done: !!(worker.value.first_name && worker.value.last_name), value: `${worker.value.first_name} ${worker.value.last_name}`.trim() },
  { key:'email',   label: t('workers.form.checklist_email'), done: !!worker.value.email,  value: worker.value.email },
  { key:'phone',   label: t('workers.form.checklist_phone'), done: !!worker.value.phone1, value: worker.value.phone1 ? `+998${worker.value.phone1}` : null },
  { key:'branch',  label: t('workers.form.checklist_branch'), done: !!worker.value.branch, value: null },
  { key:'login',   label: t('workers.form.checklist_login'), done: !!(createLogin.value && worker.value.username), value: worker.value.username },
])

const loadWorker = async () => {
  try {
    const res = await workersAPI.getById(workerId.value)
    const fullData = res.data
    let firstName = fullData.first_name || ''
    let lastName = fullData.last_name || ''
    if (!firstName && !lastName && fullData.full_name) {
        const parts = fullData.full_name.trim().split(' ')
        firstName = parts[0] || ''
        lastName = parts.slice(1).join(' ') || ''
    }
    worker.value = {
        id: fullData.id || fullData._id,
        first_name: firstName,
        last_name: lastName,
        email: fullData.email || '',
        phone1: (fullData.phone1 || fullData.phone || '').replace(/\D/g, '').slice(-9),
        phone2: (fullData.phone2 || '').replace(/\D/g, '').slice(-9),
        role: fullData.role || 'seller',
        branch: fullData.branch_id || fullData.branch?.id || fullData.branch?._id || fullData.branch || null,
        status: fullData.status || 'active',
        salary: parseFloat(fullData.salary) || 0,
        username: fullData.username || '',
        password: '',
        permissions: fullData.permissions || [],
    }
    createLogin.value = !!(fullData.user || fullData.userId || fullData.username)
  } catch (err) {
    console.error('Error loading worker details:', err)
    toast.add({ severity:'error', summary: t('common.error'), detail: t('workers.messages.load_error') })
  }
}

onMounted(async () => {
  try {
    const res = await branchesAPI.getAll()
    branches.value = res.data?.results ?? (Array.isArray(res.data) ? res.data : [])
  } catch(e) { console.error(e) }

  if (isEdit.value) {
    await loadWorker()
  }
})

const handleSave = async () => {
  submitted.value = true
  const w = worker.value
  if (!w.first_name?.trim() || !w.last_name?.trim() || !w.email?.trim() || !w.branch) return
  if (createLogin.value && (w.username?.trim().length ?? 0) < 5) {
    toast.add({ severity:'error', summary: t('common.error'), detail: t('workers.messages.username_min_length'), life:5000 })
    return
  }
  saving.value = true
  try {
    let phone1 = ''
    if (w.phone1) { const d = String(w.phone1).replace(/\D/g,''); phone1 = '+998'+(d.length>=9?d.slice(-9):d) }
    
    let phone2 = ''
    if (w.phone2) { const d = String(w.phone2).replace(/\D/g,''); phone2 = '+998'+(d.length>=9?d.slice(-9):d) }

    const payload = {
      first_name: w.first_name.trim(),
      last_name: w.last_name.trim(),
      username: w.username?.trim()||'',
      email: w.email?.trim()||'',
      phone1,
      phone2,
      role: w.role,
      salary: Number(w.salary)||0,
      status: w.status,
      branch: w.branch,
      permissions: createLogin.value ? [...toRaw(w.permissions||[])] : []
    }
    if (w.password) payload.password = w.password

    if (isEdit.value) {
      await workersAPI.update(workerId.value, payload)
      toast.add({ severity:'success', summary: t('common.updated'), detail: t('workers.messages.updated', { name: `${w.first_name} ${w.last_name}` }), life:4000 })
    } else {
      await workersAPI.create(payload)
      toast.add({ severity:'success', summary: t('common.added'), detail: t('workers.messages.added'), life:4000 })
    }
    notificationStore.fetchSubscription()
    router.push({ name:'workers' })
  } catch(error) {
    let msg = t('workers.messages.save_error')
    const d = error.response?.data
    if (d) { if (typeof d==='string') msg=d; else { const k=Object.keys(d)[0]; if(k){const v=d[k]; msg=Array.isArray(v)?v[0]:v} } }
    toast.add({ severity:'error', summary: t('common.error'), detail: msg, life:5000 })
  } finally { saving.value = false }
}
</script>

<style scoped>
/* 
  PrimeVue components (Select, InputNumber, InputText) have global styles 
  with '!important' padding in main.css. Here we override them locally 
  using scoped :deep() selectors to make the entire form perfectly uniform and compact.
*/
:deep(.sr-input) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  border-radius: 0.75rem !important;
  height: 38px !important;
}

:deep(.p-select.sr-select),
:deep(.p-select) {
  border-radius: 0.75rem !important;
  height: 38px !important;
  min-height: 38px !important;
}

:deep(.p-select-label) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  line-height: 1.4 !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

:deep(.sr-number) {
  border-radius: 0.75rem !important;
  height: 38px !important;
}

:deep(.p-inputnumber-input),
:deep(.p-inputnumber .p-inputtext) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  height: 100% !important;
}

:deep(.p-select-option) {
  font-size: 0.825rem !important;
  padding: 0.4rem 0.75rem !important;
}
</style>
