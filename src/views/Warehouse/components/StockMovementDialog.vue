<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" class="fixed inset-0 w-screen h-screen z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden" @click.self="$emit('update:visible', false)">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div class="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <!-- Header -->
            <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <i class="pi pi-sync text-white text-xl"></i>
                </div>
                <div class="text-left">
                  <h3 class="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {{ warehouse?.name }}
                  </h3>
                  <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Zaxira Harakati (FIFO)
                  </p>
                </div>
              </div>
              <button @click="$emit('update:visible', false)" class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Movement Type Selection -->
            <div class="p-8 pb-0">
              <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button 
                  @click="form.movement_type = 'in'"
                  class="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  :class="form.movement_type === 'in' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'"
                >
                  <i class="pi pi-download"></i>
                  Kirim (IN)
                </button>
                <button 
                  @click="form.movement_type = 'out'"
                  class="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  :class="form.movement_type === 'out' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'"
                >
                  <i class="pi pi-upload"></i>
                  Chiqim (OUT)
                </button>
              </div>
            </div>

            <!-- Form Content -->
            <div class="p-8 space-y-5">
              <!-- Product Selection -->
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1 text-left">
                  Mahsulot <span class="text-rose-500">*</span>
                </label>
                <Select
                  v-model="form.product"
                  :options="products"
                  optionLabel="name"
                  optionValue="id"
                  filter
                  placeholder="Mahsulotni tanlang"
                  class="w-full !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 focus:!ring-4 focus:!ring-emerald-500/10"
                >
                  <template #option="slotProps">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                        <img v-if="slotProps.option.image" :src="slotProps.option.image" class="w-full h-full object-cover" />
                        <i v-else class="pi pi-image text-slate-300 text-xs"></i>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ slotProps.option.name }}</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ slotProps.option.barcode || 'Shtrix-kodsiz' }}</span>
                      </div>
                    </div>
                  </template>
                </Select>
                <small v-if="submitted && !form.product" class="text-rose-500 text-[10px] font-bold uppercase tracking-wider px-1 block">Mahsulotni tanlash shart.</small>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Quantity -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1 text-left">
                    Miqdor <span class="text-rose-500">*</span>
                  </label>
                  <InputNumber 
                    v-model="form.quantity" 
                    mode="decimal" 
                    :minFractionDigits="0" 
                    :maxFractionDigits="3"
                    placeholder="0.000"
                    class="w-full"
                    inputClass="!rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !py-3 font-bold !text-sm"
                  />
                  <small v-if="submitted && !form.quantity" class="text-rose-500 text-[10px] font-bold uppercase tracking-wider px-1 block">Miqdor shart.</small>
                </div>

                <!-- Unit Cost (Only for IN) -->
                <div class="space-y-2" v-if="form.movement_type === 'in'">
                  <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1 text-left">
                    Kirim Narxi (Donasi)
                  </label>
                  <InputNumber 
                    v-model="form.unit_cost" 
                    mode="currency" 
                    currency="UZS" 
                    locale="uz-UZ"
                    placeholder="0 so'm"
                    class="w-full"
                    inputClass="!rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !py-3 font-bold !text-sm"
                  />
                </div>
              </div>

              <!-- Note -->
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1 text-left">
                  Izoh
                </label>
                <Textarea 
                  v-model="form.note" 
                  rows="2" 
                  placeholder="Harakat haqida qo'shimcha ma'lumot..."
                  class="w-full !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-slate-200 dark:!border-slate-700 !p-4 font-semibold text-sm"
                />
              </div>

              <!-- Footer Actions -->
              <div class="flex gap-4 pt-4">
                <button
                  @click="$emit('update:visible', false)"
                  class="flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  Bekor qilish
                </button>
                <button
                  @click="handleSave"
                  :disabled="saving"
                  class="flex-[2] px-8 py-4 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  :class="form.movement_type === 'in' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'"
                >
                  <i v-if="saving" class="pi pi-spin pi-spinner text-sm"></i>
                  <i v-else class="pi pi-check text-sm"></i>
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  warehouse: Object,
  products: Array,
  saving: Boolean
})

const emit = defineEmits(['update:visible', 'save'])

const form = ref({
  product: null,
  movement_type: 'in',
  quantity: null,
  unit_cost: null,
  note: ''
})

const submitted = ref(false)

const handleSave = () => {
  submitted.value = true
  if (!form.value.product || !form.value.quantity) return

  emit('save', {
    product: form.value.product,
    movement_type: form.value.movement_type,
    quantity: form.value.quantity.toString(),
    unit_cost: form.value.unit_cost ? form.value.unit_cost.toString() : null,
    note: form.value.note,
    warehouse: props.warehouse.id || props.warehouse._id
  })
}

// Reset form when dialog opens
import { watch } from 'vue'
watch(() => props.visible, (newVal) => {
  if (newVal) {
    form.value = {
      product: null,
      movement_type: 'in',
      quantity: null,
      unit_cost: null,
      note: ''
    }
    submitted.value = false
  }
})
</script>

<style scoped>
:deep(.p-select) {
  border: none !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.p-select-label) {
  padding: 0.75rem 1rem !important;
  font-weight: 700 !important;
  font-size: 0.875rem !important;
}

.dark :deep(.p-select-panel) {
  background: #0f172a !important;
  border-color: #1e293b !important;
}

.dark :deep(.p-select-option) {
  color: #e2e8f0 !important;
}

.dark :deep(.p-select-option.p-highlight) {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
}
</style>
