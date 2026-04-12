<template>
  <div class="space-y-4">

    <!-- Add new category: faqat Manager+ -->
    <div v-if="isManager" class="flex flex-col sm:flex-row gap-2">
      <div class="relative flex-1 group/input">
        <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-rose-500 transition-colors pointer-events-none"></i>
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Yangi kategoriya nomi"
          @keyup.enter="addCategory"
          class="w-full h-10 sm:h-9 pl-9 pr-4 text-[13px] sm:text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-rose-400 transition-all outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        @click="addCategory"
        :disabled="adding || !newCategoryName.trim()"
        class="h-10 sm:h-9 px-4 rounded-xl text-[13px] sm:text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 shrink-0 shadow-lg shadow-rose-500/10 active:scale-95"
      >
        <i v-if="adding" class="pi pi-spin pi-spinner text-[10px]"></i>
        <i v-else class="pi pi-plus text-[10px]"></i>
        Qo'shish
      </button>
    </div>

    <!-- Category table -->
    <div class="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-collapse min-w-[450px]">
        <thead>
          <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Nomi</th>
            <th class="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Xarajatlar</th>
            <th class="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Holat</th>
            <th class="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Amallar</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">

          <!-- Empty -->
          <tr v-if="!categories.length">
            <td colspan="4" class="px-4 py-10 text-center">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                <i class="pi pi-tag text-lg text-slate-400"></i>
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategoriyalar mavjud emas</p>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
          >
            <!-- Name (inline edit) -->
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="cat.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'"
                ></div>
                <input
                  v-if="editingId === cat.id"
                  v-model="editingName"
                  @keyup.enter="saveEdit"
                  @keyup.escape="cancelEdit"
                  @blur="cancelEdit"
                  class="text-xs font-semibold rounded-lg border border-rose-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2 py-1 outline-none focus:ring-1 focus:ring-rose-400 w-full max-w-[160px]"
                  autofocus
                />
                <span v-else class="text-[12px] font-black text-slate-800 dark:text-slate-200 group-hover:text-rose-500 transition-colors">{{ cat.name }}</span>
              </div>
            </td>

            <!-- Count -->
            <td class="px-4 py-2.5 text-center">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-black text-slate-600 dark:text-slate-300">
                {{ cat.expense_count ?? 0 }}
              </span>
            </td>

            <!-- Status -->
            <td class="px-4 py-2.5 text-center">
              <span
                class="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
                :class="cat.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'"
              >
                {{ cat.status_display || (cat.status === 'active' ? 'Faol' : 'Nofaol') }}
              </span>
            </td>

            <!-- Actions: faqat Manager+ -->
            <td class="px-4 py-2.5 text-right">
              <div v-if="isManager" class="flex justify-end gap-1">
                <!-- Edit -->
                <button
                  @click="startEdit(cat)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-90"
                  title="Tahrirlash"
                >
                  <i class="pi pi-pencil text-[10px]"></i>
                </button>
                <!-- Toggle status -->
                <button
                  @click="toggleStatus(cat)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 transition-all active:scale-90"
                  :class="cat.status === 'active'
                    ? 'hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                    : 'hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'"
                  :title="cat.status === 'active' ? 'Nofaol qilish' : 'Faollashtirish'"
                >
                  <i :class="cat.status === 'active' ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-[10px]"></i>
                </button>
                <!-- Delete (soft) -->
                <button
                  @click="confirmDelete(cat)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-90"
                  title="Nofaol qilish"
                >
                  <i class="pi pi-trash text-[10px]"></i>
                </button>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import useExpenses from '@/composables/useExpenses'

const props = defineProps({
  isManager: { type: Boolean, default: false }
})

const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useExpenses()
const confirm = useConfirm()

const newCategoryName = ref('')
const adding = ref(false)
const editingId = ref(null)
const editingName = ref('')

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return
  adding.value = true
  const success = await createCategory({ name: newCategoryName.value.trim() })
  if (success) newCategoryName.value = ''
  adding.value = false
}

const startEdit = (cat) => {
  editingId.value = cat.id
  editingName.value = cat.name
}

const saveEdit = async () => {
  if (!editingName.value.trim() || editingName.value === editingId.value) {
    editingId.value = null
    return
  }
  await updateCategory(editingId.value, { name: editingName.value.trim() })
  editingId.value = null
}

const cancelEdit = () => {
  editingId.value = null
}

const toggleStatus = async (cat) => {
  await updateCategory(cat.id, { status: cat.status === 'active' ? 'inactive' : 'active' })
}

const confirmDelete = (cat) => {
  confirm.require({
    message: `"${cat.name}" kategoriyasini nofaol qilishni tasdiqlaysizmi?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteCategory(cat.id)
  })
}

onMounted(fetchCategories)
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
