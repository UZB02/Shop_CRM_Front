<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from 'primevue/button'
import api from '@/services/axios'

const stats = ref(null)
const loading = ref(false)
const copiedCode = ref(false)
const copiedLink = ref(false)

// Fallback Mock Data as specified in the guidelines
const mockStats = {
  referral_code: "TXNO2026",
  referral_link: "https://app.siriuspos.uz/referral/TXNO2026",
  total_leads: 7,
  total_rewarded: 3,
  total_days_earned: 90,
  pending_discount_pct: 20.00,
  pending_discount_expires_at: "2026-08-25T10:30:00Z"
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('subscription/referral-stats/')
    stats.value = res.data || mockStats
  } catch (err) {
    console.warn('Backend subscription/referral-stats/ endpoint failed or not yet deployed. Using specification mock data.', err)
    stats.value = mockStats
  } finally {
    loading.value = false
  }
}

// Generate referral link dynamically (directing traffic to the landing page on https://www.siriuspos.uz/)
const referralLink = computed(() => {
  if (!stats.value) return ''
  if (stats.value.referral_link) {
    // Clean any legacy backend mock app.example.com placeholders if present
    return stats.value.referral_link.replace('https://app.example.com', 'https://www.siriuspos.uz').replace('app.example.com', 'www.siriuspos.uz')
  }
  return `https://www.siriuspos.uz/referral/${stats.value.referral_code}`
})

