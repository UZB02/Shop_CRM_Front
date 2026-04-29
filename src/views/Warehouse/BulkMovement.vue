<template>
  <div class="flex flex-col h-[calc(100vh-72px)] max-w-[1400px] mx-auto">

    <!-- ── Top bar ── -->
    <div class="flex items-center justify-between gap-4 px-1 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <i class="pi pi-arrow-left text-sm"></i>
        </button>
        <div>
          <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
            <span class="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" @click="router.back()">Omborlar</span>
            <i class="pi pi-chevron-right text-[9px]"></i>
            <span class="text-slate-600 dark:text-slate-300">Ommaviy harakat</span>
          </div>
          <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">
            {{ warehouseName }} — Ommaviy harakat
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Valid count chip -->
        <div v-if="bulkItems.length" class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ validItemsCount }}</span>
          <span>/ {{ bulkItems.length }} tayyor</span>
        </div>
        <button
          @click="router.back()"
          class="h-8 px-4 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          Bekor qilish
        </button>
        <button
          @click="handleSave"
          :disabled="saving || validItemsCount === 0"
          class="h-8 px-4 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          :class="movement_type === 'in'
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-rose-500 hover:bg-rose-600'"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-cloud-upload text-xs"></i>
          Saqlash
        </button>
      </div>
    </div>

    <!-- ── Body (2-col) ── -->
    <div class="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 py-5">

      <!-- ── LEFT: Config panel ── -->
      <div class="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto no-scrollbar">

        <!-- Movement type card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Harakat turi</h3>

          <div class="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              @click="movement_type = 'in'"
              class="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all"
              :class="movement_type === 'in'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            >
              <i class="pi pi-download text-[11px]"></i>
              Kirim
            </button>
            <button
              @click="movement_type = 'out'"
              class="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all"
              :class="movement_type === 'out'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            >
              <i class="pi pi-upload text-[11px]"></i>
              Chiqim
            </button>
          </div>

          <!-- Type description -->
          <p class="text-xs text-slate-400 leading-relaxed">
            <template v-if="movement_type === 'in'">
              Mahsulotlar ombor balansiga <span class="text-emerald-600 font-medium">qo'shiladi</span>. Har bir mahsulot uchun miqdor va xarid narxini kiriting.
            </template>
            <template v-else>
              Mahsulotlar ombor balansidan <span class="text-rose-500 font-medium">ayiriladi</span>. Mavjud miqdordan oshmasligi kerak.
            </template>
          </p>
        </div>

        <!-- Summary card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Xulosa</h3>

          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Ombor</span>
              <span class="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <i class="pi pi-box text-[11px] text-emerald-500"></i>
                {{ warehouseName || '—' }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Tur</span>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                :class="movement_type === 'in'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'"
              >
                <i class="pi text-[10px]" :class="movement_type === 'in' ? 'pi-download' : 'pi-upload'"></i>
                {{ movement_type === 'in' ? 'Kirim' : 'Chiqim' }}
              </span>
            </div>
            <div class="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Tayyor qatorlar</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ validItemsCount }} / {{ bulkItems.length }}</span>
            </div>
          </div>

          <!-- Hint if nothing valid -->
          <div v-if="validItemsCount === 0" class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 pt-1">
            <i class="pi pi-exclamation-circle text-[11px]"></i>
            Kamida 1 qatorni to'ldiring
          </div>
        </div>

        <!-- Note card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
            Izoh
            <span class="text-xs text-slate-400 font-normal">Ixtiyoriy</span>
          </label>
          <textarea
            v-model="note"
            rows="4"
            placeholder="Harakat haqida qo'shimcha ma'lumot..."
            class="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 p-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-none transition-all"
          ></textarea>
        </div>
      </div>

      <!-- ── RIGHT: Products panel ── -->
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col min-h-0 overflow-hidden">

        <!-- Panel toolbar -->
        <div class="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Mahsulotlar</h3>
            <span
              v-if="validItemsCount > 0"
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="movement_type === 'in'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'"
            >{{ validItemsCount }}</span>
          </div>
          <button
            @click="addBulkItem"
            class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium hover:opacity-90 transition-all"
          >
            <i class="pi pi-plus text-[11px]"></i>
            Qator qo'shish
          </button>
        </div>

        <!-- Table -->
        <div class="flex-1 overflow-y-auto no-scrollbar">
          <table class="w-full text-sm text-left">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide w-8">#</th>
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Mahsulot</th>
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center w-40">Miqdor</th>
                <th
                  v-if="movement_type === 'in'"
                  class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right w-44"
                >Xarid narxi</th>
                <th class="px-5 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
              <tr
                v-for="(item, index) in bulkItems"
                :key="index"
                class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td class="px-5 py-3 text-xs text-slate-400">{{ index + 1 }}</td>

                <!-- Product select (PrimeVue for filter capability) -->
                <td class="px-5 py-2.5">
                    <Select
                      v-model="item.product"
                      :options="products"
                      optionLabel="name"
                      dataKey="id"
                      filter
                      placeholder="Mahsulot tanlang..."
                      class="!w-full !h-10 !text-sm !rounded-lg !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800 !shadow-none"
                      panelClass="!rounded-xl !shadow-2xl"
                      pt:label:class="!flex !items-center !py-0 !h-full"
                    >
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center gap-2 h-full">
                          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none">{{ slotProps.value.name }}</span>
                          <TurBadge :tur-name="slotProps.value.tur_name" :tur-color="slotProps.value.tur_color" />
                        </div>
                        <span v-else class="text-slate-400">{{ slotProps.placeholder }}</span>
                      </template>
                      <template #option="slotProps">
                        <div class="flex items-center gap-2.5 py-0.5">
                          <div class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            <i class="pi pi-box text-slate-400 text-[10px]"></i>
                          </div>
                          <div class="flex flex-col min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-2">
                              <span class="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{{ slotProps.option.name }}</span>
                              <TurBadge :tur-name="slotProps.option.tur_name" :tur-color="slotProps.option.tur_color" />
                            </div>
                            <span class="text-[10px] text-slate-400">{{ slotProps.option.barcode || 'Shtrix-kodsiz' }}</span>
                          </div>
                        </div>
                      </template>
                    </Select>
                </td>

                <!-- Quantity with +/- -->
                <td class="px-5 py-2.5">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      @click="item.quantity = Math.max(1, Number(item.quantity || 0) - 1)"
                      class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <i class="pi pi-minus text-[9px]"></i>
                    </button>
                    <input
                      v-model="item.quantity"
                      type="number"
                      step="1"
                      min="1"
                      placeholder="0"
                      class="w-16 h-7 text-center text-sm font-semibold rounded-lg border transition-all outline-none"
                      :class="item.quantity > 0
                        ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 focus:border-emerald-400'"
                    />
                    <button
                      @click="item.quantity = Number(item.quantity || 0) + 1"
                      class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <i class="pi pi-plus text-[9px]"></i>
                    </button>
                  </div>
                </td>

                <!-- Unit cost (only for 'in') -->
                <td v-if="movement_type === 'in'" class="px-5 py-2.5">
                  <input
                    v-model="item.unit_cost"
                    type="number"
                    step="100"
                    min="0"
                    placeholder="0"
                    class="w-full h-7 px-3 text-right text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                </td>

                <!-- Delete -->
                <td class="px-5 py-2.5 text-right">
                  <button
                    v-if="bulkItems.length > 1"
                    @click="removeBulkItem(index)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table footer -->
        <div class="sticky bottom-0 px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 backdrop-blur-sm flex items-center justify-between shrink-0">
          <span class="text-xs text-slate-400">
            Jami {{ bulkItems.length }} qator, {{ validItemsCount }} tayyor
          </span>
          <button
            @click="addBulkItem"
            class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <i class="pi pi-plus text-[10px]"></i>
            Yangi qator
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay Loading -->
    <div
      v-if="saving"
      class="fixed inset-0 z-[100] bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
    >
      <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <i class="pi pi-spin pi-spinner text-emerald-500 text-xl"></i>
      </div>
      <p class="text-xs font-semibold text-slate-600 dark:text-slate-300">Saqlanmoqda...</p>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'
import TurBadge from '@/components/common/TurBadge.vue'
import { useBulkMovement } from './composables/useBulkMovement'

const {
  warehouseName,
  products,
  saving,
  bulkItems,
  movement_type,
  note,
  validItemsCount,
  addBulkItem,
  removeBulkItem,
  handleSave,
  router
} = useBulkMovement()
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
