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
            <Button label="Kirish" icon="pi pi-user" outlined @click="$router.push('/login')" class="p-button-sm p-button-rounded" />
          </div>

          <div class="md:hidden flex items-center">
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
              <Button label="Kirish" icon="pi pi-user" class="w-full p-button-lg" @click="$router.push('/login')" />
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <section class="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Savdo Biznesingizni <br/>
          <span class="text-emerald-500">Professional Darajada</span> Avtomatlashtiring
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Kompyuter, oziq-ovqat, texnika do'konlari va boshqa barcha turdagi savdo markazlari uchun yagona boshqaruv tizimi.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <Button label="Bepul Boshlash" icon="pi pi-rocket" severity="success" size="large" class="shadow-lg shadow-emerald-500/20 px-8" />
          <Button label="Tariflar" icon="pi pi-info-circle" severity="secondary" outlined size="large" class="px-8" />
        </div>
      </div>
    </section>

    <section id="features" class="py-24 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Nega aynan Shop Searem?</h2>
          <p class="text-slate-500 mt-4 text-lg">Biznesingiz samaradorligini oshirish uchun kerakli barcha vositalar</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <Card v-for="(feature, index) in features" :key="index" class="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-50/50 dark:bg-slate-800/50">
            <template #title>
              <div class="flex items-center gap-4">
                <div class="p-3 bg-emerald-500/10 rounded-xl">
                  <i :class="[feature.icon, 'text-2xl text-emerald-500']"></i>
                </div>
                <span class="text-xl font-bold">{{ feature.title }}</span>
              </div>
            </template>
            <template #content>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ feature.desc }}</p>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <section id="pricing" class="py-24 bg-slate-50 dark:bg-slate-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Qulay Tariflar</h2>
          <p class="text-slate-500 mt-4 text-lg">Biznesingiz hajmiga mos keladigan tarifni tanlang</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          <div v-for="(plan, index) in plans" :key="index" 
               class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col relative transition-all duration-300"
               :class="{'ring-2 ring-emerald-500 scale-105 shadow-2xl z-10': plan.popular}">
            
            <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Mashhur
            </div>

            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p class="text-slate-500 mb-6 h-10">{{ plan.desc }}</p>
            
            <div class="flex items-baseline gap-1 mb-8">
              <span class="text-4xl font-black text-slate-900 dark:text-white">{{ plan.price }}</span>
              <span class="text-slate-500 font-medium">so'm/{{ plan.unit }}</span>
            </div>

            <ul class="space-y-4 mb-10 flex-grow">
              <li v-for="feat in plan.features" :key="feat" class="flex items-center gap-3">
                <i class="pi pi-check text-emerald-500 font-bold"></i>
                <span class="text-slate-600 dark:text-slate-300">{{ feat }}</span>
              </li>
            </ul>

            <Button 
              :label="plan.cta" 
              :severity="plan.popular ? 'success' : 'secondary'" 
              :outlined="!plan.popular" 
              class="w-full p-button-lg p-button-rounded transition-transform active:scale-95" 
              @click="handleBuy(plan)" 
            />
          </div>
        </div>
      </div>
    </section>

    <footer class="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-slate-500 font-medium">&copy; 2026 Shop Searem. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'

// State for mobile menu
const isMenuOpen = ref(false)

const navLinks = [
  { text: "Xususiyatlar", href: "#features", icon: "pi pi-star" },
  { text: "Tariflar", href: "#pricing", icon: "pi pi-tag" },
  { text: "Biz haqimizda", href: "#about", icon: "pi pi-info-circle" }
]

const features = [
  { title: "Sklad Boshqaruvi", icon: "pi pi-box", desc: "Mahsulotlar qoldig'ini real vaqtda kuzating. Avtomatik inventarizatsiya va ogohlantirishlar tizimi." },
  { title: "Savdo Taxlili", icon: "pi pi-chart-line", desc: "Murakkab grafiklar va chuqur tahlillar. Daromad va xarajatlarni hisoblash endi oson." },
  { title: "Filiallar", icon: "pi pi-map-marker", desc: "Dunyoning istalgan nuqtasidan barcha filiallar savdosini real vaqt rejimida boshqaring." }
]

const plans = [
  { 
    name: "Startap", 
    price: "199,000", 
    unit: "oy", 
    desc: "Kichik va yangi boshlangan bizneslar uchun ideal tanlov.", 
    cta: "Sotib olish", 
    features: ["1 ta filial", "3 ta foydalanuvchi", "Asosiy hisobotlar", "Telegram bot integratsiyasi"] 
  },
  { 
    name: "Biznes", 
    price: "499,000", 
    unit: "oy", 
    desc: "O'sishda davom etayotgan o'rta va yirik tadbirkorlar uchun.", 
    popular: true, 
    cta: "Sotib olish", 
    features: ["Cheksiz filiallar", "10 tagacha foydalanuvchi", "Kengaytirilgan tahlillar", "24/7 Priority support", "API kirish"] 
  },
  { 
    name: "Yillik", 
    price: "4,999,000", 
    unit: "yil", 
    desc: "Katta tejash va uzoq muddatli barqarorlikni xohlovchilar uchun.", 
    cta: "Sotib olish", 
    features: ["Cheksiz filiallar", "Cheksiz foydalanuvchilar", "Barcha VIP funksiyalar", "2 oy mutlaqo bepul"] 
  }
]

const handleBuy = (plan) => {
  localStorage.setItem('selectedPlan', JSON.stringify(plan))
  // Senior approach: Use router for internal navigation if possible
  // window.location.href = '/payment/method'
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