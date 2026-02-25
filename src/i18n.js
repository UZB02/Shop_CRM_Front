import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import uz_cy from './locales/uz_cy.json'

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'uz',
    fallbackLocale: 'uz',
    messages: {
        uz,
        uz_cy
    }
})

export default i18n
