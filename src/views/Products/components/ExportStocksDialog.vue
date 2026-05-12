<template>
  <Dialog
    v-model:visible="visible"
    header="Stok qoldiqlarini eksport qilish"
    :modal="true"
    :draggable="false"
    class="w-full max-w-md mx-4"
    pt:root:class="!rounded-2xl !border-none !shadow-2xl dark:!bg-slate-900"
    pt:header:class="!p-6 !pb-0"
    pt:content:class="!p-6"
  >
    <div class="space-y-6">
      <!-- Info Section -->
      <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex gap-3">
        <i class="pi pi-info-circle text-emerald-500 mt-0.5"></i>
        <p class="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300 font-medium">
          Mahsulotlarning joriy qoldiqlarini Excel formatida yuklab olasiz. Filial yoki ombor bo'yicha saralashingiz mumkin.
        </p>
      </div>

      <!-- Filters -->
      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Filial bo'yicha</label>
          <Select
            v-model="filters.branch"
            :options="branches"
            optionLabel="name"
            optionValue="id"
            placeholder="Barcha filiallar"
            showClear
            fluid
            class="!h-10 !rounded-xl"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Ombor bo'yicha</label>
          <Select
            v-model="filters.warehouse"
            :options="warehouses"
            optionLabel="name"
            optionValue="id"
            placeholder="Barcha omborlar"
            showClear
            fluid
            class="!h-10 !rounded-xl"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-2">
        <button
          @click="visible = false"
          class="flex-1 h-11 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
        >
          Bekor qilish
        </button>
        <button
          @click="handleExport"
          class="flex-1 h-11 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <i class="pi pi-file-excel"></i>
          Excelga yuklash
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import api from '@/services/api'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'export'])

const visible = ref(props.modelValue)
const filters = ref({
  branch: null,
  warehouse: null
})

const branches = ref([])
const warehouses = ref([])

watch(() => props.modelValue, (val) => visible.value = val)
watch(visible, (val) => emit('update:modelValue', val))

const loadFilters = async () => {
  try {
    const [bRes, wRes] = await Promise.all([
      api.get('/branches/'),
      api.get('/warehouse/warehouses/')
    ])
    branches.value = bRes.data.results || bRes.data || []
    warehouses.value = wRes.data.results || wRes.data || []
  } catch (err) {
    console.error('Filter load error:', err)
  }
}

const handleExport = () => {
  const params = {}
  if (filters.value.branch) params.branch = filters.value.branch
  if (filters.value.warehouse) params.warehouse = filters.value.warehouse
  emit('export', params)
  visible.value = false
}

onMounted(loadFilters)
</script>
