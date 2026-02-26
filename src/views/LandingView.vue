<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <nav class="sticky top-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center cursor-pointer" @click="$router.push('/')">
            <span class="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Shop Searem
            </span>
          </div>

          <div class="hidden md:flex space-x-8 items-center font-medium text-slate-600 dark:text-slate-300">
            <a v-for="link in navLinks" :key="link.href" :href="link.href" class="hover:text-emerald-500 transition-colors">
              {{ link.text }}
            </a>
            
            <div class="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6 ml-2">
              <Button 
                :label="locale === 'uz' ? 'O\'z' : 'Ўз'" 
                @click="toggleLang" 
                text 
                rounded 
                class="p-button-sm font-bold"
                :class="locale === 'uz' ? 'text-emerald-600' : 'text-slate-500'"
              />
            </div>

            <Button :label="$t('landing.nav.login')" icon="pi pi-user" outlined @click="$router.push('/login')" class="p-button-sm p-button-rounded" />
          </div>

          <div class="md:hidden flex items-center gap-2">
            <Button 
              :label="locale === 'uz' ? 'O\'z' : 'Ўз'" 
              @click="toggleLang" 
              text 
              rounded 
              class="p-button-sm"
            />
            <Button 
              :icon="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'" 
              @click="isMenuOpen = !isMenuOpen" 
              text 
              rounded 
              severity="secondary"
              aria-label="Menu"
            />
          </div>
        </div>
      </div>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMenuOpen" class="absolute inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 md:hidden z-50 shadow-xl">
          <div class="px-4 pt-2 pb-6 space-y-1">
            <a 
              v-for="link in navLinks" 
              :key="link.href" 
              :href="link.href" 
              @click="isMenuOpen = false"
              class="block px-3 py-4 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
            >
              <i :class="[link.icon, 'mr-3 text-emerald-500']"></i>
              {{ link.text }}
            </a>
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button :label="$t('landing.nav.login')" icon="pi pi-user" class="w-full p-button-lg" @click="$router.push('/login')" />
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <section class="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl xs:text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          {{ $t('landing.hero.title_part1') }} <br class="hidden sm:block"/>
          <span class="text-emerald-500">{{ $t('landing.hero.title_highlight') }}</span> {{ $t('landing.hero.title_part2') }}
        </h1>
        <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          {{ $t('landing.hero.description') }}
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <Button :label="$t('landing.hero.start_free')" icon="pi pi-rocket" severity="success" size="large" class="shadow-lg shadow-emerald-500/20 px-8 w-full sm:w-auto" />
          <Button :label="$t('landing.hero.pricing')" icon="pi pi-info-circle" severity="secondary" outlined size="large" class="px-8 w-full sm:w-auto" />
        </div>
      </div>
    </section>

    <section id="features" class="py-16 sm:py-24 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{{ $t('landing.features.title') }}</h2>
          <p class="text-slate-500 mt-4 text-lg">{{ $t('landing.features.subtitle') }}</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card v-for="(feature, index) in features" :key="index" class="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-50/50 dark:bg-slate-800/50">
            <template #title>
              <div class="flex items-center gap-4">
                <div class="p-3 bg-emerald-500/10 rounded-xl">
                  <i :class="[feature.icon, 'text-2xl text-emerald-500']"></i>
                </div>
                <span class="text-lg sm:text-xl font-bold">{{ feature.title }}</span>
              </div>
            </template>
            <template #content>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">{{ feature.desc }}</p>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <section id="pricing" class="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{{ $t('landing.pricing.title') }}</h2>
          <p class="text-slate-500 mt-4 text-lg">{{ $t('landing.pricing.subtitle') }}</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <div v-for="(plan, index) in plans" :key="index" 
               class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col relative transition-all duration-300"
               :class="{'ring-2 ring-emerald-500 sm:scale-105 shadow-2xl z-10': plan.popular, 'mb-6 sm:mb-0': plan.popular && index !== plans.length - 1}">
            
            <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              {{ $t('landing.pricing.popular') }}
            </div>

            <h3 class="text-xl sm:text-2xl font-bold mb-2 text-slate-900 dark:text-white">{{ plan.name }}</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-6 h-auto sm:h-12 text-sm sm:text-base">{{ plan.desc }}</p>
            
            <div class="flex items-baseline flex-wrap gap-1 mb-8">
              <span class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{{ plan.price }}</span>
              <span class="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">so'm/{{ plan.unit === 'oy' ? $t('landing.pricing.unit_month') : $t('landing.pricing.unit_year') }}</span>
            </div>

            <ul class="space-y-4 mb-10 flex-grow">
              <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-3">
                <i class="pi pi-check text-emerald-500 font-bold mt-1 shrink-0"></i>
                <span class="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{{ feat }}</span>
              </li>
            </ul>

            <Button 
              :label="$t('landing.pricing.buy')" 
              :severity="plan.popular ? 'success' : 'secondary'" 
              :outlined="!plan.popular" 
              class="w-full p-button-lg p-button-rounded transition-transform active:scale-95 mt-auto" 
              @click="handleBuy(plan)" 
            />
          </div>
        </div>
      </div>
    </section>

    <footer class="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-slate-500 font-medium text-sm sm:text-base">&copy; 2026 Shop Searem. {{ $t('landing.footer.rights') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Card from 'primevue/card'

const { t, tm, locale } = useI18n()

// State for mobile menu
const isMenuOpen = ref(false)

const toggleLang = () => {
  locale.value = locale.value === 'uz' ? 'uz_cy' : 'uz'
  localStorage.setItem('lang', locale.value)
}

const navLinks = computed(() => [
  { text: t("landing.nav.features"), href: "#features", icon: "pi pi-star" },
  { text: t("landing.nav.pricing"), href: "#pricing", icon: "pi pi-tag" },
  { text: t("landing.nav.about"), href: "#about", icon: "pi pi-info-circle" }
])

const features = computed(() => [
  { title: t("landing.features.items.warehouse.title"), icon: "pi pi-box", desc: t("landing.features.items.warehouse.desc") },
  { title: t("landing.features.items.analytics.title"), icon: "pi pi-chart-line", desc: t("landing.features.items.analytics.desc") },
  { title: t("landing.features.items.branches.title"), icon: "pi pi-map-marker", desc: t("landing.features.items.branches.desc") }
])

const plans = computed(() => [
  { 
    name: t("landing.pricing.plans.startup.name"), 
    price: "199,000", 
    unit: "oy", 
    desc: t("landing.pricing.plans.startup.desc"), 
    features: tm("landing.pricing.plans.startup.features") 
  },
  { 
    name: t("landing.pricing.plans.business.name"), 
    price: "499,000", 
    unit: "oy", 
    desc: t("landing.pricing.plans.business.desc"), 
    popular: true, 
    features: tm("landing.pricing.plans.business.features") 
  },
  { 
    name: t("landing.pricing.plans.annual.name"), 
    price: "4,999,000", 
    unit: "yil", 
    desc: t("landing.pricing.plans.annual.desc"), 
    features: tm("landing.pricing.plans.annual.features") 
  }
])

const handleBuy = (plan) => {
  localStorage.setItem('selectedPlan', JSON.stringify(plan))
  console.log('Selected plan:', plan.name)
}
</script>

<style scoped>
/* Qo'shimcha silliq skroll effektlari */
html {
  scroll-behavior: smooth;
}

/* Card hover effekti uchun PrimeVue stilini biroz moslash */
:deep(.p-card) {
  border-radius: 1.25rem;
}

:deep(.p-card-body) {
  padding: 2rem;
}
</style>