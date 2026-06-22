import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { usePrinter } from '@/composables/usePrinter'

/**
 * usePosReceipt — chek chop etish logikasini boshqaradi.
 * @param {Ref} showReceipt — chek modal holati
 */
export function usePosReceipt(showReceipt) {
  const toast = useToast()
  const { t } = useI18n()
  const { print: qzPrint } = usePrinter()

  // ─── Chek HTML ni to'liq quradigan yordamchi ──────────────────────────────
  const buildReceiptHtml = () => {
    const el = document.getElementById('printable-receipt')
    if (!el) return null
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Savdo cheki</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:"Inter",system-ui,sans-serif;font-size:12px;color:#000;background:#fff;padding:4px 6px;width:100%;max-width:80mm;margin:0 auto;}
  body *{color:#000 !important;font-family:"Inter",system-ui,sans-serif !important;font-weight:bold !important;}
  .font-black,.text-xl,.text-2xl,h2{font-weight:900 !important;}
  .text-center{text-align:center;}
  .text-slate-400,.text-slate-500,.text-slate-700,.text-slate-800,.text-slate-900,
  .text-emerald-500,.text-emerald-600,.text-rose-400,.text-rose-500,.text-amber-500{color:#000 !important;}
  .text-xs{font-size:11px;} .text-sm{font-size:13px;} .text-xl{font-size:20px;font-weight:900;} .text-2xl{font-size:24px;font-weight:900;}
  .tracking-widest{letter-spacing:0.15em;} .tracking-tighter{letter-spacing:-0.02em;}
  .flex{display:flex;} .justify-between{justify-content:space-between;} .items-center{align-items:center;}
  .space-y-1>*+*{margin-top:2px;} .space-y-1\\.5>*+*{margin-top:3px;} .space-y-2\\.5>*+*{margin-top:6px;}
  .border-b-2{border-bottom:1.5px dashed #000;} .border-t-2{border-top:1.5px dashed #000;}
  .border-t{border-top:1px dashed #000;}
  .py-4{padding:8px 0;} .pt-3{padding-top:6px;} .pt-2{padding-top:4px;} .pb-2{padding-bottom:4px;}
  .mb-1{margin-bottom:2px;} .mb-2{margin-bottom:4px;} .mb-3{margin-bottom:8px;} .mt-0\\.5{margin-top:2px;}
  .leading-none{line-height:1;} .leading-tight{line-height:1.25;} .leading-relaxed{line-height:1.5;}
  .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .receipt-paper{border:none !important;box-shadow:none !important;padding:0 !important;}
  img{display:block;margin:0 auto;max-width:100%;}
  img[alt="OFD QR"]{width:96px;height:96px;}
  img[alt="Chek barcode"]{height:80px;max-width:100%;object-fit:contain;}
  .print-hidden{display:none !important;}
</style>
</head><body>${el.innerHTML}</body></html>`
  }

  // ─── Brauzer dialog orqali chop etish ─────────────────────────────────────
  const browserPrintFallback = (htmlContent) => {
    const iframe = document.createElement('iframe')
    iframe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:100%;max-width:80mm;border:none;visibility:hidden;`
    document.body.appendChild(iframe)
    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open(); doc.write(htmlContent); doc.close()
    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe)
      }
      iframe.contentWindow.print()
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe)
      }, 300000)
    }, 300)
  }

  // ─── Asosiy chop etish: QZ ulangan → silent, aks holda → dialog ───────────
  const printReceipt = async () => {
    const el = document.getElementById('printable-receipt')
    if (!el) return

    // Barcode yoki boshqa rasmlar yuklanishini kutamiz (maksimal 3 soniya)
    let attempts = 0
    while (attempts < 30) {
      const skeletons = el.querySelectorAll('.animate-pulse')
      const images = el.querySelectorAll('img')
      const allImagesLoaded = Array.from(images).every(img => img.src && img.complete)
      
      if (skeletons.length === 0 && allImagesLoaded) {
        break
      }
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    const htmlContent = buildReceiptHtml()
    if (!htmlContent) return

    try {
      const result = await qzPrint({ htmlContent })

      if (result.method === 'qz') {
        // ✅ QZ Tray orqali chop etildi — modal yopiladi
        toast.add({
          severity: 'success',
          summary: t('common.success'),
          detail: 'Chek chop etishga yuborildi ✓',
          life: 2500
        })
        setTimeout(() => { showReceipt.value = false }, 300)

      } else if (result.method === 'browser') {
        // 🖨️ Brauzer dialog orqali chop etilmoqda
        // Modal YOPILMAYDI — kassir chekni ko'rib turishida dialog ochiladi
        toast.add({
          severity: 'info',
          summary: 'Chop etish',
          detail: 'Brauzer dialog orqali chop etilmoqda...',
          life: 2000
        })
        // Modal ochiq qoladi — kassir xohlasa yana bosishi mumkin
      }

    } catch (err) {
      console.warn('[POS] QZ print xato, dialog fallbackga o\'tmoqda:', err)
      toast.add({
        severity: 'warn',
        summary: 'Printer xatosi',
        detail: 'Dialog orqali chop etilyapti...',
        life: 2000
      })
      browserPrintFallback(htmlContent)
      // Xato holatda ham modal ochiq qoladi
    }
  }

  return { printReceipt, buildReceiptHtml }
}
