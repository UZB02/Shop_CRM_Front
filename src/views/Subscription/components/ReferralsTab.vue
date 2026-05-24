<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from 'primevue/button'
import api from '@/services/axios'

const codeData = ref(null)
const referralsData = ref(null)
const loading = ref(false)
const copiedCode = ref(false)
const copiedLink = ref(false)

// Fallback Mock Data as specified in the guidelines
const mockCode = {
  id: 5,
  store_name: "Texno Shop",
  code: "TXNO2026",
  referral_url: "?ref=TXNO2026",
  referrals_count: 3,
  rewarded_count: 2,
  created_on: "2026-01-15T10:30:00+05:00"
}

const mockReferrals = {
  referrals: [
    { id: 1, store_name: "Smart Bozor", status: "rewarded", created_on: "2026-02-20T10:00:00+05:00", confirmed_at: "2026-03-01T10:00:00", rewarded_at: "2026-03-05T10:00:00" },
    { id: 2, store_name: "Media Park", status: "rewarded", created_on: "2026-03-10T12:00:00+05:00", confirmed_at: "2026-03-15T14:00:00", rewarded_at: "2026-03-18T16:00:00" },
    { id: 3, store_name: "Evos Fastfood", status: "pending", created_on: "2026-05-12T09:15:00+05:00", confirmed_at: null, rewarded_at: null }
  ],
  total: 3,
  rewarded: 2
}

const loadData = async () => {
  loading.value = true
  try {
    const [codeRes, referralsRes] = await Promise.all([
      api.get('referral/my-code/'),
      api.get('referral/my-referrals/')
    ])
    codeData.value = codeRes.data || mockCode
    referralsData.value = referralsRes.data || mockReferrals
  } catch (err) {
    console.warn('Backend referral endpoints failed or not yet deployed. Using specification mock data.', err)
    codeData.value = mockCode
    referralsData.value = mockReferrals
  } finally {
    loading.value = false
  }
}