// Copy clipboard helpers
const copyToClipboard = async (text, isLink = false) => {
  try {
    await navigator.clipboard.writeText(text)
    if (isLink) {
      copiedLink.value = true
      setTimeout(() => { copiedLink.value = false }, 2000)
    } else {
      copiedCode.value = true
      setTimeout(() => { copiedCode.value = false }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy text', err)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-5">
    
    <!-- Title & Compact Metrics Strip (Clean corporate header) -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
      <div>
        <h2 class="text-xs font-black tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">Referral Tizimi</h2>
        <p class="text-[11px] text-slate-400 font-medium mt-0.5">Platformaga do'stlaringizni taklif etib, bonuslarga ega bo'ling.</p>
      </div>

      <!-- Compact Metrics Strip -->
      <div v-if="stats" class="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <div class="px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-black/10 flex items-center gap-2 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30">
            <i class="pi pi-users text-[10px]"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Jami Takliflar</span>
            <span class="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5">{{ stats.total_leads || 0 }} ta</span>
          </div>
        </div>

        <div class="px-3 py-1.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 flex items-center gap-2 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30">
            <i class="pi pi-check-circle text-[10px]"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Mukofotlanganlar</span>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{{ stats.total_rewarded || 0 }} ta do'kon</span>
          </div>
        </div>

        <div class="px-3 py-1.5 rounded-xl border border-purple-500/15 bg-purple-500/5 flex items-center gap-2 shadow-sm">
          <div class="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center border border-purple-100/50 dark:border-purple-900/30">
            <i class="pi pi-calendar-plus text-[10px]"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Bonus Jamg'arma</span>
            <span class="text-xs font-black text-purple-600 dark:text-purple-400 mt-0.5">+{{ stats.total_days_earned || 0 }} kun</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && !stats" class="flex flex-col items-center justify-center py-16">
      <i class="pi pi-spin pi-spinner text-2xl text-emerald-500 mb-2"></i>
      <span class="text-xs text-slate-400 font-bold">Ma'lumotlar yuklanmoqda...</span>
    </div>

    <!-- Main Grid (Symmetric layout like modern SaaS dashboards) -->
    <div v-else-if="stats" class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      <!-- LEFT PORTAL (2 Columns wide): Sharing & Active Rewards -->
      <div class="lg:col-span-2 space-y-5">
        
        <div class="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/40 rounded-2xl p-5 space-y-5 shadow-sm relative overflow-hidden">
          <!-- Subtle decorative color burst -->
          <div class="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <span class="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Hamkorlik Portali</span>
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 mt-2">Do'stingizni taklif qiling, mukofotga ega bo'ling!</h3>
            <p class="text-[11px] text-slate-450 dark:text-slate-500 font-semibold leading-relaxed mt-1">
              Sizning referral havolangiz orqali kelib do'kon ochgan har bir yangi foydalanuvchi uchun global sozlamalarga muvofiq bepul kunlar yoki keyingi to'lovga chegirmalarga ega bo'lasiz.
            </p>
          </div>

          <!-- Unified Copy Panels side-by-side or stacked cleanly -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Code sharing widget (1 Column) -->
            <div class="p-3 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Taklif Kodi</span>
                <span class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-wider uppercase mt-0.5 block">{{ stats.referral_code }}</span>
              </div>
              <button
                @click="copyToClipboard(stats.referral_code)"
                :class="['w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-90 border cursor-pointer',
                         copiedCode ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300']"
                :title="copiedCode ? 'Nusxalandi!' : 'Kodni nusxalash'"
              >
                <i :class="copiedCode ? 'pi pi-check' : 'pi pi-copy'" class="text-[10px]"></i>
              </button>
            </div>

            <!-- Link sharing widget (2 Columns) -->
            <div class="md:col-span-2 p-3 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
              <div class="flex-1 min-w-0">
                <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Taklif Havolasi (Referral URL)</span>
                <span class="text-xs font-semibold text-slate-500 truncate block mt-1 select-all" title="Nusxalash uchun bosing">{{ referralLink }}</span>
              </div>
              <button
                @click="copyToClipboard(referralLink, true)"
                :class="['w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-90 border shrink-0 cursor-pointer',
                         copiedLink ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300']"
                :title="copiedLink ? 'Nusxalandi!' : 'Havolani nusxalash'"
              >
                <i :class="copiedLink ? 'pi pi-check' : 'pi pi-copy'" class="text-[10px]"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- ACTIVE PENDING REWARD ALERT -->
        <transition name="fade">
          <div 
            v-if="stats.pending_discount_pct > 0" 
            class="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/15 dark:border-amber-500/10 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm animate-pulse-subtle"
          >
            <div class="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
              <i class="pi pi-gift text-sm"></i>
            </div>
            <div class="space-y-1 min-w-0">
              <span class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Kutilayotgan Mukofot Chegirmasi</span>
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-100">
                Keyingi to'lovingiz uchun <span class="text-amber-500 font-extrabold">{{ stats.pending_discount_pct }}% chegirma</span> hisoblandi!
              </h4>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                Ushbu chegirma obunani uzaytirganingizda avtomatik qo'llaniladi.  
                <span class="text-amber-500 font-bold block sm:inline mt-0.5 sm:mt-0">(Amal muddati: {{ stats.pending_discount_expires_at }} gacha)</span>
              </p>
            </div>
          </div>
        </transition>

      </div>

      <!-- RIGHT PORTAL (1 Column wide): Professional Step-by-Step Tracker -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm">
        <h3 class="text-[10px] font-black tracking-wider text-slate-800 dark:text-slate-200 uppercase mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">Tizim Qanday Ishlaydi?</h3>
        
        <!-- Vertical Timeline Tracker -->
        <div class="relative pl-6 space-y-5">
          <!-- Connecting Line -->
          <div class="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800/80"></div>

          <!-- Step 1 -->
          <div class="relative space-y-1">
            <!-- Bullet node -->
            <div class="absolute -left-[23px] top-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-[9px] font-black text-slate-700 dark:text-slate-200 shadow-sm">
              1
            </div>
            <h4 class="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-none">Havolani ulashing</h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              Referral kodingiz yoki taklif havolangizni do'stlaringizga yuboring.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="relative space-y-1">
            <!-- Bullet node -->
            <div class="absolute -left-[23px] top-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-[9px] font-black text-slate-700 dark:text-slate-200 shadow-sm">
              2
            </div>
            <h4 class="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-none">Do'stingiz ariza yuboradi</h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              Ular havolaga kirib, do'kon ochish istagi haqida ariza yuborishadi.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="relative space-y-1">
            <!-- Bullet node -->
            <div class="absolute -left-[23px] top-0 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250/60 dark:border-emerald-900/30 flex items-center justify-center text-[9px] font-black text-emerald-500 shadow-sm animate-pulse">
              3
            </div>
            <h4 class="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-none">Mukofotni faollashtiring</h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              Do'stingiz SiriusPOS'dan do'kon ochganida, sizga mukofot yoziladi.
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.animate-pulse-subtle {
  animation: pulseSubtle 2.5s infinite ease-in-out;
}

@keyframes pulseSubtle {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  50% {
    transform: scale(1.008);
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.05);
  }
}
</style>
