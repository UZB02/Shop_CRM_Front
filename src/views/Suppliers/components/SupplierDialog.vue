<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isEdit ? $t('suppliers.form.edit_title') : $t('suppliers.form.new_title')"
    modal
    :style="{ width: '480px', maxWidth: '95vw' }"
    :draggable="false"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl' },
      header: { class: 'px-6 pt-5 pb-0 bg-white dark:bg-slate-900 border-b-0' },
      content: { class: 'px-6 pb-6 pt-4 bg-white dark:bg-slate-900' }
    }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center"
          :class="isEdit ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'">
          <i :class="isEdit ? 'pi pi-pencil text-blue-500' : 'pi pi-plus text-emerald-500'" class="text-base" />
        </div>
        <div>
          <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100">
            {{ isEdit ? $t('suppliers.form.edit_title') : $t('suppliers.form.new_title') }}
          </h3>
          <p class="text-[11px] text-slate-400">{{ $t('suppliers.form.subtitle') }}</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="$emit('save')" class="space-y-4 mt-2">
      <!-- Name (required) -->
      <div>
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('suppliers.form.name') }}
          <span class="text-red-400 ml-0.5">*</span>
        </label>
        <input
          v-model="modelForm.name"
          type="text"
          :placeholder="$t('suppliers.form.name_ph')"
          class="w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          :class="submitted && !modelForm.name?.trim()
            ? 'border-red-300 dark:border-red-500 ring-1 ring-red-200 dark:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20'"
        />
        <p v-if="submitted && !modelForm.name?.trim()" class="text-[11px] text-red-400 mt-1 flex items-center gap-1">
          <i class="pi pi-exclamation-circle text-[10px]" />
          {{ $t('validation.required') }}
        </p>
      </div>

      <!-- Phone + Company -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            {{ $t('suppliers.form.phone') }}
          </label>
          <input
            v-model="modelForm.phone"
            type="tel"
            placeholder="+998901234567"
            @keydown="onPhoneKeydown"
            @paste="onPhonePaste"
            @input="onPhoneInput"
            class="w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 duration-200"
            :class="submitted && modelForm.phone && modelForm.phone.length < 13
              ? 'border-red-300 dark:border-red-500 ring-1 ring-red-200 dark:ring-red-500/20'
              : 'border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20'"
          />
          <p v-if="submitted && modelForm.phone && modelForm.phone.length < 13" class="text-[11px] text-red-400 mt-1 flex items-center gap-1">
            <i class="pi pi-exclamation-circle text-[10px]" />
            {{ $t('validation.invalid_phone') }}
          </p>
        </div>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            {{ $t('suppliers.form.company') }}
          </label>
          <input
            v-model="modelForm.company"
            type="text"
            :placeholder="$t('suppliers.form.company_ph')"
            class="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      <!-- Address -->
      <div>
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('suppliers.form.address') }}
        </label>
        <input
          v-model="modelForm.address"
          type="text"
          :placeholder="$t('suppliers.form.address_ph')"
          class="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <!-- Initial Debt -->
      <div v-if="!isEdit">
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('suppliers.form.initial_debt') }}
        </label>
        <div class="relative group/input">
          <i class="pi pi-dollar absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-emerald-500 transition-colors z-10"></i>
          <InputNumber
            id="initial_debt"
            v-model="modelForm.initial_debt"
            :min="0"
            :placeholder="$t('suppliers.form.initial_debt_ph')"
            class="initial-debt-input w-full"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {{ $t('suppliers.form.description') }}
        </label>
        <textarea
          v-model="modelForm.description"
          rows="2"
          :placeholder="$t('suppliers.form.description_ph')"
          class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all resize-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <!-- Debt info (edit mode only) -->
      <div v-if="isEdit && supplier?.debt_balance" class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
        <i class="pi pi-info-circle text-red-400 text-[13px]" />
        <span class="text-[12px] font-bold text-red-600 dark:text-red-400">
          {{ $t('suppliers.form.current_debt') }}:
          <span class="font-black">{{ formatMoney(supplier.debt_balance) }}</span>
        </span>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-5">
        <button
          type="button"
          @click="$emit('update:visible', false)"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="h-9 px-5 rounded-xl text-xs font-black text-white transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          :class="isEdit
            ? 'bg-blue-500 hover:bg-blue-600 shadow-sm shadow-blue-500/20'
            : 'bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20'"
        >
          <i :class="saving ? 'pi pi-spin pi-spinner' : (isEdit ? 'pi pi-check' : 'pi pi-plus')" class="text-[12px]" />
          {{ saving ? $t('common.saving') : (isEdit ? $t('common.save') : $t('suppliers.form.add_btn')) }}
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  supplier: { type: Object, default: null },
  modelForm: { type: Object, required: true },
  submitted: { type: Boolean, default: false },
  saving: { type: Boolean, default: false }
})
defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.supplier?.id)

const formatMoney = (val) => {
  const n = Number(val) || 0
  return n.toLocaleString('uz-UZ') + ' UZS'
}

const ALLOWED_KEYS = [
  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End'
]

const onPhoneKeydown = (e) => {
  if (e.ctrlKey || e.metaKey) return
  if (ALLOWED_KEYS.includes(e.key)) return
  if (e.key === '+' && e.target.selectionStart === 0) return
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}

const onPhonePaste = (e) => {
  e.preventDefault()
  const text = (e.clipboardData || window.clipboardData).getData('text')
  let digits = text.replace(/\D/g, '')
  if (digits.length > 0) {
    if (!digits.startsWith('998')) {
      digits = '998' + digits
    }
  }
  digits = digits.slice(0, 12)
  props.modelForm.phone = digits.length > 0 ? '+' + digits : ''
}

const onPhoneInput = (e) => {
  let val = e.target.value
  if (!val) {
    props.modelForm.phone = ''
    return
  }
  if (!val.startsWith('+')) {
    val = '+' + val
  }
  let digits = val.slice(1).replace(/\D/g, '')
  if (digits.length > 0) {
    if (!digits.startsWith('998')) {
      if ('998'.startsWith(digits)) {
        // Allow typing the prefix sequence
      } else {
        digits = '998' + digits
      }
    }
  }
  digits = digits.slice(0, 12)
  props.modelForm.phone = '+' + digits
}
</script>

<style>
.initial-debt-input {
  width: 100% !important;
}

.initial-debt-input .p-inputtext {
  width: 100% !important;
  height: 2.75rem !important;
  padding-left: 2.5rem !important;
  padding-right: 1rem !important;
  border-radius: 1rem !important;
  background-color: rgba(248, 250, 252, 1) !important;
  border: 1px solid transparent !important;
  color: rgb(30 41 59) !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
  text-align: left !important;
  transition: all 0.2s ease !important;
}

.dark .initial-debt-input .p-inputtext {
  background-color: rgba(30, 41, 59, 0.4) !important;
  color: #f1f5f9 !important;
}

.initial-debt-input .p-inputtext:focus {
  background-color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.05) !important;
}

.dark .initial-debt-input .p-inputtext:focus {
  background-color: rgb(15, 23, 42) !important;
}

.initial-debt-input .p-inputtext::placeholder {
  color: #94a3b8 !important;
}
</style>
