/**
 * useSerialPrinter — Web Serial API orqali Xprinter (termal printer) bilan
 * to'g'ridan-to'g'ri ulanish va ESC/POS buyruqlari yuborish.
 *
 * QZ Tray talab qilmaydi. Birinchi ulanishda foydalanuvchi bir marta
 * USB portni tanlaydi, keyin barcha cheklar avtomatik (dialog yo'q) chiqadi.
 *
 * Qo'llab-quvvatlanadigan brauzerlar:
 *   Chrome 89+, Edge 89+, Opera 75+  (Firefox va Safari qo'llabquvvatlamaydi)
 *
 * Xprinter sozlamalari (odatiy):
 *   BaudRate: 9600 (USB uchun ahamiyatsiz, lekin kerak)
 *   DataBits: 8, StopBits: 1, Parity: none
 *
 * ESC/POS reference: https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/
 */

import { ref, readonly } from 'vue'

// ─── ESC/POS konstantalar ────────────────────────────────────────────────────
const ESC = 0x1B
const GS  = 0x1D
const LF  = 0x0A
const CR  = 0x0D

const CMD = {
  INIT:          [ESC, 0x40],              // Printer initialize
  ALIGN_LEFT:    [ESC, 0x61, 0x00],        // Matn: chap
  ALIGN_CENTER:  [ESC, 0x61, 0x01],        // Matn: markazda
  ALIGN_RIGHT:   [ESC, 0x61, 0x02],        // Matn: o'ng
  BOLD_ON:       [ESC, 0x45, 0x01],        // Bold yoqish
  BOLD_OFF:      [ESC, 0x45, 0x00],        // Bold o'chirish
  DOUBLE_SIZE:   [ESC, 0x21, 0x30],        // Katta shrift
  NORMAL_SIZE:   [ESC, 0x21, 0x00],        // Normal shrift
  CUT:           [GS,  0x56, 0x42, 0x00],  // Qog'ozni kesish
  FEED_3:        [ESC, 0x64, 0x03],        // 3 qator siljitish
  FEED_5:        [ESC, 0x64, 0x05],        // 5 qator siljitish
  LINE_SPACING:  [ESC, 0x33, 0x18],        // Qator oralig'i
}

// ─── Singleton holat ──────────────────────────────────────────────────────────
const isConnected  = ref(false)
const isConnecting = ref(false)
const serialError  = ref(null)
const portInfo     = ref(null)   // Tanlangan port ma'lumoti

let _port   = null   // SerialPort instance
let _writer = null   // WritableStreamDefaultWriter

// ─── Tekst → Uint8Array (CP866 / Latin yoki UTF-8 fallback) ─────────────────
function encodeText(text) {
  // Xprinter ko'pincha CP866 yoki Windows-1252 ishlatadi.
  // Oddiy ASCII harflar uchun TextEncoder yetarli.
  // Kirill/O'zbek harflar uchun qo'shimcha mapping kerak bo'ladi.
  return new TextEncoder().encode(text)
}

// ─── Bytes arrayini Uint8Array ga aylantirish ─────────────────────────────────
function bytes(...args) {
  const flat = args.flat(Infinity)
  return new Uint8Array(flat)
}

// ─── Printer mavjudligini tekshirish ─────────────────────────────────────────
export function isWebSerialSupported() {
  return 'serial' in navigator
}

