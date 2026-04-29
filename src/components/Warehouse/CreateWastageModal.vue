<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" @click="onHide" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
    </Transition>

    <!-- Slide-over Panel -->
    <Transition
      enter-active-class="transition duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col">
        
        <!-- Panel Header -->
        <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-sm font-black uppercase tracking-widest text-emerald-500">
              {{ $t('warehouse.wastage.create_title') }}
            </span>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{{ $t('warehouse.detail.bulk_movement') }}</p>
          </div>
          <button
            @click="onHide"
            class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-6 space-y-5 flex-1 overflow-y-auto no-scrollbar">
          
          <!-- Product Info (Visual card like Expense Category) -->
          <div class="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <img v-if="product?.image" :src="product.image" class="w-full h-full object-cover" />
              <i v-else class="pi pi-box text-xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{{ $t('products.col_product') }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase truncate">{{ product?.product_name || product?.name }}</p>
                <TurBadge :tur-name="product?.tur_name" :tur-color="product?.tur_color" />
              </div>
            </div>
          </div>

          <!-- Quantity -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('products.form.amount') }} ({{ product?.product_unit || product?.unit }}) <span class="text-rose-500">*</span>
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10 transition-all duration-300" :class="{ '!border-rose-500': submitted && !form.quantity }">
              <i class="pi pi-hashtag absolute left-4 text-xs text-slate-400 group-focus-within/input:text-emerald-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <InputNumber
                v-model="form.quantity"
                mode="decimal"
                :minFractionDigits="0"
                :maxFractionDigits="3"
                placeholder="0.00"
                class="flex-1 h-full w-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:input:class="!bg-transparent !border-none !shadow-none !text-[15px] !font-black !h-full !pl-12 !pr-4 !w-full !outline-none !text-slate-800 dark:!text-slate-100"
              />
            </div>
            <small v-if="submitted && !form.quantity" class="text-[10px] font-medium text-rose-500 ml-1 mt-1 flex items-center gap-1 animate-fade-in">
              <i class="pi pi-exclamation-triangle text-[8px]"></i>
              {{ $t('validation.required') }}
            </small>
          </div>

          <!-- Reason -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('warehouse.wastage.reason_label') }} <span class="text-rose-500">*</span>
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10 transition-all duration-300" :class="{ '!border-rose-500': submitted && !form.reason }">
              <i class="pi pi-info-circle absolute left-4 text-xs text-slate-400 group-focus-within/input:text-emerald-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <Select
                v-model="form.reason"
                :options="reasonOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('warehouse.wastage.reason_placeholder')"
                class="flex-1 h-full w-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:label:class="!pl-12 !pr-4 !text-[13px] !font-semibold !flex !items-center !h-full !bg-transparent !w-full !text-slate-700 dark:!text-slate-200"
              />
            </div>
            <small v-if="submitted && !form.reason" class="text-[10px] font-medium text-rose-500 ml-1 mt-1 flex items-center gap-1 animate-fade-in">
              <i class="pi pi-exclamation-triangle text-[8px]"></i>
              {{ $t('validation.required') }}
            </small>
          </div>

          <!-- Date -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('common.date') }} <span class="text-rose-500">*</span>
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10 transition-all duration-300">
              <i class="pi pi-calendar absolute left-4 text-xs text-slate-400 group-focus-within/input:text-emerald-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <DatePicker
                v-model="form.date"
                dateFormat="yy-mm-dd"
                showIcon
                iconDisplay="input"
                class="flex-1 h-full w-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:input:class="!bg-transparent !border-none !shadow-none !text-[13px] !font-semibold !h-full !pl-12 !pr-4 !w-full !text-slate-700 dark:!text-slate-200"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('warehouse.detail.col_description') }}</label>
            <div class="custom-input-wrapper relative group/input flex items-start rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10 transition-all duration-300">
              <Textarea
                v-model="form.description"
                rows="4"
                :placeholder="$t('warehouse.wastage.desc_placeholder')"
                class="w-full h-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !w-full"
                pt:textarea:class="!bg-transparent !border-none !shadow-none !text-[13px] !font-semibold !p-4 !px-4 !w-full !text-slate-700 dark:!text-slate-200 !outline-none !resize-none !min-h-[100px]"
              />
            </div>
          </div>

        </div>

        <!-- Panel Footer -->
        <div class="px-6 py-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div class="flex gap-3">
            <button
              @click="onHide"
              class="flex-1 h-10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="handleSave"
              :disabled="loading"
              class="flex-[2] h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
              <i v-else class="pi pi-check text-xs"></i>
              {{ loading ? $t('common.saving') : $t('common.save') }}
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { wastagesAPI } from '@/services/api'
import TurBadge from '@/components/common/TurBadge.vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'

