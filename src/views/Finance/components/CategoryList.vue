<template>
  <div class="space-y-4">

    <!-- Add new category: faqat Manager+ -->
    <div v-if="isManager" class="flex flex-col sm:flex-row gap-2">
      <div class="relative flex-1 group/input">
        <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-rose-500 transition-colors pointer-events-none"></i>
        <input
          v-model="newCategoryName"
          type="text"
          :placeholder="$t('finance.category_form.name_ph')"
          @keyup.enter="addCategory"
          class="w-full h-10 sm:h-9 pl-9 pr-4 text-[15px] sm:text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-rose-400 transition-all outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        @click="addCategory"
        :disabled="adding || !newCategoryName.trim()"
        class="h-10 sm:h-9 px-4 rounded-xl text-[15px] sm:text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 shrink-0 shadow-lg shadow-rose-500/10 active:scale-95"
      >
        <i v-if="adding" class="pi pi-spin pi-spinner text-[12px]"></i>
        <i v-else class="pi pi-plus text-[12px]"></i>
        {{ $t('common.add') }}
      </button>
    </div>

    <!-- Category table -->
    <div class="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-collapse min-w-[450px]">
        <thead>
          <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3.5 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">{{ $t('finance.category_form.name') }}</th>
            <th class="px-4 py-3.5 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-center">{{ $t('finance.category_form.expense_count') }}</th>
            <th class="px-4 py-3.5 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-center">{{ $t('finance.category_form.status') }}</th>
            <th class="px-4 py-3.5 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-right">{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">

          <!-- Empty -->
          <tr v-if="!categories.length">
            <td colspan="4" class="px-4 py-10 text-center">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                <i class="pi pi-tag text-lg text-slate-400"></i>
              </div>
              <p class="text-[12px] font-black text-slate-400 tracking-widest">{{ $t('finance.category_form.no_categories') }}</p>
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
                <span v-else class="text-[14px] font-black text-slate-800 dark:text-slate-200 group-hover:text-rose-500 transition-colors">{{ cat.name }}</span>
              </div>
            </td>

            <!-- Count -->
            <td class="px-4 py-2.5 text-center">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] font-black text-slate-600 dark:text-slate-300">
                {{ cat.expense_count ?? 0 }}
              </span>
            </td>

            <!-- Status -->
            <td class="px-4 py-2.5 text-center">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest"
                :class="cat.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'"
              >
                {{ cat.status === 'active' ? $t('finance.category_form.active') : $t('finance.category_form.inactive') }}
              </span>
            </td>

            <!-- Actions: faqat Manager+ -->
            <td class="px-4 py-2.5 text-right">
              <div v-if="isManager" class="flex justify-end gap-1">
                <!-- Edit -->
                <button
                  v-if="deletingId !== cat.id"
                  @click="startEdit(cat)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-90"
                  :title="$t('common.edit')"
                >
                  <i class="pi pi-pencil text-[12px]"></i>
                </button>
                <!-- Toggle status -->
                <button
                  v-if="deletingId !== cat.id"
                  @click="toggleStatus(cat)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 transition-all active:scale-90"
                  :class="cat.status === 'active'
                    ? 'hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                    : 'hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'"
                  :title="cat.status === 'active' ? $t('finance.category_form.toggle_inactive') : $t('finance.category_form.toggle_active')"
                >
                  <i :class="cat.status === 'active' ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-[12px]"></i>
                </button>
                <!-- Delete (soft) -->
                <button
                  v-if="deletingId !== cat.id"
                  @click="deletingId = cat.id"
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-90"
                  :title="$t('common.delete')"
                >
                  <i class="pi pi-trash text-[12px]"></i>
                </button>

                <!-- Inline Confirmation -->
                <div v-if="deletingId === cat.id" class="flex items-center gap-1 animate-in slide-in-from-right-2 fade-in duration-200">
                  <span class="text-[10px] font-bold text-rose-500 mr-1 hidden sm:inline-block">O'chirasizmi?</span>
                  <button @click="deletingId = null" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95" title="Bekor qilish">
                    <i class="pi pi-times text-[12px]"></i>
                  </button>
                  <button @click="executeDelete(cat.id)" class="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm shadow-rose-500/20 active:scale-95" title="O'chirish">
                    <i class="pi pi-check text-[12px]"></i>
                  </button>
                </div>
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
import { useI18n } from 'vue-i18n'
import useExpenses from '@/composables/useExpenses'

const props = defineProps({
  isManager: { type: Boolean, default: false }
})

const { t } = useI18n()
const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useExpenses()

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

const deletingId = ref(null)

const toggleStatus = async (cat) => {
  await updateCategory(cat.id, { status: cat.status === 'active' ? 'inactive' : 'active' })
}

const executeDelete = async (id) => {
  await deleteCategory(id)
  deletingId.value = null
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


