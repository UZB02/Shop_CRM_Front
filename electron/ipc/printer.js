import { ipcMain, BrowserWindow, app } from 'electron'
import fs from 'fs/promises'
import { readdirSync } from 'fs'
import os from 'os'
import path from 'path'
import { spawn } from 'child_process'
import ptp from 'pdf-to-printer'

const { print: printPdf } = ptp

// ─── Xom (RAW) chop etish — TSPL/ESC-POS baytlarini printerga to'g'ridan-to'g'ri ──
// Windows spooler'ga winspool (OpenPrinter/StartDocPrinter "RAW"/WritePrinter)
// orqali yuboramiz. Native npm modul kerak emas — PowerShell + Add-Type (C#).
// Bu die-cut yorliqlarda drayver materialini chetlab o'tadi: printer firmware'i
// SIZE/GAP buyruqlari asosida markazlash va yorliq oralig'ini o'zi hal qiladi.
const RAW_PRINT_PS1 = `
param([string]$Printer, [string]$DataPath)
$ErrorActionPreference = 'Stop'
$bytes = [System.IO.File]::ReadAllBytes($DataPath)
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class SiriusRawPrinter {
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
  public struct DOCINFOW {
    [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
    [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
    [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
  }
  [DllImport("winspool.Drv", EntryPoint="OpenPrinterW", SetLastError=true, CharSet=CharSet.Unicode)]
  public static extern bool OpenPrinter(string src, out IntPtr hPrinter, IntPtr pd);
  [DllImport("winspool.Drv", EntryPoint="ClosePrinter", SetLastError=true)]
  public static extern bool ClosePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="StartDocPrinterW", SetLastError=true, CharSet=CharSet.Unicode)]
  public static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFOW di);
  [DllImport("winspool.Drv", EntryPoint="EndDocPrinter", SetLastError=true)]
  public static extern bool EndDocPrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="StartPagePrinter", SetLastError=true)]
  public static extern bool StartPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="EndPagePrinter", SetLastError=true)]
  public static extern bool EndPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="WritePrinter", SetLastError=true)]
  public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);
  public static string Send(string printer, byte[] bytes) {
    IntPtr h;
    if (!OpenPrinter(printer, out h, IntPtr.Zero))
      return "OPEN_FAILED:" + Marshal.GetLastWin32Error();
    DOCINFOW di = new DOCINFOW();
    di.pDocName = "SiriusPOS Label"; di.pDataType = "RAW";
    string err = null;
    if (StartDocPrinter(h, 1, ref di)) {
      if (StartPagePrinter(h)) {
        IntPtr p = Marshal.AllocCoTaskMem(bytes.Length);
        Marshal.Copy(bytes, 0, p, bytes.Length);
        int written;
        if (!WritePrinter(h, p, bytes.Length, out written))
          err = "WRITE_FAILED:" + Marshal.GetLastWin32Error();
        Marshal.FreeCoTaskMem(p);
        EndPagePrinter(h);
      } else { err = "STARTPAGE_FAILED:" + Marshal.GetLastWin32Error(); }
      EndDocPrinter(h);
    } else { err = "STARTDOC_FAILED:" + Marshal.GetLastWin32Error(); }
    ClosePrinter(h);
    return err == null ? "OK" : err;
  }
}
'@
$result = [SiriusRawPrinter]::Send($Printer, $bytes)
if ($result -ne "OK") { Write-Error $result; exit 1 }
Write-Output "OK"
`

async function sendRawToPrinter(printerName, buffer) {
  if (!printerName || !printerName.trim()) throw new Error('RAW chop etish uchun printer nomi kerak')
  const stamp = Date.now()
  const binPath = path.join(os.tmpdir(), `sirius-raw-${stamp}.bin`)
  const ps1Path = path.join(os.tmpdir(), `sirius-raw-${stamp}.ps1`)
  await fs.writeFile(binPath, buffer)
  await fs.writeFile(ps1Path, RAW_PRINT_PS1, 'utf-8')

  try {
    await new Promise((resolve, reject) => {
      const ps = spawn('powershell.exe', [
        '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
        '-File', ps1Path, '-Printer', printerName.trim(), '-DataPath', binPath,
      ])
      let stderr = ''
      ps.stderr.on('data', (d) => { stderr += d.toString() })
      ps.on('error', reject)
      ps.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`RAW chop etish xatosi (kod ${code}): ${stderr.trim() || 'nomaʼlum'}`))
      })
    })
    console.log('[printer.js] ✅ RAW (TSPL) chop etishga yuborildi:', printerName, buffer.length, 'bayt')
    return { success: true }
  } finally {
    setTimeout(() => { fs.unlink(binPath).catch(() => {}); fs.unlink(ps1Path).catch(() => {}) }, 10000)
  }
}

