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

// Generate referral link dynamically (fallback if link not in response)
const referralLink = computed(() => {
  if (!stats.value) return ''
  if (stats.value.referral_link) return stats.value.referral_link
  const baseUrl = window.location.origin
  return `${baseUrl}/referral/${stats.value.referral_code}`
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
  <div class="space-y-6">
    
    <!-- Title Section -->
    <div class="mb-4">
      <h2 class="text-sm font-black tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">Referral Tizimi</h2>
      <p class="text-[12px] text-slate-400 font-medium tracking-widest mt-1">Platformaga do'stlaringizni taklif qiling va bepul obuna muddati yoki chegirmalarga ega bo'ling.</p>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && !stats" class="flex flex-col items-center justify-center py-16">
      <i class="pi pi-spin pi-spinner text-2xl text-emerald-500 mb-2"></i>
      <span class="text-xs text-slate-400 font-bold">Ma'lumotlar yuklanmoqda...</span>
    </div>

    <div v-else-if="stats" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- 1. Code Sharing panel (Col-span 2) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Invite Card with Gradient -->
        <div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <!-- Decorative circle background -->
          <div class="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="absolute -top-10 -left-10 w-24 h-24 bg-teal-400/20 rounded-full blur-xl pointer-events-none"></div>

          <div class="relative z-10 space-y-4">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <i class="pi pi-gift text-xl text-emerald-100 animate-bounce"></i>
            </div>
            <div>
              <h3 class="text-base font-black tracking-wide leading-snug">Do'stingizni taklif eting va ajoyib mukofotlarga ega bo'ling!</h3>
              <p class="text-xs text-emerald-50/90 font-medium mt-2 leading-relaxed">
                Sizning referral havolangiz orqali so'rov yuborgan va keyinchalik do'kon ochgan har bir do'stingiz uchun sizga bonus beriladi! Global sozlamalarga muvofiq bepul obuna muddatlari uzaytiriladi yoki chegirmalarga ega bo'lasiz.
              </p>
            </div>
          </div>
        </div>

        <!-- Copy links panel -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 space-y-5 shadow-sm">
          
          <!-- Code Card -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Sizning taklif kodingiz</span>
              <span class="text-lg font-black text-slate-800 dark:text-slate-100 tracking-wider uppercase">{{ stats.referral_code }}</span>
            </div>
            <Button
              :icon="copiedCode ? 'pi pi-check' : 'pi pi-copy'"
              :label="copiedCode ? 'Nusxalandi!' : 'Kodni nusxalash'"
              class="!rounded-lg !py-2 !px-4 !text-[11px] !font-black shadow-sm"
              :class="copiedCode ? '!bg-emerald-500 !text-white !border-emerald-600' : '!bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 !border-slate-200 dark:!border-slate-800'"
              @click="copyToClipboard(stats.referral_code)"
            />
          </div>

          <!-- Link Card -->
          <div class="flex flex-col gap-2">
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Taklif havolasi (Referral URL)</span>
            <div class="flex gap-2">
              <input
                type="text"
                readonly
                :value="referralLink"
                class="flex-1 h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 outline-none"
              />
              <Button
                :icon="copiedLink ? 'pi pi-check' : 'pi pi-copy'"
                class="!rounded-lg !w-10 !h-10 shrink-0"
                :class="copiedLink ? '!bg-emerald-500 !text-white !border-emerald-600' : '!bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 !border-slate-200 dark:!border-slate-800'"
                @click="copyToClipboard(referralLink, true)"
              />
            </div>
          </div>

        </div>

        <!-- NEW FEATURE: PENDING DISCOUNT CARD -->
        <transition name="fade">
          <div 
            v-if="stats.pending_discount_pct > 0" 
            class="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-pulse-subtle"
          >
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
              <i class="pi pi-gift text-lg"></i>
            </div>
            <div class="space-y-1">
              <span class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Kutilayotgan mukofot chegirmasi</span>
              <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">
                Keyingi obuna to'lovingiz uchun <span class="text-amber-500 text-base font-black">{{ stats.pending_discount_pct }}% chegirma</span> yozildi!
              </h4>
              <p class="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Ushbu chegirma tarifni o'zgartirganingizda avtomatik ravishda qo'llaniladi.  
                <span class="text-amber-500 block sm:inline mt-0.5 sm:mt-0 font-bold">(Amal qilish muddati: {{ formatDate(stats.pending_discount_expires_at) }} gacha)</span>
              </p>
            </div>
          </div>
        </transition>

      </div>

      <!-- 2. Owner Stats widgets (Col span 1) -->
      <div class="space-y-4">
        
        <!-- Total Invites Widget -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Jami takliflar</span>
            <span class="text-2xl font-black text-slate-800 dark:text-slate-100">
              {{ stats.total_leads || 0 }} <span class="text-xs text-slate-400 font-bold">ta so'rov</span>
            </span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30">
            <i class="pi pi-users text-lg"></i>
          </div>
        </div>

        <!-- Earned bonus Widget -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Mukofotlanganlar</span>
            <span class="text-2xl font-black text-emerald-500">
              {{ stats.total_rewarded || 0 }} <span class="text-xs text-slate-400 font-bold">ta do'kon</span>
            </span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30">
            <i class="pi pi-check-circle text-lg"></i>
          </div>
        </div>

        <!-- Total Days Widget -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Jami bonus kunlar</span>
            <span class="text-2xl font-black text-purple-500">
              +{{ stats.total_days_earned || 0 }} <span class="text-xs text-slate-400 font-bold">kun bepul</span>
            </span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center border border-purple-100/50 dark:border-purple-900/30">
            <i class="pi pi-calendar-plus text-lg"></i>
          </div>
        </div>

      </div>

      <!-- 3. Explanatory Process Panel (Col span 3) -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm">
          <h3 class="text-xs font-black tracking-wider text-slate-800 dark:text-slate-200 uppercase mb-5">Tizim Qanday Ishlaydi?</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            <!-- Step 1 -->
            <div class="flex flex-col items-center text-center space-y-2.5 relative z-10">
              <div class="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-xs font-black">
                1
              </div>
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200">Havolani ulashing</h4>
              <p class="text-[11px] text-slate-400 font-medium max-w-[200px] leading-relaxed">
                Referral kodingiz yoki taklif havolangizni do'stlaringizga ulashing.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col items-center text-center space-y-2.5 relative z-10">
              <div class="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-xs font-black">
                2
              </div>
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200">Do'stingiz ariza topshiradi</h4>
              <p class="text-[11px] text-slate-400 font-medium max-w-[200px] leading-relaxed">
                Ular havolaga kirib, do'kon ochish istagi haqida forma to'ldirishadi.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col items-center text-center space-y-2.5 relative z-10">
              <div class="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200/60 dark:border-emerald-900/30 flex items-center justify-center text-xs font-black">
                3
              </div>
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200">Bonusga ega bo'ling</h4>
              <p class="text-[11px] text-slate-400 font-medium max-w-[200px] leading-relaxed">
                Ular Sirius POS do'konini ochganlaridan so'ng, sizga avtomatik tarzda bepul kunlar yoki chegirma beriladi.
              </p>
            </div>

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
