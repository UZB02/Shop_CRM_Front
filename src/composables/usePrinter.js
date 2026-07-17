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
import { isElectron } from '@/utils/platform'

// Singleton: barcha komponentlar uchun bitta holat
const isConnected = ref(false)
const isConnecting = ref(false)
const printers = ref([])
const defaultPrinter = ref(null)
// Barcode/label uchun alohida printer (Electron)
const barcodePrinter = ref(localStorage.getItem('pos_barcode_printer') || null)
// Barcode yorlig'i o'lchami (mm) — die-cut label uchun aniq o'lcham kerak
const barcodeLabelW = ref(localStorage.getItem('pos_barcode_w') || '57')
const barcodeLabelH = ref(localStorage.getItem('pos_barcode_h') || '35')
// Barcode yo'nalishi: 'horizontal' yoki 'vertical'
const barcodeOrient = ref(localStorage.getItem('pos_barcode_orient') || 'horizontal')
const qzError = ref(null)

// Qog'oz o'lchami holati (80 yoki 58)
const paperSize = ref(localStorage.getItem('pos_paper_size') || '80')

// Sirius POS — QZ Tray sertifikati
// Yaratildi: 2026-06-02, amal qiladi: 2046-06-02
// override.crt: C:\Program Files\QZ Tray\override.crt ga o'rnatilgan
const QZ_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIC+zCCAeOgAwIBAgIBATANBgkqhkiG9w0BAQsFADBBMR0wGwYDVQQDExRTaXJp
dXMgUE9TIC0gUVogVHJheTETMBEGA1UEChMKU2lyaXVzIFBPUzELMAkGA1UEBhMC
VVowHhcNMjYwNjAyMDczNjM0WhcNNDYwNjAyMDczNjM0WjBBMR0wGwYDVQQDExRT
aXJpdXMgUE9TIC0gUVogVHJheTETMBEGA1UEChMKU2lyaXVzIFBPUzELMAkGA1UE
BhMCVVowggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCixSZndLDxCFPR
zvvS3WnZpG7Qp5AtYqkvWVUmtRmPsRDrUcMUl/86i+/OIRdgKVPDR/ZWHr1/JPEn
e4zBWF47Iw5gBJKBNCosmNCxQ2RnocsgeV6rAhw0Dhi7fEU1WyvDFoccj+FJUQnO
MCsJITCYtfhiNcSBd8syPGMiyr0/vr1FuYm4ld3rGzM6HiMHT9vxvKxDqUVPeGHI
l5hrbswr6n9++zV7+BLL3/C1PTOhHiWrMdKOBZDzcGlRJfV/vlczkvoEz+VLWHrk
pq/KIYx4JN5Stdne4Pp5cGkUwNclHWjJeUyYgUtfdmEha22H2Td93RvQFgMD7OJZ
AGVqIgbVAgMBAAEwDQYJKoZIhvcNAQELBQADggEBADY0E0KvAWFohAyPdm78ZZ1x
8B9P7L0bwfWysVU55segDlMhXYCDsjDL86X81Ny549oEku2+iGCzidbfbDkEFGpB
ZYXKka0Ji1Z2RDnz9bDPJZyebvfbrxOQhhSnLF4eDHgFrANUtxmPzqtBRVSRKO2k
9l+fXemnsXshiLf2SohpV7XUN2pZh/1J9R9L301pVc5JD9Kcnci7zwzYd2NR26+A
J+G28gDRQmcFWZ6puNmRncb9XJetBFM6N1/3JORr73jvYkZNpxXTfEXzLXLBdJD/
vSneCTHutY9CCSIQRc2LQS8M6eveDtYQpqTRZzyZwlYLQnY1ZOcbx5gMF2kfCQw=
-----END CERTIFICATE-----`

// RSA private key — so'rovlarni imzolash uchun
const QZ_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAosUmZ3Sw8QhT0c770t1p2aRu0KeQLWKpL1lVJrUZj7EQ61HD
FJf/OovvziEXYClTw0f2Vh69fyTxJ3uMwVheOyMOYASSgTQqLJjQsUNkZ6HLIHle
qwIcNA4Yu3xFNVsrwxaHHI/hSVEJzjArCSEwmLX4YjXEgXfLMjxjIsq9P769RbmJ
uJXd6xszOh4jB0/b8bysQ6lFT3hhyJeYa27MK+p/fvs1e/gSy9/wtT0zoR4lqzHS
jgWQ83BpUSX1f75XM5L6BM/lS1h65KavyiGMeCTeUrXZ3uD6eXBpFMDXJR1oyXlM
mIFLX3ZhIWtth9k3fd0b0BYDA+ziWQBlaiIG1QIDAQABAoIBAEO/BL34jpCzo5dm
q99W8nB4hPrpUxPgxYQEjXFf3PS2gNFApY5TuRIYHkZP9Ze7e7aCpB+yCbL6oDiL
rsjmS8oXTCtgm82U9Zy8OdgdsZOEfrPUcDeC2FQ+LcMS9QdBHBTFspSLufu28/rS
h4b0PnLBAlF2CYTNZFBTW/umIGCAC7cyD/9imVgjKzfl4sXHBhJ/ACJ57AyqWGhG
MQVSfnT23m1IMSKu2vtiA7UHk80WQ0OGo/iK1CZWvZqrRCjDGyr1vGbE4BTE1OeF
nRS18MtRl4z233zsdd/I8zPIWksr8zUdsz0jp0L4E7qWa8yjscZuVm6cIvJuovC6
9YmysZ0CgYEA2FapX7ywh6jWPIcd1WMXnYWjPznVTRXnEGdumwpTuO82O4BRVinI
b1LUCvPv2KZ3vOprNmRFkmNKp2gX3hgO4RAOGqcVnB0MYWXBiVdHep5YgCgrWAIR
z4VM5IYmrNTPg0nkrs4YgDFNJKJEmDBGw6/lcWVVJdWydVCLKxIOnOcCgYEAwJxh
s2XW+IM6mVzhs4Vc82RiTjG0hjemPJ+AF0vhiV1CI1BphgWmX7M5r9/PjsxEjku5
fB7MoTdiIgoB96UvIQOvcyQD+G8X7iuYvVmkm16flTlRmb/w3M9qhrymcL6iZbCs
5H2ogYnJG0kepVYTQDtSnAoUnLyKNLpRVh45KuMCgYALUo3OyutaTkXYKSIwlt0X
i3T9zCMTw7+yJhet2Z6EIVDvUEnxfoJVATrDz/yPlDbUFljCIgFaJgQ0Osh1AUFW
GicC0hfZcdPCDTdR3tWI31y2aGPMWV9hQxLBKxw/E2xA7M8hLvwtSWdGMY/xfyVU
/JG/m5QXRNXwOeTuviUxpQKBgFcSmwxZvpvr30LTfWkFoiaZu+MzjzOZ1rnTNTnS
4OuTUEHcqUegKD1dLXf3isI4T8mwK/MTjVhYTDGtKoSElVCsdNVtc6oMttnBtbPr
4YEnfqccGWqTHdUEo1iz0d5oH8wu2YoV0GZ3HoYKQSNnTR6dctP9rqHIjgYWMIzo
7tkXAoGAVzyTY9ug82hwxCu7TrNnf4F3JDzc9fhoEHQnn68UAX24l09VT0jIm+0c
qS1e0ZQtb9H9ZEH4rrrRL53wkve8a7KBGBtZMCtGZvl9kfhBJ747Mm7Muz+Y8KSP
5NqUcIFYKgd98/jXXUzc9am38u9LV79LgU+dKqNp/yjFYCtdOTc=
-----END RSA PRIVATE KEY-----`

