<template>
  <Teleport to="body">
    <Transition name="upd-fade">
      <div
        v-if="show"
        class="fixed z-[9999] bottom-5 right-5 w-[340px] max-w-[calc(100vw-2.5rem)]"
      >
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-start gap-3 p-4">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
              <i :class="downloaded ? 'pi pi-check-circle' : (!available && errorMsg ? 'pi pi-exclamation-triangle' : 'pi pi-download')" class="text-emerald-500 text-sm"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {{ downloaded ? 'Yangilanish tayyor' : (!available && errorMsg ? 'Yangilanishni tekshirishda xato' : 'Yangi versiya mavjud') }}
              </h4>
              <p v-if="available" class="text-[11px] text-slate-400 mt-0.5 leading-snug">
                <span v-if="info?.version" class="font-bold text-slate-500 dark:text-slate-300">v{{ info.version }}</span>
                <span v-if="!downloaded && !downloading"> — yangilash uchun yuklab oling</span>
                <span v-else-if="downloading"> — yuklanmoqda {{ progress }}%</span>
                <span v-else-if="downloaded"> — o'rnatish uchun qayta ishga tushiring</span>
              </p>
            </div>
            <button
              v-if="!downloading"
              @click="dismiss"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
            >
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Progress bar -->
          <div v-if="downloading" class="px-4 pb-1">
            <div class="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-200" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <!-- Error -->
          <p v-if="errorMsg" class="px-4 text-[11px] text-rose-500 leading-snug">{{ errorMsg }}</p>

          <!-- Actions -->
          <div v-if="available" class="px-4 pb-4 pt-2">
            <button
              v-if="!downloaded && !downloading"
              @click="download"
              class="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <i class="pi pi-download text-[10px]"></i> Yuklab olish
            </button>
            <button
              v-else-if="downloading"
              disabled
              class="w-full h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-black flex items-center justify-center gap-2 cursor-wait"
            >
              <i class="pi pi-spin pi-spinner text-[10px]"></i> Yuklanmoqda {{ progress }}%
            </button>
            <button
              v-else-if="downloaded"
              @click="install"
              class="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <i class="pi pi-refresh text-[10px]"></i> Qayta ishga tushirish
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppUpdate } from '@/composables/useAppUpdate'
import { isElectron } from '@/utils/platform'

const { available, info, downloading, progress, downloaded, errorMsg, dismissed, init, download, install, dismiss } = useAppUpdate()

onMounted(() => init())

const show = computed(() => isElectron() && (available.value || !!errorMsg.value) && !dismissed.value)
</script>

<style scoped>
.upd-fade-enter-active, .upd-fade-leave-active { transition: all 0.25s ease; }
.upd-fade-enter-from, .upd-fade-leave-to { opacity: 0; transform: translateY(12px); }
</style>
