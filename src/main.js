import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primevue/themes/aura'
import Tooltip from 'primevue/tooltip'
import Dialog from 'primevue/dialog'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './assets/styles/main.css'
import 'primeicons/primeicons.css'

// Security: Clear localStorage data if it's a new browser session (except preferences)
if (!sessionStorage.getItem('session_active')) {
    const preservedKeys = ['theme', 'lang']
    Object.keys(localStorage).forEach(key => {
        if (!preservedKeys.includes(key)) {
            localStorage.removeItem(key)
        }
    })
    sessionStorage.setItem('session_active', 'true')
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
})
app.use(ToastService)
app.use(ConfirmationService)
app.component('Dialog', Dialog)
app.directive('tooltip', Tooltip)

app.mount('#app')

// Ensure initial overlay hides even if no API calls were triggered
setTimeout(() => { if (window.stopLoader) window.stopLoader(); }, 2000);

// Global PWA Install Handler
window.deferredInstallPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.deferredInstallPrompt = e
  window.dispatchEvent(new CustomEvent('pwa-install-ready'))
})
window.addEventListener('appinstalled', () => {
  window.deferredInstallPrompt = null
  window.dispatchEvent(new CustomEvent('pwa-installed'))
})
