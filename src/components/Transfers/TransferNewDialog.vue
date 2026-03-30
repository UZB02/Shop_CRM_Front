<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header=" "
    :showHeader="false"
    class="!bg-slate-50 dark:!bg-slate-950 !rounded-[2.5rem] !border-none !shadow-2xl overflow-hidden" 
    pt:mask:class="backdrop-blur-sm bg-black/40"
    style="width: 100%; max-width: 800px;"
  >
    <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <!-- Header -->
      <div class="p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i class="pi pi-sync text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Yangi Transfer</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ sourceName }} dan o'tkazish</p>
          </div>
        </div>
        <button 
          @click="visible = false" 
          class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:rotate-90"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
        <!-- Target Selection -->
        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Qayerga yuborilmoqda?</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Location Tabs -->
            <button 
              @click="targetType = 'branch'; form.to_warehouse = null"
              class="group relative p-6 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950"
              :class="targetType === 'branch' 
                ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20' 
                : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
            >
              <div class="relative z-10 flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  :class="targetType === 'branch' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                >
                  <i class="pi pi-building text-base"></i>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-tight" :class="targetType === 'branch' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'">Filialga</h4>
                  <p class="text-[9px] font-bold" :class="targetType === 'branch' ? 'text-emerald-500' : 'text-slate-300'">Do'konga yuboring</p>
                </div>
              </div>
              <div v-if="targetType === 'branch'" class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            </button>

            <button 
              @click="targetType = 'warehouse'; form.to_branch = null"
              class="group relative p-6 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950"
              :class="targetType === 'warehouse' 
                ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20' 
                : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
            >
              <div class="relative z-10 flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  :class="targetType === 'warehouse' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                >
                  <i class="pi pi-box text-base"></i>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-tight" :class="targetType === 'warehouse' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'">Omborga</h4>
                  <p class="text-[9px] font-bold" :class="targetType === 'warehouse' ? 'text-emerald-500' : 'text-slate-300'">Markaziy omborga</p>
                </div>
              </div>
              <div v-if="targetType === 'warehouse'" class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            </button>
          </div>

          <!-- Select Box -->
          <div class="relative">
            <select 
              v-if="targetType === 'branch'"
              v-model="form.to_branch"
              class="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none"
            >
              <option :value="null" disabled>Filialni tanlang</option>
              <option v-for="b in filteredBranches" :key="b.id" :value="b.id || b._id">{{ b.name }}</option>
            </select>
            <select 
              v-else
              v-model="form.to_warehouse"
              class="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none"
            >
              <option :value="null" disabled>Omborni tanlang</option>
              <option v-for="w in filteredWarehouses" :key="w.id" :value="w.id || w._id">{{ w.name }}</option>
            </select>
            <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <i class="pi pi-chevron-down text-[10px] text-slate-400"></i>
            </div>
          </div>
        </div>

        <!-- Products Selection -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mahsulotlar</label>
            <button 
              @click="showProductSelect = true"
              class="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
            >
              Qo'shish
            </button>
          </div>

          <div v-if="!form.items.length" class="p-12 rounded-[2.5rem] bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 opacity-50">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <i class="pi pi-box text-slate-300"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest">Hali mahsulot qo'shilmadi</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(item, idx) in form.items" :key="idx" class="group relative bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20">
              <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                <i class="pi pi-image text-slate-300 text-xs"></i>
              </div>
              <div class="flex-grow min-w-0">
                <h5 class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{{ item.product.product_name || item.product.name }}</h5>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ item.product.barcode }}</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex flex-col gap-1 items-end">
                  <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Miqdor</span>
                  <input 
                    v-model="item.quantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    class="w-20 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl py-1.5 px-3 text-[11px] font-black text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-center"
                  />
                </div>
                <button 
                  @click="removeItem(idx)"
                  class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                >
                  <i class="pi pi-trash text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Izoh (ixtiyoriy)</label>
          <textarea 
            v-model="form.note"
            rows="3"
            class="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] py-4 px-6 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm resize-none"
            placeholder="Transfer uchun qo'shimcha ma'lumot..."
          ></textarea>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row items-center gap-4">
        <button 
          @click="visible = false"
          class="w-full sm:w-1/3 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          Bekor qilish
        </button>
        <button 
          @click="submit"
          :disabled="subLoading"
          class="w-full sm:w-2/3 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <i v-if="subLoading" class="pi pi-spin pi-spinner text-xs"></i>
          <span v-else>Yuborish tasdiqlash uchun</span>
        </button>
      </div>
    </div>

    <!-- Product Selection Modal -->
    <Dialog 
      v-model:visible="showProductSelect" 
      modal 
      header="Mahsulotni tanlang" 
      class="!bg-white dark:!bg-slate-900 !rounded-[2rem] !border-none !shadow-2xl overflow-hidden" 
      style="width: 100%; max-width: 500px;"
      pt:mask:class="backdrop-blur-sm bg-black/40"
    >
      <div class="space-y-4">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-search text-[10px] text-slate-400"></i>
          </div>
          <input 
            v-model="productSearch"
            type="text" 
            placeholder="Qidiruv..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-[11px] font-bold outline-none"
          />
        </div>
        
        <div class="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
          <button 
            v-for="p in filteredAvailableProducts" :key="p.product_id || p.id"
            @click="addProduct(p)"
            class="w-full text-left p-3 rounded-xl hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/20 flex items-center gap-3 group transition-all"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <i class="pi pi-box text-slate-300 text-[10px]"></i>
            </div>
            <div class="flex-grow min-w-0">
              <div class="text-[10px] font-black uppercase tracking-tight truncate group-hover:text-emerald-500 transition-colors">{{ p.product_name || p.name }}</div>
              <div class="flex items-center gap-2">
                <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{{ p.barcode }}</span>
                <span class="text-[8px] font-black text-emerald-500">{{ p.quantity }} mavjud</span>
              </div>
            </div>
            <i class="pi pi-plus text-slate-300 group-hover:text-emerald-500 text-[10px]"></i>
          </button>
        </div>
      </div>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps({
  modelValue: Boolean,
  form: Object,
  subLoading: Boolean,
  branches: Array,
  warehouses: Array,
  availableProducts: Array,
  sourceName: String,
  sourceId: [Number, String],
  sourceType: String // 'branch' or 'warehouse'
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const targetType = ref('branch')
const showProductSelect = ref(false)
const productSearch = ref('')

const filteredAvailableProducts = computed(() => {
  if (!productSearch.value.trim()) return props.availableProducts
  const q = productSearch.value.toLowerCase()
  return props.availableProducts.filter(p => 
    (p.product_name || p.name || '').toLowerCase().includes(q) ||
    (p.barcode || '').toLowerCase().includes(q)
  )
})

const filteredBranches = computed(() => {
    // Filter out the source if it is a branch
    if (props.sourceType === 'branch') {
        const sid = String(props.sourceId)
        return props.branches.filter(b => String(b.id || b._id) !== sid)
    }
    return props.branches
})

const filteredWarehouses = computed(() => {
    // Filter out the source if it is a warehouse
    if (props.sourceType === 'warehouse') {
        const sid = String(props.sourceId)
        return props.warehouses.filter(w => String(w.id || w._id) !== sid)
    }
    return props.warehouses
})

const addProduct = (p) => {
  // Check if already added
  const existing = props.form.items.find(i => (i.product.product_id || i.product.id) === (p.product_id || p.id))
  if (existing) {
    existing.quantity = Number(existing.quantity) + 1
  } else {
    props.form.items.push({
      product: p,
      quantity: 1,
      note: ''
    })
  }
  showProductSelect.value = false
}

const removeItem = (idx) => {
  props.form.items.splice(idx, 1)
}

const submit = () => {
  emit('submit')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
