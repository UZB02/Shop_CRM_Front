/**
 * usePrinter — QZ Tray orqali silent (dialog ko'rsatmasdan) chop etish
 *
 * QZ Tray ulanganda: to'g'ridan-to'g'ri printerni boshqaradi
 * QZ Tray o'rnatilmagan/ulanmagan bo'lsa: fallback sifatida iframe print dialog
 *
 * QZ Tray dasturi: https://qz.io/download/
 *
 * Tuzatilgan xatolar:
 *  1. setSignaturePromise noto'g'ri format edi → to'g'irlandi
 *  2. setCertificatePromise noto'g'ri format → QZ 2.x API ga moslashtirildi
 *  3. Ulanish cheksiz kutib qolishi mumkin edi → 10 soniya timeout qo'shildi
 *  4. Singleton connectionPromise stuck qolishi → reset mexanizmi qo'shildi
 *  5. QZ websocket allaqachon ochiq bo'lishi → isActive() tekshiruvi qo'shildi
 */

import { ref, readonly } from 'vue'
import qz from 'qz-tray'

// Singleton: barcha komponentlar uchun bitta holat
const isConnected = ref(false)
const isConnecting = ref(false)
const printers = ref([])
const defaultPrinter = ref(null)
const qzError = ref(null)

// QZ Tray security — unsigned/development rejimi
// Production uchun: https://qz.io/wiki/2.1-signing-messages
function setupQZSecurity() {
  // setCertificatePromise: callback (resolve, reject) shaklida bo'lishi kerak
  qz.security.setCertificatePromise(function (resolve, reject) {
    resolve(null) // unsigned/demo rejim
  })

  // setSignaturePromise: (toSign) => (resolve, reject) shaklida bo'lishi kerak
  qz.security.setSignaturePromise(function (toSign) {
    return function (resolve, reject) {
      resolve(null) // unsigned/demo rejim
    }
  })
}

// Timeout bilan Promise wrapper
function withTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: ${ms}ms da javob kelmadi`)), ms)
  )
  return Promise.race([promise, timeout])
}

export function usePrinter() {

  // ─── QZ Tray bilan ulanish ────────────────────────────────────────────────
  const connect = async () => {
    // Allaqachon ulangan
    if (isConnected.value) return true

    // Ulanish jarayonida — yangi urinish emas
    if (isConnecting.value) return false

    isConnecting.value = true
    qzError.value = null

    try {
      setupQZSecurity()

      // Allaqachon WebSocket ochiq bo'lsa — ulanish kerak emas
      if (qz.websocket.isActive()) {
        isConnected.value = true
        // Printerlar ro'yxatini yangilaymiz
        await loadPrinters()
        return true
      }

      // 10 soniya timeout bilan ulanish urinish
      await withTimeout(
        qz.websocket.connect({ retries: 3, delay: 0.5 }),
        10000
      )

      isConnected.value = true
      await loadPrinters()
      return true

    } catch (err) {
      const msg = err?.message || String(err)
      // Brauzer QZ Tray ni topmaganda aniq xabar
      if (msg.includes('Timeout') || msg.includes('connect') || msg.includes('refused')) {
        qzError.value = 'QZ Tray ishlamayapti. Dastur ishga tushirilganini tekshiring.'
      } else {
        qzError.value = msg
      }
      isConnected.value = false
      return false
    } finally {
      isConnecting.value = false
    }
  }

  // ─── Printerlar ro'yxatini yuklash ───────────────────────────────────────
  const loadPrinters = async () => {
    try {
      const list = await qz.printers.find()
      printers.value = Array.isArray(list) ? list.filter(Boolean) : (list ? [list] : [])

      const saved = localStorage.getItem('pos_default_printer')
      if (saved && printers.value.includes(saved)) {
        defaultPrinter.value = saved
      } else {
        try {
          const def = await qz.printers.getDefault()
          defaultPrinter.value = def || printers.value[0] || null
          if (defaultPrinter.value) {
            localStorage.setItem('pos_default_printer', defaultPrinter.value)
          }
        } catch {
          defaultPrinter.value = printers.value[0] || null
        }
      }
    } catch (err) {
      console.warn('[usePrinter] Printerlar ro\'yxatini olishda xato:', err)
    }
  }

  // ─── Uzilish ─────────────────────────────────────────────────────────────
  const disconnect = async () => {
    try {
      if (qz.websocket.isActive()) {
        await qz.websocket.disconnect()
      }
    } catch (_) {}
    isConnected.value = false
    isConnecting.value = false
    printers.value = []
    defaultPrinter.value = null
  }

  // ─── Default printerni saqlash ────────────────────────────────────────────
  const setDefaultPrinter = (printerName) => {
    defaultPrinter.value = printerName
    localStorage.setItem('pos_default_printer', printerName)
  }

  // ─── HTML chekni QZ Tray orqali chop etish ────────────────────────────────
  const printWithQZ = async (htmlContent, printerName = null) => {
    const printer = printerName || defaultPrinter.value
    if (!printer) throw new Error('Printer tanlanmagan')

    const config = qz.configs.create(printer, {
      size: { width: 80, units: 'mm' },
      margins: { top: 0, right: 2, bottom: 0, left: 2 },
      units: 'mm',
      colorType: 'blackwhite',
      duplex: false,
      copies: 1,
      rasterize: true
    })

    const printData = [{
      type: 'pixel',
      format: 'html',
      flavor: 'plain',
      data: htmlContent,
      options: { language: 'UTF-8' }
    }]

    await qz.print(config, printData)
    return true
  }

  // ─── RAW ESC/POS chop etish (termal printer uchun tez) ───────────────────
  const printRaw = async (commands, printerName = null) => {
    const printer = printerName || defaultPrinter.value
    if (!printer) throw new Error('Printer tanlanmagan')

    const config = qz.configs.create(printer)
    await qz.print(config, commands)
    return true
  }

  // ─── Fallback: Brauzer dialog orqali chop etish ───────────────────────────
  const printWithBrowserDialog = (htmlContent) => {
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:80mm;height:auto;border:none;visibility:hidden;'
    document.body.appendChild(iframe)

    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open()
    doc.write(htmlContent)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe)
      }, 2000)
    }, 300)
  }

  // ─── Asosiy chop etish funksiyasi (avtomatik usulni tanlaydi) ─────────────
  const print = async ({ htmlContent, printerName = null } = {}) => {
    if (!htmlContent) return false

    // QZ Tray ulangan bo'lsa — silent print
    if (isConnected.value) {
      try {
        await printWithQZ(htmlContent, printerName)
        return { method: 'qz', success: true }
      } catch (err) {
        console.warn('[usePrinter] QZ chop etishda xato:', err)
        throw err
      }
    }

    // Ulanmagan — dialog fallback
    printWithBrowserDialog(htmlContent)
    return { method: 'browser', success: true }
  }

  return {
    // Holat
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    printers: readonly(printers),
    defaultPrinter: readonly(defaultPrinter),
    qzError: readonly(qzError),

    // Metodlar
    connect,
    disconnect,
    setDefaultPrinter,
    print,
    printWithQZ,
    printRaw,
    printWithBrowserDialog,
    loadPrinters
  }
}
