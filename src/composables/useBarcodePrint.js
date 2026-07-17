import { usePrinter } from '@/composables/usePrinter'
import { isElectron } from '@/utils/platform'

/**
 * useBarcodePrint — barcode/label chop etishning yagona yo'li.
 *
 *  • Electron (desktop): barcode printeriga jimgina (dialogsiz) yuboriladi.
 *    PDF aynan yorliq o'lchamida (kenglik×balandlik mm) yasaladi — barcode
 *    yorliqqa to'liq va to'g'ri joylashadi, burilmaydi.
 *  • Web/PWA: hozirgidek brauzer print dialogi ochiladi.
 */
export function useBarcodePrint() {
  const { print, connect, barcodePrinter, defaultPrinter, barcodeLabelW, barcodeLabelH, barcodeOrient } = usePrinter()

  // Electron uchun: yorliq o'lchamiga to'liq mos HTML.
  // Barcode har doim mavjud maydonning ~96% ini egallaydi va markazda turadi.
  //  • gorizontal: uzunligi yorliq kengligiga (wMm) bo'ylab to'ladi (keng yorliqда eng katta)
  //  • vertikal:   90° burilib, uzunligi yorliq balandligiga (hMm) bo'ylab to'ladi
  const buildLabelHtml = (imgUrl, wMm, hMm, orient) => {
    const vertical = orient === 'vertical'
    // Vertikal: barcode 90° burilib yorliqni to'ldiradi.
    //   - uzunligi (hMm ga proporsional) → bar kengliklari saqlanadi (skanerlash uchun muhim)
    //   - qalinligi (wMm ni ~92% to'ldiradi) → bar balandligi cho'ziladi (zararsiz)
    const imgStyle = vertical
      ? `width:${(hMm * 0.96).toFixed(1)}mm;height:${(wMm * 0.92).toFixed(1)}mm;object-fit:fill;transform:rotate(90deg);transform-origin:center;`
      : `width:${(wMm * 0.96).toFixed(1)}mm;height:auto;max-height:${(hMm * 0.96).toFixed(1)}mm;`
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Shtrix-kod</title>
<style>
  @page { margin: 0; size: ${wMm}mm ${hMm}mm; }
  html, body { margin: 0; padding: 0; width: ${wMm}mm; height: ${hMm}mm; overflow: hidden; background: #fff; }
  body { display: flex; align-items: center; justify-content: center; }
  img { display: block; }
</style>
</head><body><img src="${imgUrl}" style="${imgStyle}"/></body></html>`
  }

  // Web uchun: brauzer dialogi (avvalgi xatti-harakat)
  const buildWebHtml = (imgUrl) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Shtrix-kod</title>
<style>
  @page { margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  img { max-width: 100%; max-height: 100vh; object-fit: contain; }
</style>
</head><body>
  <img src="${imgUrl}"/>
  <scr${''}ipt>window.onload=function(){window.print();setTimeout(function(){window.close()},500)}</scr${''}ipt>
</body></html>`

  // ── TSPL BITMAP: backend barcode rasmini printerning nuqta-to'riga render qilib,
  //    1-bit qora/oq qilib TSPL BITMAP buyrug'iga paketlaymiz. Printer o'zi
  //    markazlaydi va die-cut gap'ni SIZE/GAP orqali hal qiladi. ──
  const DOTS_PER_MM = 8 // XP-T361U = 203 dpi ≈ 8 nuqta/mm (TSPL sinovi tasdiqladi)

  // Rasmni har qanday manbadan (blob:, data:, http:) blob orqali yuklaymiz.
  // Shunda canvas hech qachon "tainted" bo'lmaydi (CORS) va getImageData ishlaydi —
  // turlar barcode'i remote URL bo'lsa ham TSPL BITMAP kafolatli chiqadi.
  const loadImage = async (url) => {
    let objectUrl = null
    try {
      const blob = await (await fetch(url)).blob()
      objectUrl = URL.createObjectURL(blob)
    } catch {
      objectUrl = null // fetch bo'lmasa (masalan auth) — to'g'ridan-to'g'ri sinaymiz
    }
    const src = objectUrl || url
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    } finally {
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
    }
  }

  const buildLabelTspl = async (imgUrl, wMm, hMm, orient, gapMm, copies) => {
    const img = await loadImage(imgUrl)
    const wDots = Math.round(wMm * DOTS_PER_MM)
    const hDots = Math.round(hMm * DOTS_PER_MM)
    const canvas = document.createElement('canvas')
    canvas.width = wDots
    canvas.height = hDots
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, wDots, hDots)

    const vertical = orient === 'vertical'
    const marginX = wDots * 0.05
    const marginY = hDots * 0.05
    const availW = wDots - marginX * 2
    const availH = hDots - marginY * 2
    const iw = img.naturalWidth || img.width
    const ih = img.naturalHeight || img.height

    if (vertical) {
      // 90° burilgan: rasm balandligi yorliq kengligiga mos keladi
      const scale = Math.min(availW / ih, availH / iw)
      const dw = iw * scale
      const dh = ih * scale
      ctx.save()
      ctx.translate(wDots / 2, hDots / 2)
      ctx.rotate(Math.PI / 2)
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh)
      ctx.restore()
    } else {
      const scale = Math.min(availW / iw, availH / ih)
      const dw = iw * scale
      const dh = ih * scale
      ctx.drawImage(img, (wDots - dw) / 2, (hDots - dh) / 2, dw, dh)
    }

    const { data } = ctx.getImageData(0, 0, wDots, hDots)
    const widthBytes = Math.ceil(wDots / 8)
    const bmp = new Uint8Array(widthBytes * hDots).fill(0xff) // 1 = oq (chizilmaydi)
    for (let y = 0; y < hDots; y++) {
      for (let x = 0; x < wDots; x++) {
        const i = (y * wDots + x) * 4
        const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000
        const black = data[i + 3] > 128 && lum < 128
        if (black) {
          const byteIdx = y * widthBytes + (x >> 3)
          bmp[byteIdx] &= ~(1 << (7 - (x & 7))) // 0 = qora (chiziladi)
        }
      }
    }

    const header =
      [
        `SIZE ${wMm} mm,${hMm} mm`,
        `GAP ${gapMm} mm,0 mm`,
        `DIRECTION 1`,
        `REFERENCE 0,0`,
        `CLS`,
        `BITMAP 0,0,${widthBytes},${hDots},0,`, // verguldan keyin binar ma'lumot
      ].join('\r\n')
    const footer = `\r\nPRINT ${Math.max(1, copies)},1\r\n`

    const enc = new TextEncoder()
    const head = enc.encode(header)
    const foot = enc.encode(footer)
    const total = new Uint8Array(head.length + bmp.length + foot.length)
    total.set(head, 0)
    total.set(bmp, head.length)
    total.set(foot, head.length + bmp.length)
    let bin = ''
    for (let i = 0; i < total.length; i++) bin += String.fromCharCode(total[i])
    return btoa(bin)
  }

  const printBarcode = async (imgUrl, copies = 1) => {
    if (!imgUrl) return

    if (isElectron()) {
      await connect() // printerlar ro'yxati yuklangan bo'lsin
      const wMm = Number(barcodeLabelW.value) || 57
      const hMm = Number(barcodeLabelH.value) || 35
      const printerName = barcodePrinter.value || defaultPrinter.value || undefined

      // TSPL BITMAP yo'li (asosiy) — markazda, aniq o'lchamda, gap-sensor bilan
      try {
        const dataBase64 = await buildLabelTspl(imgUrl, wMm, hMm, barcodeOrient.value, 2, copies)
        const res = await window.electronAPI.printRaw({ printerName, dataBase64 })
        if (res?.success) return { method: 'tspl', success: true }
        console.warn('[useBarcodePrint] TSPL xato, PDF yo\'liga qaytamiz:', res?.error)
      } catch (e) {
        console.warn('[useBarcodePrint] TSPL BITMAP yasashda xato, PDF yo\'liga qaytamiz:', e?.message)
      }

      // Zaxira: eski PDF yo'li (agar canvas/CORS yoki RAW ishlamasa)
      return await print({
        htmlContent: buildLabelHtml(imgUrl, wMm, hMm, barcodeOrient.value),
        printerName,
        labelWidthMm: wMm,
        labelHeightMm: hMm,
        copies,
      })
    }

    // Web/PWA — brauzer dialogi (dialogda foydalanuvchi nusxa sonini o'zi tanlaydi)
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(buildWebHtml(imgUrl))
    win.document.close()
  }

  // TSPL sinovi — printer TSPL tilini qo'llab-quvvatlashini tekshiradi.
  // Bitta yorliqqa ramka + matn + barcode chiqaradi. Faqat Electron'da.
  const testTspl = async () => {
    if (!isElectron() || !window.electronAPI?.testTspl) {
      throw new Error('TSPL sinovi faqat desktop (Electron) versiyasida ishlaydi')
    }
    await connect()
    const printerName = barcodePrinter.value || defaultPrinter.value || undefined
    const result = await window.electronAPI.testTspl({
      printerName,
      widthMm: Number(barcodeLabelW.value) || 57,
      heightMm: Number(barcodeLabelH.value) || 35,
      gapMm: 2,
    })
    if (!result?.success) throw new Error(result?.error || 'TSPL sinovida xato')
    return result
  }

  return { printBarcode, testTspl }
}
