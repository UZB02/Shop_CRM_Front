import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primevue/themes/aura'
import Tooltip from 'primevue/tooltip'
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
app.directive('tooltip', Tooltip)

app.mount('#app')