const { t } = useI18n()
const toast = useToast()

const props = defineProps({
  visible: Boolean,
  product: Object, 
  locationId: [Number, String],
  locationType: String 
})

const emit = defineEmits(['update:visible', 'saved'])

const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  quantity: null,
  reason: null,
  date: new Date(),
  description: ''
})

const reasonOptions = computed(() => [
  { label: t('warehouse.wastage.reasons.expired'), value: 'expired' },
  { label: t('warehouse.wastage.reasons.damaged'), value: 'damaged' },
  { label: t('warehouse.wastage.reasons.stolen'), value: 'stolen' },
  { label: t('warehouse.wastage.reasons.other'), value: 'other' }
])

const onHide = () => {
  emit('update:visible', false)
  submitted.value = false
  form.quantity = null
  form.reason = null
  form.date = new Date()
  form.description = ''
}

const handleSave = async () => {
  submitted.value = true
  
  if (!form.quantity || !form.reason) return

  loading.value = true
  try {
    // Priority: product (ID) -> product_id -> id
    const productId = props.product.product || props.product.product_id || props.product.id
    
    const payload = {
      product: Number(productId),
      quantity: Number(form.quantity),
      reason: form.reason,
      date: form.date instanceof Date ? form.date.toISOString().split('T')[0] : form.date,
      description: form.description
    }

    if (props.product.tur_id) {
      payload.tur = Number(props.product.tur_id)
    }

    if (props.locationType === 'branch') {
      payload.branch = Number(props.locationId)
    } else {
      payload.warehouse = Number(props.locationId)
    }

    // DEBUG: Monitor exact payload being sent to avoid 400 errors
    console.log('🚀 Sending Wastage Payload:', payload)

    await wastagesAPI.create(payload)
    
    toast.add({ 
      severity: 'success', 
      summary: t('common.success'), 
      detail: t('warehouse.wastage.created_success'), 
      life: 3000 
    })
    
    emit('saved')
    onHide()
  } catch (err) {
    console.error('❌ Create wastage error:', err)
    toast.add({ 
      severity: 'error', 
      summary: t('common.error'), 
      detail: err.response?.data?.detail || t('common.error_message'), 
      life: 5000 
    })
  } finally {
    loading.value = false
  }
}

watch(() => props.visible, (val) => {
  if (!val) {
    onHide()
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Ikonkalar markazlashuvi */
.custom-input-wrapper i {
  z-index: 20;
  position: absolute !important;
  left: 1rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
}

/* Universal shaffoflik va hamma effektlarni (border, shadow, outline) o'chirish */
.custom-input-wrapper :deep(*),
.custom-input-wrapper :deep(*:hover),
.custom-input-wrapper :deep(*:focus),
.custom-input-wrapper :deep(*::before),
.custom-input-wrapper :deep(*::after) {
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}

/* Professional darajadagi ichki elementlar sozlamasi */
:deep(.p-select-label), 
:deep(.p-inputnumber-input), 
:deep(.p-datepicker-input),
:deep(.p-inputtext) {
  padding-left: 3rem !important; /* pl-12 equivalent */
  padding-right: 1rem !important;
  font-family: inherit !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

/* Dark mode matn ranglari */
.dark :deep(.p-inputtext),
.dark :deep(.p-select-label) {
  color: #f8fafc !important;
}

:deep(.p-select-dropdown) {
  width: 2.5rem !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