// 1 dyuym = 96px (CSS). Termal rulon kengligi:
//   80mm ≈ 3.15 dyuym,  58mm ≈ 2.28 dyuym
const WIDTH_INCHES = { '80': 3.15, '58': 2.28 }

// Paketlangan (.exe) rejimda pdf-to-printer ichidagi SumatraPDF.exe
// asar ichida bo'lgani uchun ishga tushmaydi — asarUnpack qilingan joydan olamiz.
function getSumatraPath() {
  if (!app.isPackaged) return undefined // dev rejimda pdf-to-printer o'zi topadi
  try {
    const distDir = path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      'node_modules',
      'pdf-to-printer',
      'dist',
    )
    const exe = readdirSync(distDir).find((f) => f.toLowerCase().endsWith('.exe'))
    return exe ? path.join(distDir, exe) : undefined
  } catch (e) {
    console.warn('[printer.js] SumatraPDF yo\'lini topib bo\'lmadi:', e.message)
    return undefined
  }
}

async function printHtml({ html, printerName, paperSize = '80', labelWidthMm = null, labelHeightMm = null, copies = 1 }) {
  const stamp = Date.now()
  const tmpHtml = path.join(os.tmpdir(), `sirius-receipt-${stamp}.html`)
  const tmpPdf = path.join(os.tmpdir(), `sirius-receipt-${stamp}.pdf`)
  await fs.writeFile(tmpHtml, html, 'utf-8')

  // Barcode rejimi: labelWidthMm/labelHeightMm berilsa — PDF aynan yorliq o'lchamida
  const isLabel = labelWidthMm > 0 && labelHeightMm > 0
  const widthIn = isLabel ? labelWidthMm / 25.4 : (WIDTH_INCHES[paperSize] || WIDTH_INCHES['80'])
  const widthPx = Math.round(widthIn * 96)

  const win = new BrowserWindow({
    show: false,
    width: widthPx,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // loadFile uchun
    },
  })

  try {
    await win.loadFile(tmpHtml)

    // Rasmlar (barcode, QR) to'liq yuklanishini kutamiz — maksimal 3 soniya.
    // Barcode rasmi backend'dan (remote URL) keladi, shuning uchun bu muhim.
    await win.webContents
      .executeJavaScript(`
        new Promise((resolve) => {
          const imgs = Array.from(document.images || [])
          if (imgs.length === 0) return resolve(true)
          let done = 0
          const check = () => { done++; if (done >= imgs.length) resolve(true) }
          imgs.forEach((img) => {
            if (img.complete) check()
            else { img.onload = check; img.onerror = check }
          })
          setTimeout(() => resolve(true), 3000)
        })
      `)
      .catch(() => {})
    // Layout barqarorlashishi uchun kichik qo'shimcha kutish
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Balandlik: barcode rejimida — aniq yorliq balandligi; chekда — kontentга qarab
    let heightIn
    if (isLabel) {
      heightIn = labelHeightMm / 25.4
    } else {
      const heightPx = await win.webContents
        .executeJavaScript('document.body.scrollHeight')
        .catch(() => 0)
      heightIn = heightPx > 0 ? heightPx / 96 + 0.15 : 11
    }

    // ── 1-bosqich: HTML → PDF (webContents.printToPDF — bu yo'l ishonchli) ──
    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      pageSize: { width: widthIn, height: Math.max(1, heightIn) },
    })
    await fs.writeFile(tmpPdf, pdfBuffer)
    console.log(`[printer.js] PDF yaratildi (${isLabel ? 'barcode ' + labelWidthMm + 'x' + labelHeightMm + 'mm' : 'chek'}):`, pdfBuffer.length, 'bayt')

    // ── 2-bosqich: PDF → printer (pdf-to-printer / SumatraPDF, jimgina) ──
    //  • chek:    scale 'fit'     — drayverdagi qog'oz kengligiga moslashadi
    //  • barcode: scale 'noscale' — PDF aniq yorliq o'lchamida, 1:1 chiqadi
    const options = { scale: isLabel ? 'noscale' : 'fit' }
    if (printerName && printerName.trim()) options.printer = printerName.trim()
    const n = Math.max(1, Math.min(100, parseInt(copies, 10) || 1))
    if (n > 1) options.copies = n
    const sumatra = getSumatraPath()
    if (sumatra) options.sumatraPdfPath = sumatra

    console.log('[printer.js] pdf-to-printer options:', JSON.stringify(options))
    await printPdf(tmpPdf, options)
    console.log('[printer.js] ✅ chop etishga yuborildi')

    return { success: true }
  } finally {
    win.destroy()
    fs.unlink(tmpHtml).catch(() => {})
    // PDF ni SumatraPDF o'qib bo'lgach o'chiramiz
    setTimeout(() => fs.unlink(tmpPdf).catch(() => {}), 15000)
  }
}

