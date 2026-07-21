/**
 * useAppUpdate — Electron avtomatik yangilanish holati (qo'lda usul).
 *
 * Oqim: startda dastur GitHub relizini tekshiradi → yangi versiya bo'lsa
 * banner chiqadi → foydalanuvchi "Yuklab olish" bosadi → progress →
 * "Qayta ishga tushirish" → o'rnatiladi.
 *
 * Faqat Electron desktopда ishlaydi (web/PWA'да electronAPI bo'lmaydi).
 */
import { ref, readonly } from 'vue'
import { isElectron } from '@/utils/platform'

// Singleton holat — barcha komponentlar uchun bitta
const available = ref(false)
const info = ref(null) // { version, releaseName, releaseNotes, ... }
const downloading = ref(false)
const progress = ref(0) // 0–100
const downloaded = ref(false)
const errorMsg = ref('')
const dismissed = ref(false)
let initialized = false

export function useAppUpdate() {
  const init = () => {
    if (initialized || !isElectron() || !window.electronAPI) return
    initialized = true

    window.electronAPI.onUpdateAvailable?.((i) => {
      info.value = i
      available.value = true
      dismissed.value = false
      downloaded.value = false
      downloading.value = false
      progress.value = 0
      errorMsg.value = ''
    })

    window.electronAPI.onUpdateProgress?.((p) => {
      downloading.value = true
      progress.value = Math.min(100, Math.round(p?.percent || 0))
    })

    window.electronAPI.onUpdateDownloaded?.((i) => {
      if (i) info.value = i
      downloading.value = false
      downloaded.value = true
      progress.value = 100
    })

    window.electronAPI.onUpdateError?.((e) => {
      errorMsg.value = e?.message || 'Yangilanishda xato yuz berdi'
      downloading.value = false
      console.error('[updater] error:', e)
    })

    // Listener'lar tayyor bo'lgach tekshiramiz — main process startidagi
    // tekshiruv banner UI tayyor bo'lishidan oldin o'tib ketishi (race) mumkin.
    check()
    // Kun davomida yangilanish chiqsa ham topilishi uchun davriy tekshiruv (20 daq)
    setInterval(() => {
      if (!downloading.value && !downloaded.value) check()
    }, 20 * 60 * 1000)
  }

  const download = async () => {
    if (!window.electronAPI?.downloadUpdate) return
    errorMsg.value = ''
    downloading.value = true
    progress.value = 0
    try {
      await window.electronAPI.downloadUpdate()
    } catch (e) {
      downloading.value = false
      errorMsg.value = e?.message || 'Yangilanishni yuklab bo\'lmadi'
    }
  }

  const install = () => window.electronAPI?.installUpdate?.()
  const check = () => window.electronAPI?.checkForUpdates?.().catch(() => {})
  const dismiss = () => { dismissed.value = true }

  return {
    available: readonly(available),
    info: readonly(info),
    downloading: readonly(downloading),
    progress: readonly(progress),
    downloaded: readonly(downloaded),
    errorMsg: readonly(errorMsg),
    dismissed: readonly(dismissed),
    init,
    download,
    install,
    check,
    dismiss,
  }
}