// forge bilan RSA-SHA256 imzolash
async function signWithRSA(toSign) {
  try {
    const forge = (await import('node-forge')).default || (await import('node-forge'))
    const privateKey = forge.pki.privateKeyFromPem(QZ_PRIVATE_KEY)
    const md = forge.md.sha512.create()
    md.update(toSign, 'utf8')
    const signature = privateKey.sign(md)
    return forge.util.encode64(signature)
  } catch (e) {
    console.warn('[usePrinter] Imzolashda xato:', e)
    return null
  }
}

// QZ Tray security — sertifikat + to'g'ri RSA imzo
function setupQZSecurity() {
  qz.security.setCertificatePromise(function (resolve, reject) {
    resolve(QZ_CERTIFICATE)
  })

  qz.security.setSignatureAlgorithm('SHA512')

  qz.security.setSignaturePromise(function (toSign) {
    return function (resolve, reject) {
      signWithRSA(toSign).then(resolve).catch(() => resolve(null))
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

// QZ Tray uzilishlarini eshitish
function setupQZCallbacks() {
  qz.websocket.setClosedCallbacks((evt) => {
    console.log('[usePrinter] QZ Tray connection closed', evt)
    isConnected.value = false
    isConnecting.value = false
  })

  qz.websocket.setErrorCallbacks((err) => {
    console.warn('[usePrinter] QZ Tray websocket xatosi:', err)
    isConnected.value = false
  })
}

export function usePrinter() {

  // ─── QZ Tray bilan ulanish ────────────────────────────────────────────────
  //
  // HTTPS saytdan ws://localhost ulanishi brauzer tomonidan "Mixed Content"
  // sababli bloklanadi. Yechim: QZ Tray localhost.qz.io domenini taqdim etadi.
  // Bu domen 127.0.0.1 ga resolve bo'ladi va QZ Tray o'z CA sertifikati bilan
  // imzolangan — shuning uchun brauzer wss:// ulanishiga ishonadi.
  //
  // Muhit:
  //   HTTPS (production) → localhost.qz.io (port 8182, wss)
  //   HTTP  (local dev)  → localhost       (port 8182, ws yoki wss)
  //
  const connect = async () => {
    // Allaqachon ulangan
    if (isConnected.value) return true

    // Ulanish jarayonida — yangi urinish emas
    if (isConnecting.value) return false

    // Electron desktop — native chop etish, QZ Tray'ga umuman ehtiyoj yo'q
    if (isElectron()) {
      isConnected.value = true
      await loadPrinters()
      return true
    }

    isConnecting.value = true
    qzError.value = null

    try {
      setupQZSecurity()
      setupQZCallbacks()

      // Allaqachon WebSocket ochiq bo'lsa — ulanish kerak emas
      if (qz.websocket.isActive()) {
        isConnected.value = true
        await loadPrinters()
        return true
      }

      // HTTPS muhitda localhost.qz.io, HTTP muhitda localhost
      // localhost.qz.io → 127.0.0.1 (QZ Tray CA sertifikati bilan)
      const isHttps = window.location.protocol === 'https:'
      const qzHost = isHttps ? 'localhost.qz.io' : 'localhost'

      const securePort = isHttps ? 8181 : 8182
      console.log(`[usePrinter] QZ Tray ulanish urinilmoqda → ${isHttps ? 'wss' : 'ws'}://${qzHost}:${securePort}`)

      await withTimeout(
        qz.websocket.connect({
          host: qzHost,
          // QZ Tray v2.x: securePort=8181 (WSS), insecurePort=8182 (WS)
          port: { secure: [8181, 8281, 8381, 8481], insecure: [8182, 8282, 8382, 8482] },
          usingSecure: isHttps,
          retries: 3,
          delay: 1
        }),
        15000
      )

      isConnected.value = true
      await loadPrinters()
      return true

    } catch (err) {
      const msg = err?.message || String(err)
      console.warn('[usePrinter] Ulanish xatosi:', msg)

      if (msg.includes('Timeout') || msg.includes('connect') || msg.includes('refused') || msg.includes('ECONNREFUSED')) {
        qzError.value = 'QZ Tray ishlamayapti yoki o\'rnatilmagan. Iltimos, QZ Tray dasturini ishga tushiring.'
      } else if (msg.includes('certificate') || msg.includes('SSL') || msg.includes('ERR_CERT')) {
        qzError.value = 'QZ Tray SSL sertifikati ishonchli emas. Brauzerda https://localhost.qz.io:8182 ni oching va sertifikatni qabul qiling.'
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
      const list = isElectron()
        ? (await window.electronAPI.listPrinters()).map((p) => p.name)
        : await qz.printers.find()
      printers.value = Array.isArray(list) ? list.filter(Boolean) : (list ? [list] : [])

      const saved = localStorage.getItem('pos_default_printer')
      if (saved && printers.value.includes(saved)) {
        defaultPrinter.value = saved
      } else if (isElectron()) {
        defaultPrinter.value = printers.value[0] || null
        if (defaultPrinter.value) {
          localStorage.setItem('pos_default_printer', defaultPrinter.value)
        }
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
    if (!isElectron()) {
      try {
        if (qz.websocket.isActive()) {
          await qz.websocket.disconnect()
        }
      } catch (_) {}
    }
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

  // ─── Qog'oz o'lchamini saqlash ─────────────────────────────────────────────
  const setPaperSize = (size) => {
    paperSize.value = size
    localStorage.setItem('pos_paper_size', size)
  }

  // ─── Barcode printerini saqlash ───────────────────────────────────────────
  const setBarcodePrinter = (printerName) => {
    barcodePrinter.value = printerName
    localStorage.setItem('pos_barcode_printer', printerName)
  }

  // ─── Barcode yorlig'i o'lchamini saqlash (mm) ─────────────────────────────
  const setBarcodeLabelSize = (widthMm, heightMm) => {
    barcodeLabelW.value = String(widthMm)
    barcodeLabelH.value = String(heightMm)
    localStorage.setItem('pos_barcode_w', String(widthMm))
    localStorage.setItem('pos_barcode_h', String(heightMm))
  }

  // ─── Barcode yo'nalishini saqlash ─────────────────────────────────────────
  const setBarcodeOrientation = (orient) => {
    barcodeOrient.value = orient
    localStorage.setItem('pos_barcode_orient', orient)
  }

  // ─── Electron native chop etish (QZ Tray'siz) ─────────────────────────────
  // labelWidthMm/labelHeightMm berilsa — barcode rejimi (PDF aynan yorliq o'lchamida)
  const printWithElectron = async (htmlContent, { printerName = null, labelWidthMm = null, labelHeightMm = null, copies = 1 } = {}) => {
    const result = await window.electronAPI.print({
      html: htmlContent,
      printerName: printerName || defaultPrinter.value || undefined,
      paperSize: paperSize.value,
      labelWidthMm,
      labelHeightMm,
      copies,
    })
    if (!result?.success) throw new Error(result?.error || 'Electron chop etishda xato')
    return true
  }

  const printWithQZ = async (htmlContent, printerName = null) => {
    const printer = printerName || defaultPrinter.value
    if (!printer) throw new Error('Printer tanlanmagan')

    const paperWidthMm = parseFloat(paperSize.value) || 80
    // QZ HTML ni shu pixel kenglikda render qilib, keyin paperWidthMm ga masshtablaydi.
    // 80mm uchun 560px ≈ 178 DPI — termal printer uchun optimal.
    // 58mm uchun 406px ≈ 178 DPI.
    const pageWidth = paperWidthMm <= 60 ? 406 : 560

    const config = qz.configs.create(printer, {
      size: { width: paperWidthMm, height: null }, // null = o'zgaruvchan uzunlik
      margins: 0,
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
      options: {
        language: 'UTF-8',
        pageWidth: pageWidth  // HTML render viewport kengligi (px)
      }
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
    iframe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:100%;max-width:${paperSize.value}mm;height:auto;border:none;visibility:hidden;`
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
  const print = async ({ htmlContent, printerName = null, labelWidthMm = null, labelHeightMm = null, copies = 1 } = {}) => {
    if (!htmlContent) return false

    // Electron desktop — native chop etish, QZ umuman ishlatilmaydi
    if (isElectron()) {
      await printWithElectron(htmlContent, { printerName, labelWidthMm, labelHeightMm, copies })
      return { method: 'electron', success: true }
    }

    // Agar QZ faol bo'lsa
    if (isConnected.value && qz.websocket.isActive()) {
      try {
        await printWithQZ(htmlContent, printerName)
        return { method: 'qz', success: true }
      } catch (err) {
        // Asl xatoni stringga aylantiramiz
        const msg = String(err?.message || err)
        console.warn('[usePrinter] QZ chop etishda xato (string):', msg)
        
        // Agar xato connection uzilishi bilan bog'liq bo'lsa, xatoni yashirib fallbackga o'tamiz
        if (msg.includes('not been established') || msg.includes('websocket')) {
          isConnected.value = false
        } else {
          // console.error qilib to'liq errni chiqaramiz ko'rish uchun
          console.error('[usePrinter] Noma\'lum QZ xatosi:', err)
          throw err
        }
      }
    } else if (isConnected.value) {
      // Status ulangan, lekin aslida socket uzilgan bo'lsa
      isConnected.value = false
    }

    // Ulanmagan yoki xato bergan — dialog fallback
    printWithBrowserDialog(htmlContent)
    return { method: 'browser', success: true }
  }

  return {
    // Holat
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    printers: readonly(printers),
    defaultPrinter: readonly(defaultPrinter),
    barcodePrinter: readonly(barcodePrinter),
    barcodeLabelW: readonly(barcodeLabelW),
    barcodeLabelH: readonly(barcodeLabelH),
    barcodeOrient: readonly(barcodeOrient),
    qzError: readonly(qzError),
    paperSize: readonly(paperSize),

    // Metodlar
    connect,
    disconnect,
    setDefaultPrinter,
    setPaperSize,
    setBarcodePrinter,
    setBarcodeLabelSize,
    setBarcodeOrientation,
    print,
    printWithQZ,
    printRaw,
    printWithBrowserDialog,
    loadPrinters
  }
}