export function registerPrinterHandlers() {
  // Printerlar ro'yxatini qaytaradi
  ipcMain.handle('printer:list', async () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return []
    try {
      const list = await win.webContents.getPrintersAsync()
      console.log('[printer.js] printers:', list.map((p) => p.name))
      return list
    } catch (e) {
      console.warn('[printer.js] getPrintersAsync xato:', e)
      return []
    }
  })

  // HTML chop etish
  ipcMain.handle('printer:print', async (_event, payload) => {
    console.log('[printer.js] printer:print payload:', payload?.printerName, 'paperSize:', payload?.paperSize)
    try {
      return await printHtml(payload)
    } catch (error) {
      console.error('[printer.js] printHtml xato:', error.message)
      return { success: false, error: error.message }
    }
  })

  // Xom (RAW) chop etish — TSPL/ESC-POS baytlarini printerga to'g'ridan-to'g'ri
  //   payload: { printerName, text?, dataBase64? }
  //   text     — ASCII TSPL buyruqlari (latin1 kodlanadi)
  //   dataBase64 — binar ma'lumot (masalan BITMAP) base64 ko'rinishida
  ipcMain.handle('printer:printRaw', async (_event, payload = {}) => {
    try {
      const { printerName, text, dataBase64 } = payload
      let buffer
      if (dataBase64) buffer = Buffer.from(dataBase64, 'base64')
      else if (typeof text === 'string') buffer = Buffer.from(text, 'latin1')
      else throw new Error('RAW chop etish uchun text yoki dataBase64 kerak')
      return await sendRawToPrinter(printerName, buffer)
    } catch (error) {
      console.error('[printer.js] printRaw xato:', error.message)
      return { success: false, error: error.message }
    }
  })

  // TSPL sinov yorlig'i — printer TSPL tilini qo'llab-quvvatlashini tekshirish
  //   payload: { printerName, widthMm, heightMm, gapMm }
  ipcMain.handle('printer:testTspl', async (_event, payload = {}) => {
    try {
      const { printerName } = payload
      const w = Number(payload.widthMm) || 57
      const h = Number(payload.heightMm) || 35
      const gap = Number(payload.gapMm) || 2
      // Ramka + markazdagi matn + barcode: markazlashuv va gap-sensor sinovi
      const tspl = [
        `SIZE ${w} mm,${h} mm`,
        `GAP ${gap} mm,0 mm`,
        `DIRECTION 1`,
        `REFERENCE 0,0`,
        `CLS`,
        `BOX 8,8,${Math.round(w * 8) - 8},${Math.round(h * 8) - 8},2`,
        `TEXT ${Math.round(w * 4)},30,"3",0,1,1,"TSPL TEST OK"`,
        `BARCODE ${Math.round(w * 8 / 2) - 90},70,"128",70,1,0,2,4,"SIRIUS123"`,
        `PRINT 1,1`,
        ``,
      ].join('\r\n')
      return await sendRawToPrinter(printerName, Buffer.from(tspl, 'latin1'))
    } catch (error) {
      console.error('[printer.js] testTspl xato:', error.message)
      return { success: false, error: error.message }
    }
  })
}
