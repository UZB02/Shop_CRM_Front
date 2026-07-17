import { ipcMain } from 'electron'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater

export function registerUpdaterHandlers(mainWindow) {
  // Qo'lda usul: o'zi yuklamaydi/o'rnatmaydi — foydalanuvchi tugma bilan boshqaradi
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  const send = (channel, payload) => {
    try { mainWindow?.webContents?.send(channel, payload) } catch (_) {}
  }

  autoUpdater.on('update-available', (info) => send('update-available', info))
  autoUpdater.on('update-not-available', (info) => send('update-not-available', info))
  autoUpdater.on('download-progress', (p) =>
    send('update-progress', {
      percent: p?.percent ?? 0,
      transferred: p?.transferred ?? 0,
      total: p?.total ?? 0,
      bytesPerSecond: p?.bytesPerSecond ?? 0,
    }),
  )
  autoUpdater.on('update-downloaded', (info) => send('update-downloaded', info))
  autoUpdater.on('error', (error) => send('update-error', { message: error?.message || String(error) }))

  ipcMain.handle('updater:check', () => autoUpdater.checkForUpdates())
  ipcMain.handle('updater:download', () => autoUpdater.downloadUpdate())
  ipcMain.handle('updater:install', () => autoUpdater.quitAndInstall())

  // Startда jimgina tekshirish (dev'da yoki internet bo'lmasa xatoni yutamiz)
  autoUpdater.checkForUpdates().catch(() => {})
}
