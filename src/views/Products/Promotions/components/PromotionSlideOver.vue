<template>
  <div class="fixed inset-0 z-50 flex justify-end overflow-hidden" v-if="visible">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
      @click="$emit('update:visible', false)"
      v-show="visible"
    ></div>

    <!-- Slide-over panel -->
    <div class="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 pointer-events-auto border-l border-slate-100 dark:border-slate-800">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          {{ isEditing ? 'Aksiyani Tahrirlash' : 'Yangi Aksiya' }}
        </h3>
        <button 
          @click="$emit('update:visible', false)"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
        <div v-if="fetchingDeps" class="flex justify-center py-10 opacity-50">
          <i class="pi pi-spinner animate-spin text-3xl text-indigo-500"></i>
        </div>
        
        <form v-else @submit.prevent="$emit('submit')" class="space-y-6">
          
          <!-- Asosiy -->
          <div class="space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Asosiy Ma'lumotlar</h4>
            
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300">Aksiya Nomi <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" placeholder="Masalan: Yozgi Chegirma 2026" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required/>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300">Chegirma Foizi (%) <span class="text-red-500">*</span></label>
              <div class="relative">
                <input v-model="form.discount_pct" type="number" step="0.01" min="0" max="100" placeholder="Yoki: 15" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required/>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-indigo-500">%</div>
              </div>
            </div>
          </div>

          <!-- Muddat -->
          <div class="space-y-4 pt-2">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Vaqt Sarhisobi</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-300">Boshlanish <span class="text-red-500">*</span></label>
                <DatePicker v-model="form.valid_from" showTime hourFormat="24" placeholder="Sanani tanlang" :class="'w-full'" fluid />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-300">Tugash <span class="text-red-500">*</span></label>
                <DatePicker v-model="form.valid_to" showTime hourFormat="24" placeholder="Sanani tanlang" :class="'w-full'" fluid />
              </div>
            </div>
          </div>

          <!-- Bog'lanishlar -->
          <div class="space-y-4 pt-2">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Qamrov (Kamida bittasi shart)</h4>
            
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300">Kategoriyalar</label>
              <MultiSelect v-model="form.categories" :options="categories" optionLabel="name" optionValue="id" filter placeholder="Kategoriyalarni biriktirish..." :maxSelectedLabels="3" class="w-full md:w-full" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300">Mahsulotlar</label>
              <MultiSelect v-model="form.products" :options="products" optionLabel="name" optionValue="id" filter placeholder="Qat'iy mahsulotlarni tanlash..." :maxSelectedLabels="3" class="w-full md:w-full" />
              <p class="text-[9px] font-bold text-slate-400 mt-1">Eslatma: Bu yerdagi eng yuqori chegirma to'lov kassa (POS) da avtomatik ushlab qolinadi.</p>
            </div>
          </div>

          <!-- Status -->
          <div class="pt-4 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
             <div class="flex flex-col">
                <span class="text-xs font-black text-slate-700 dark:text-white uppercase">Aksiyani Faollashtirish</span>
                <span class="text-[9px] text-slate-400 font-bold">O'chirib qo'yilsa vaqti kelganida ham qo'llanilmaydi.</span>
             </div>
             <ToggleSwitch v-model="form.is_active" />
          </div>

        </form>
      </div>

      <!-- Footer -->
      <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        <button 
          @click="$emit('update:visible', false)" 
          class="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-all uppercase"
          :disabled="saving"
        >
          Bekor qilish
        </button>
        <button 
          @click="$emit('submit')"
          class="px-8 py-3 rounded-xl bg-indigo-500 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          :disabled="saving"
        >
          <i v-if="saving" class="pi pi-spinner animate-spin"></i>
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
