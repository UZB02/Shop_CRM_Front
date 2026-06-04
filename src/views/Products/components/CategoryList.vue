<template>
  <!-- ── MOBILE: horizontal scrollable chips ── -->
  <div class="lg:hidden">
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        @click="selectCategory(null)"
        class="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap border"
        :class="!selectedId
          ? 'bg-emerald-500 text-white border-emerald-500'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'"
      >
        <i class="pi pi-th-large text-[12px]"></i>
        {{ $t('categories.all') }}
        <span
          class="px-1.5 py-0.5 rounded-full text-[12px] font-semibold"
          :class="!selectedId ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'"
        >{{ totalProducts }}</span>
      </button>

      <button
        v-for="cat in categories"
        :key="cat._id || cat.id"
        @click="selectCategory(cat)"
        class="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap border"
        :class="isSelected(cat)
          ? 'bg-emerald-500 text-white border-emerald-500'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'"
      >
        {{ cat.name }}
        <span
          v-if="cat.product_count !== undefined"
          class="px-1.5 py-0.5 rounded-full text-[12px] font-semibold"
          :class="isSelected(cat) ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'"
        >{{ cat.product_count }}</span>
      </button>
    </div>

    <!-- Mobile Subcategories -->
    <div v-if="selectedId && subcategories?.length > 0" class="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mt-1 border-t border-slate-100 dark:border-slate-800/50">
      <button
        @click="$emit('select-sub', null)"
        class="flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-md text-[11px] font-bold transition-all whitespace-nowrap"
        :class="!selectedSubcategoryId
          ? 'bg-emerald-500/10 text-emerald-600'
          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        Barcha subkategoriyalar
      </button>

      <button
        v-for="sub in subcategories"
        :key="sub.id"
        @click="$emit('select-sub', sub.id)"
        class="flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-md text-[11px] font-bold transition-all whitespace-nowrap"
        :class="selectedSubcategoryId === sub.id
          ? 'bg-emerald-500/10 text-emerald-600'
          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        {{ sub.name }}
        <span
          v-if="sub.product_count !== undefined"
          class="px-1.5 py-0.5 rounded-md text-[10px] font-black"
          :class="selectedSubcategoryId === sub.id ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'"
        >{{ sub.product_count }}</span>
      </button>
    </div>
  </div>

  <!-- ── DESKTOP: vertical sidebar ── -->
  <div class="hidden lg:flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex-col sticky top-24 max-h-[calc(100vh-120px)]">

    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ $t('categories.title') }}</span>
        <span
          v-if="categories.length"
          class="px-1.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        >{{ categories.length }}</span>
      </div>
      <button
        v-if="!readonly"
        @click="$emit('add')"
        class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
        v-tooltip.top="$t('products.new_category')"
      >
        <i class="pi pi-plus text-xs"></i>
      </button>
    </div>

    <!-- Search -->
    <div class="px-3 py-2.5 shrink-0 border-b border-slate-50 dark:border-slate-800/60">
      <div class="relative">
        <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-slate-400"></i>
        <input
          v-model="catSearch"
          type="text"
          :placeholder="$t('categories.search_ph')"
          class="w-full h-7 pl-7 pr-3 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto no-scrollbar p-2 space-y-0.5">

      <button
        v-if="!catSearch"
        @click="selectCategory(null)"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
        :class="!selectedId
          ? 'bg-emerald-500 text-white'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'"
      >
        <div class="flex items-center gap-2.5">
          <i class="pi pi-th-large text-xs"></i>
          <span class="font-medium text-xs">{{ $t('categories.all') }}</span>
        </div>
        <span
          class="text-xs font-semibold px-1.5 py-0.5 rounded-md"
          :class="!selectedId ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
        >{{ totalProducts }}</span>
      </button>

      <div
        v-for="cat in filteredCategories"
        :key="cat._id || cat.id"
        class="flex flex-col"
      >
        <div
          class="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-sm"
          :class="isSelected(cat)
            ? 'bg-emerald-500 text-white'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'"
          @click="selectCategory(cat)"
        >
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              class="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 transition-all"
              :class="isSelected(cat) ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600'"
            >{{ cat.name?.substring(0, 2).toUpperCase() }}</div>
            <span class="text-xs font-medium truncate">{{ cat.name }}</span>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <span
              v-if="cat.product_count !== undefined"
              class="text-xs font-semibold px-1.5 py-0.5 rounded-md transition-all"
              :class="[
                isSelected(cat) ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400',
                !readonly ? 'group-hover:hidden' : ''
              ]"
            >{{ cat.product_count }}</span>

            <div v-if="!readonly" class="hidden group-hover:flex gap-0.5">
              <button class="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/20 dark:hover:bg-slate-700 transition-all" @click.stop="$emit('edit', cat)">
                <i class="pi pi-pencil text-[11px]"></i>
              </button>
              <button
                class="w-6 h-6 rounded-md flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                :class="isSelected(cat) ? 'text-white/70' : 'text-slate-400'"
                @click.stop="$emit('delete', cat)"
              >
                <i class="pi pi-trash text-[11px]"></i>
              </button>
            </div>
            
            <i v-if="isSelected(cat) && subcategories?.length" class="pi pi-chevron-down text-[10px] ml-1 opacity-70"></i>
          </div>
        </div>

        <!-- Subcategories Accordion -->
        <div v-if="isSelected(cat) && subcategories?.length > 0" class="pl-8 pr-1 py-1 space-y-0.5 mt-0.5">
          <div 
            class="px-3 py-2 rounded-lg cursor-pointer text-[11px] transition-all flex items-center justify-between"
            :class="!selectedSubcategoryId ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
            @click="$emit('select-sub', null)"
          >
            <span>Barcha subkategoriyalar</span>
          </div>
          <div
            v-for="sub in subcategories"
            :key="sub.id"
            class="px-3 py-2 rounded-lg cursor-pointer text-[11px] transition-all flex items-center justify-between"
            :class="selectedSubcategoryId === sub.id ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
            @click="$emit('select-sub', sub.id)"
          >
            <span class="truncate pr-2">{{ sub.name }}</span>
            <span v-if="sub.product_count !== undefined" class="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
              :class="selectedSubcategoryId === sub.id ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
              {{ sub.product_count }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!filteredCategories.length" class="py-10 text-center">
        <i class="pi pi-folder-open text-slate-300 dark:text-slate-600 text-xl mb-2 block"></i>
        <p class="text-xs text-slate-400">{{ $t('common.no_results') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  selectedId: [String, Number, null],
  totalProducts: Number,
  readonly: { type: Boolean, default: false },
  subcategories: { type: Array, default: () => [] },
  selectedSubcategoryId: [String, Number, null]
})

const emit = defineEmits(['select', 'add', 'edit', 'delete', 'select-sub'])
const catSearch = ref('')

const filteredCategories = computed(() => {
  const list = Array.isArray(props.categories) ? props.categories : []
  if (!catSearch.value) return list
  const q = catSearch.value.toLowerCase()
  return list.filter(c => c.name?.toLowerCase().includes(q))
})

const isSelected = (cat) => {
  if (!cat || props.selectedId == null) return false
  return Number(props.selectedId) === Number(cat.id)
}

const selectCategory = (cat) => emit('select', cat ?? null)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


