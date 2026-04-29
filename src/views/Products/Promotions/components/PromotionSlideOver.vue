<template>
  <div class="fixed inset-0 z-50 flex justify-end overflow-hidden" v-if="visible">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
      @click="$emit('update:visible', false)"
      v-show="visible"
    ></div>

    <!-- Slide-over panel -->
    <div class="relative w-full max-w-lg h-full bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col transform transition-transform duration-300 pointer-events-auto border-l border-slate-200 dark:border-slate-800/80">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div class="flex items-center gap-2.5">
           <div class="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
             <i class="pi pi-bolt text-indigo-500 text-[10px]"></i>
           </div>
           <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 tracking-widest">
             {{ isEditing ? 'Aksiyani Tahrirlash' : 'Yangi Aksiya' }}
           </h3>
        </div>
        <button 
          @click="$emit('update:visible', false)"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <i class="pi pi-times text-[10px]"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
        <div v-if="fetchingDeps" class="flex flex-col items-center justify-center py-20 opacity-40 gap-3">
          <i class="pi pi-spinner animate-spin text-2xl text-indigo-500"></i>
          <span class="text-[9px] font-black tracking-widest">Ma'lumotlar yuklanmoqda...</span>
        </div>
        
        <form v-else @submit.prevent="$emit('submit')" class="space-y-6">
          
          <!-- Asosiy -->
          <div class="space-y-4">
            <h4 class="text-[9px] font-black tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">Asosiy</h4>
            
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400">Nomi <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" placeholder="Masalan: Yozgi Chegirma 2026" class="w-full h-11 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white" required/>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400">Chegirma (%) <span class="text-rose-500">*</span></label>
              <div class="relative h-11 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all overflow-hidden">
                <input v-model="form.discount_pct" type="number" step="0.01" min="0" max="100" placeholder="15" class="w-full h-full bg-transparent border-none pl-3.5 pr-10 text-xs font-semibold outline-none dark:text-white" required/>
                <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-indigo-500">%</div>
              </div>
            </div>
          </div>

          <!-- Muddat -->
          <div class="space-y-4 pt-1">
            <h4 class="text-[9px] font-black tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">Vaqt Oralig'i</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400">Boshlanish <span class="text-rose-500">*</span></label>
                <div class="custom-input-wrapper overflow-hidden flex items-center h-11 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                  <DatePicker v-model="form.valid_from" showTime hourFormat="24" placeholder="Dan" class="flex-1 w-full" appendTo="body" />
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400">Tugash <span class="text-rose-500">*</span></label>
                <div class="custom-input-wrapper overflow-hidden flex items-center h-11 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                  <DatePicker v-model="form.valid_to" showTime hourFormat="24" placeholder="Gacha" class="flex-1 w-full" appendTo="body" />
                </div>
              </div>
            </div>
          </div>

          <!-- Bog'lanishlar -->
          <div class="space-y-4 pt-1">
            <h4 class="text-[9px] font-black tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-2">Qamrov</h4>
            
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400">Kategoriyalar</label>
              <div class="custom-input-wrapper overflow-hidden flex items-center h-11 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                <MultiSelect v-model="form.categories" :options="categories" optionLabel="name" optionValue="id" filter placeholder="Tanlang..." :maxSelectedLabels="2" class="flex-1 w-full" />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400">Mahsulotlar</label>
              <div class="custom-input-wrapper overflow-hidden flex items-center h-11 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                <MultiSelect v-model="form.products" :options="products" optionLabel="name" optionValue="id" filter placeholder="Tanlang..." :maxSelectedLabels="2" class="flex-1 w-full" />
              </div>
              <p class="text-[9px] font-medium text-slate-400/80 italic mt-1">POS terminalda eng yuqori chegirma birinchi bo'lib qo'llaniladi.</p>
            </div>
          </div>

          <!-- Status Card -->
          <div class="pt-4">
            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0b1120] rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
               <div class="flex flex-col">
                  <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 tracking-wider">Aksiyani Faollashtirish</span>
                  <span class="text-[9px] text-slate-400 font-medium">Global statusni o'chirib-yoqish</span>
               </div>
               <ToggleSwitch v-model="form.is_active" />
            </div>
          </div>

        </form>
      </div>

      <!-- Footer -->
      <div class="p-5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
        <button 
          @click="$emit('update:visible', false)" 
          class="h-10 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-all tracking-widest"
          :disabled="saving"
        >
          Bekor qilish
        </button>
        <button 
          @click="$emit('submit')"
          class="h-10 px-8 rounded-xl bg-indigo-600 text-white text-[11px] font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-2.5"
          :disabled="saving"
        >
          <i v-if="saving" class="pi pi-spinner animate-spin text-[10px]"></i>
          {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import DatePicker from 'primevue/datepicker'
import MultiSelect from 'primevue/multiselect'
import ToggleSwitch from 'primevue/toggleswitch'

const props = defineProps({
  visible: Boolean,
  isEditing: Boolean,
  saving: Boolean,
  fetchingDeps: Boolean,
  form: Object,
  categories: Array,
  subcategories: Array,
  products: Array
})

const emit = defineEmits(['update:visible', 'submit'])
</script>

<style scoped>
/* PrimeVue Component Overrides - Standard CSS for maximum reliability */
:deep(.p-datepicker), 
:deep(.p-multiselect),
:deep(.p-multiselect-label-container) {
  background-color: #f8fafc !important; /* bg-slate-50 */
  border: 1px solid #e2e8f0 !important; /* border-slate-200 */
  border-radius: 0.75rem !important; /* rounded-xl */
  transition: all 0.2s;
}

.dark :deep(.p-datepicker), 
.dark :deep(.p-multiselect),
.dark :deep(.p-multiselect-label-container) {
  background-color: #0b1120 !important;
  border-color: #1e293b !important; /* slate-800 equivalent */
}

/* Force inner components to be transparent */
:deep(.p-inputtext),
:deep(.p-datepicker-input),
:deep(.p-multiselect-label) {
  background-color: transparent !important;
  border: none !important;
  font-size: 0.75rem !important; /* text-xs */
  font-weight: 600 !important; /* font-semibold */
  padding: 0.625rem 0.875rem !important; /* py-2.5 px-3.5 */
}

.dark :deep(.p-inputtext),
.dark :deep(.p-datepicker-input),
.dark :deep(.p-multiselect-label) {
  color: #e2e8f0 !important; /* text-slate-200 */
}

:deep(.p-multiselect) {
  display: flex !important;
  align-items: center !important;
  min-height: 2.75rem !important; /* h-11 equivalent */
}

:deep(.p-multiselect-trigger) {
  width: 2.5rem !important;
  color: #94a3b8 !important; /* text-slate-400 */
}

/* Specific for DatePicker integration */
:deep(.p-datepicker) {
  display: flex !important;
  width: 100% !important;
}

/* Hover & Focus States */
:deep(.p-multiselect:not(.p-disabled):hover),
:deep(.p-datepicker:not(.p-disabled):hover),
:deep(input:hover) {
  border-color: rgba(99, 102, 241, 0.5) !important; /* indigo-500/50 */
}

:deep(.p-multiselect:not(.p-disabled).p-focus),
:deep(input:focus) {
  border-color: rgb(99, 102, 241) !important; /* indigo-500 */
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important; /* ring-2 ring-indigo-500/10 */
}

/* Transparency for components inside custom-input-wrapper */
.custom-input-wrapper :deep(*) {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.font-black { font-weight: 900; }
</style>