// ─── Composable ──────────────────────────────────────────────────────────────
export function useSerialPrinter() {

  // ─── Port ulanish ────────────────────────────────────────────────────────
  const connect = async () => {
    if (!isWebSerialSupported()) {
      serialError.value = 'Brauzeringiz Web Serial API ni qo\'llamaydi. Chrome yoki Edge ishlatib ko\'ring.'
      return false
    }

    if (isConnected.value && _port) return true
    if (isConnecting.value) return false

    isConnecting.value = true
    serialError.value = null

    try {
      // Avval ruxsat berilgan portlarni ko'rib chiqamiz (silent reconnect)
      const ports = await navigator.serial.getPorts()
      let port = ports.find(p => p.readable === null || true) // birinchi mavjud port

      if (!port) {
        // Foydalanuvchi port tanlash oynasi (faqat birinchi marta)
        port = await navigator.serial.requestPort({
          // Xprinter USB Vendor ID lari (opsional filtr)
          // filters: [{ usbVendorId: 0x0483 }]
        })
      }

      // Port ochish
      await port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      })

      _port = port
      _writer = port.writable.getWriter()

      // Port ma'lumotlarini saqlash
      try {
        const info = await port.getInfo()
        portInfo.value = `USB ${info.usbVendorId ? `0x${info.usbVendorId.toString(16).toUpperCase()}` : ''}:${info.usbProductId ? `0x${info.usbProductId.toString(16).toUpperCase()}` : ''}`
      } catch {
        portInfo.value = 'Serial Port'
      }

      isConnected.value = true
      console.log('[SerialPrinter] Ulandi:', portInfo.value)
      return true

    } catch (err) {
      const msg = err?.message || String(err)

      if (msg.includes('No port selected') || msg.includes('cancelled')) {
        serialError.value = 'Port tanlanmadi. Printer ulanishni qayta bosing.'
      } else if (msg.includes('already open') || msg.includes('access')) {
        serialError.value = 'Port allaqachon ishlatilmoqda. Boshqa dasturni yoping.'
      } else {
        serialError.value = msg
      }

      isConnected.value = false
      _port = null
      _writer = null
      return false
    } finally {
      isConnecting.value = false
    }
  }

  // ─── Uzilish ─────────────────────────────────────────────────────────────
  const disconnect = async () => {
    try {
      if (_writer) {
        await _writer.releaseLock()
        _writer = null
      }
      if (_port) {
        await _port.close()
        _port = null
      }
    } catch (_) {}

    isConnected.value = false
    portInfo.value = null
    console.log('[SerialPrinter] Uzildi')
  }

  // ─── Raw bytes yuborish ───────────────────────────────────────────────────
  const sendBytes = async (data) => {
    if (!_writer) throw new Error('Printer ulanmagan')
    await _writer.write(data instanceof Uint8Array ? data : new Uint8Array(data))
  }

  // ─── Matn qatori chop etish ───────────────────────────────────────────────
  const printLine = async (text = '') => {
    await sendBytes(encodeText(text + '\n'))
  }

  // ─── Ajratuvchi chiziq ────────────────────────────────────────────────────
  const printDivider = async (char = '-', width = 42) => {
    await printLine(char.repeat(width))
  }

  // ─── Ikki ustunli qator (chap + o'ng) ─────────────────────────────────────
  const printRow = async (left, right, width = 42) => {
    const leftStr  = String(left)
    const rightStr = String(right)
    const spaces   = width - leftStr.length - rightStr.length
    const padding  = spaces > 0 ? ' '.repeat(spaces) : ' '
    await printLine(leftStr + padding + rightStr)
  }

  // ─── Chek chop etish (receipt data object dan) ────────────────────────────
  /**
   * @param {Object} receipt
   * @param {string}   receipt.storeName     - Do'kon nomi
   * @param {string}   [receipt.storeAddress] - Manzil
   * @param {string}   [receipt.storePhone]   - Telefon
   * @param {string}   receipt.receiptNo     - Chek raqami
   * @param {string}   receipt.date          - Sana/vaqt
   * @param {string}   receipt.cashier       - Kassir
   * @param {Array}    receipt.items         - [{name, qty, price, total}]
   * @param {number}   receipt.subtotal      - Jami (chegirmasiz)
   * @param {number}   [receipt.discount]    - Chegirma
   * @param {number}   receipt.total         - To'lov summasi
   * @param {string}   receipt.paymentType   - To'lov usuli
   * @param {string}   [receipt.currency]    - Valyuta
   * @param {string}   [receipt.customerName] - Mijoz
   * @param {string}   [receipt.note]        - Izoh
   */
  const printReceipt = async (receipt) => {
    if (!isConnected.value || !_writer) {
      const connected = await connect()
      if (!connected) throw new Error('Printerga ulanib bo\'lmadi')
    }

    const currency = receipt.currency || 'so\'m'
    const W = 42 // 80mm printer uchun 42 belgi/qator

    const fmt = (num) => {
      if (num == null) return '0'
      return Number(num).toLocaleString('ru-RU')
    }

    try {
      // Printer initialize
      await sendBytes(bytes(CMD.INIT))
      await sendBytes(bytes(CMD.LINE_SPACING))

      // ── Do'kon sarlavhasi ──────────────────────────────────────────────────
      await sendBytes(bytes(CMD.ALIGN_CENTER))
      await sendBytes(bytes(CMD.BOLD_ON))
      await sendBytes(bytes(CMD.DOUBLE_SIZE))
      await printLine(receipt.storeName || 'SIRIUS POS')
      await sendBytes(bytes(CMD.NORMAL_SIZE))
      await sendBytes(bytes(CMD.BOLD_OFF))

      if (receipt.storeAddress) await printLine(receipt.storeAddress)
      if (receipt.storePhone)   await printLine(receipt.storePhone)

      await sendBytes(bytes(CMD.ALIGN_LEFT))
      await printDivider('=', W)

      // ── Chek ma'lumotlari ──────────────────────────────────────────────────
      await printRow('CHEK #' + (receipt.receiptNo || ''), receipt.date || '', W)
      if (receipt.cashier) await printRow('Kassir:', receipt.cashier, W)
      if (receipt.customerName) await printRow('Mijoz:', receipt.customerName, W)
      await printDivider('-', W)

      // ── Mahsulotlar ────────────────────────────────────────────────────────
      await sendBytes(bytes(CMD.BOLD_ON))
      await printLine('TOVARLAR')
      await sendBytes(bytes(CMD.BOLD_OFF))
      await printDivider('-', W)

      for (const item of (receipt.items || [])) {
        // Mahsulot nomi (uzun bo'lsa keyingi qatorga o'tadi)
        const name = String(item.name || '')
        if (name.length > W - 2) {
          // Uzun nomni bo'lib chiqarish
          const chunks = name.match(new RegExp(`.{1,${W - 2}}`, 'g')) || [name]
          for (const chunk of chunks) await printLine(chunk)
        } else {
          await printLine(name)
        }

        // Miqdor × narx = jami
        const qtyPrice = `  ${fmt(item.qty)} x ${fmt(item.price)}`
        const total    = `${fmt(item.total)} ${currency}`
        await printRow(qtyPrice, total, W)
      }

      await printDivider('-', W)

      // ── Hisob ──────────────────────────────────────────────────────────────
      if (receipt.subtotal != null && receipt.discount) {
        await printRow('Jami:', `${fmt(receipt.subtotal)} ${currency}`, W)
        await printRow('Chegirma:', `-${fmt(receipt.discount)} ${currency}`, W)
        await printDivider('-', W)
      }

      await sendBytes(bytes(CMD.BOLD_ON))
      await sendBytes(bytes(CMD.DOUBLE_SIZE))
      await sendBytes(bytes(CMD.ALIGN_CENTER))
      await printLine(`TO'LOV: ${fmt(receipt.total)} ${currency}`)
      await sendBytes(bytes(CMD.NORMAL_SIZE))
      await sendBytes(bytes(CMD.BOLD_OFF))
      await sendBytes(bytes(CMD.ALIGN_LEFT))
      await printDivider('-', W)

      // ── To'lov usuli ──────────────────────────────────────────────────────
      const paymentLabels = {
        cash:   'Naqd pul',
        card:   'Plastik karta',
        mixed:  'Aralash',
        debt:   'Nasiya',
      }
      const payLabel = paymentLabels[receipt.paymentType] || receipt.paymentType || 'Naqd'
      await printRow("To'lov usuli:", payLabel, W)

      // ── Izoh ──────────────────────────────────────────────────────────────
      if (receipt.note) {
        await printDivider('-', W)
        await printLine('Izoh: ' + receipt.note)
      }

      await printDivider('=', W)

      // ── Pastki qism ───────────────────────────────────────────────────────
      await sendBytes(bytes(CMD.ALIGN_CENTER))
      await printLine('Xarid uchun rahmat!')
      await printLine('Yana kelishingizni kutamiz')
      await sendBytes(bytes(CMD.ALIGN_LEFT))

      // Qog'oz siljitish + kesish
      await sendBytes(bytes(CMD.FEED_5))
      await sendBytes(bytes(CMD.CUT))

      console.log('[SerialPrinter] Chek muvaffaqiyatli chop etildi')
      return true

    } catch (err) {
      // Port uzilgan bo'lishi mumkin — holatni reset qilamiz
      console.error('[SerialPrinter] Chop etishda xato:', err)
      isConnected.value = false
      _writer = null
      _port = null
      throw err
    }
  }

  // ─── Test chop etish ─────────────────────────────────────────────────────
  const printTest = async () => {
    if (!isConnected.value) {
      const ok = await connect()
      if (!ok) return false
    }

    const W = 42
    await sendBytes(bytes(CMD.INIT))
    await sendBytes(bytes(CMD.ALIGN_CENTER))
    await sendBytes(bytes(CMD.BOLD_ON))
    await printLine('=== TEST CHEK ===')
    await sendBytes(bytes(CMD.BOLD_OFF))
    await sendBytes(bytes(CMD.ALIGN_LEFT))
    await printLine('Sirius POS - Web Serial')
    await printLine('Printer muvaffaqiyatli ulandi!')
    await printDivider('-', W)
    await printLine(new Date().toLocaleString('uz-UZ'))
    await sendBytes(bytes(CMD.FEED_5))
    await sendBytes(bytes(CMD.CUT))
    return true
  }

  return {
    // Holat
    isConnected:  readonly(isConnected),
    isConnecting: readonly(isConnecting),
    serialError:  readonly(serialError),
    portInfo:     readonly(portInfo),

    // Metodlar
    connect,
    disconnect,
    printReceipt,
    printTest,
    isWebSerialSupported,
    sendBytes,
    printLine,
    printRow,
    printDivider,
  }
}