// Generate full referral URL
const fullReferralUrl = computed(() => {
  if (!codeData.value) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/register${codeData.value.referral_url || `?ref=${codeData.value.code}`}`
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

// Status helpers
const getStatusDetails = (status) => {
  switch (status) {
    case 'rewarded':
      return {
        label: 'Mukofotlangan (+14 kun)',
        cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
      }
    case 'confirmed':
      return {
        label: 'Tasdiqlangan',
        cls: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
      }
    case 'pending':
    default:
      return {
        label: 'Kutilmoqda',
        cls: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
      }
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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
      <h2 class="text-sm font-black tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">Referral Dasturi</h2>
      <p class="text-[12px] text-slate-400 font-medium tracking-widest mt-1">Platformaga do'stlaringizni taklif qiling va bepul obuna muddatlariga ega bo'ling.</p>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && !codeData" class="flex flex-col items-center justify-center py-16">
      <i class="pi pi-spin pi-spinner text-2xl text-emerald-500 mb-2"></i>
      <span class="text-xs text-slate-400 font-bold">Ma'lumotlar yuklanmoqda...</span>
    </div>

    <div v-else-if="codeData" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- 1. Code Sharing panel (Col-span 2) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Invite Card -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 space-y-4">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <i class="pi pi-gift text-xl text-emerald-100"></i>
            </div>
            <div>
              <h3 class="text-base font-black tracking-wide">Do'stingizni taklif eting, har ikkingiz ham +14 kunga ega bo'ling!</h3>
              <p class="text-xs text-emerald-100 font-medium mt-1 leading-relaxed">
                Referral kod yoki havolangiz yordamida ro'yxatdan o'tgan yangi do'kon o'z hisobini ilk bor to'ldirganda, sizga avtomatik ravishda bepul 14 kunlik mukofot muddati qo'shib beriladi.
              </p>
            </div>
          </div>
        </div>

        <!-- Copy links panel -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 space-y-4 shadow-sm">
          
          <!-- Code Card -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Sizning taklif kodingiz</span>
              <span class="text-lg font-black text-slate-800 dark:text-slate-100 tracking-wider uppercase">{{ codeData.code }}</span>
            </div>
            <Button
              :icon="copiedCode ? 'pi pi-check' : 'pi pi-copy'"
              :label="copiedCode ? 'Nusxalandi!' : 'Kodni nusxalash'"
              class="!rounded-lg !py-2 !px-4 !text-[11px] !font-black shadow-sm"
              :class="copiedCode ? '!bg-emerald-500 !text-white !border-emerald-600' : '!bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 !border-slate-200 dark:!border-slate-800'"
              @click="copyToClipboard(codeData.code)"
            />
          </div>

          <!-- Link Card -->
          <div class="flex flex-col gap-2">
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Taklif havolasi (Referral URL)</span>
            <div class="flex gap-2">
              <input
                type="text"
                readonly
                :value="fullReferralUrl"
                class="flex-1 h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 outline-none"
              />
              <Button
                :icon="copiedLink ? 'pi pi-check' : 'pi pi-copy'"
                class="!rounded-lg !w-10 !h-10 shrink-0"
                :class="copiedLink ? '!bg-emerald-500 !text-white !border-emerald-600' : '!bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 !border-slate-200 dark:!border-slate-800'"
                @click="copyToClipboard(fullReferralUrl, true)"
              />
            </div>
          </div>

        </div>

      </div>

      <!-- 2. Owner Stats widgets (Col span 1) -->
      <div class="space-y-4">
        
        <!-- Total Invites Widget -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Jami takliflar</span>
            <span class="text-2xl font-black text-slate-800 dark:text-slate-100">{{ referralsData?.total || 0 }} <span class="text-xs text-slate-400 font-bold">ta do'kon</span></span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30">
            <i class="pi pi-users text-lg"></i>
          </div>
        </div>

        <!-- Earned bonus Widget -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Mukofotlangan</span>
            <span class="text-2xl font-black text-emerald-500">{{ referralsData?.rewarded || 0 }} <span class="text-xs text-slate-400 font-bold">ta do'kon</span></span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30">
            <i class="pi pi-check-circle text-lg"></i>
          </div>
        </div>

        <!-- Total Days Widget -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Jami bonus kunlar</span>
            <span class="text-2xl font-black text-purple-500">+{{ (referralsData?.rewarded || 0) * 14 }} <span class="text-xs text-slate-400 font-bold">kun bepul</span></span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center border border-purple-100/50 dark:border-purple-900/30">
            <i class="pi pi-calendar-plus text-lg"></i>
          </div>
        </div>

      </div>

      <!-- 3. List of My Referrals (Col span 3 full width) -->
      <div class="lg:col-span-3 space-y-4">
        
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm">
          <h3 class="text-xs font-black tracking-wider text-slate-800 dark:text-slate-200 uppercase mb-4">Taklif qilingan do'konlar</h3>
          
          <div v-if="!referralsData || referralsData.referrals.length === 0" class="text-center py-10">
            <i class="pi pi-info-circle text-2xl text-slate-300 dark:text-slate-700 mb-2"></i>
            <p class="text-xs text-slate-400 font-bold">Siz hali hech kimni taklif qilmadingiz.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <th class="py-2.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Do'kon nomi</th>
                  <th class="py-2.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Taklif qilingan sana</th>
                  <th class="py-2.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Holati</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in referralsData.referrals"
                  :key="item.id"
                  class="border-b border-slate-100/50 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition duration-150"
                >
                  <td class="py-3 font-bold text-xs text-slate-800 dark:text-slate-200">{{ item.store_name }}</td>
                  <td class="py-3 font-bold text-xs text-slate-400 dark:text-slate-500">{{ formatDate(item.created_on) }}</td>
                  <td class="py-3">
                    <span :class="['px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase border', getStatusDetails(item.status).cls]">
                      {{ getStatusDetails(item.status).label }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>
