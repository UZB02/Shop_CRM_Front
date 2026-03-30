<template>
  <div class="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto min-h-screen pb-20">
    <!-- Breadcrumbs / Top Navigation Feel -->
    <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
      <router-link to="/dashboard/warehouse" class="hover:text-emerald-500 transition-colors">Omborlar</router-link>
      <i class="pi pi-chevron-right text-[8px]"></i>
      <span class="text-slate-600 dark:text-slate-300">{{ warehouse?.name }}</span>
    </div>

    <!-- Professional Compact Header -->
    <div class="relative bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-5 sm:p-8 overflow-hidden shadow-sm">
      <!-- Decorative background element -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl invisible sm:visible"></div>
      
      <div class="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5">
          <!-- Main Icon - More Compact -->
          <div class="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <i class="pi pi-box text-white text-xl sm:text-2xl"></i>
          </div>
          
          <div class="text-center sm:text-left space-y-2">
            <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <h1 class="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight line-clamp-1">
                {{ warehouse?.name }}
              </h1>
              <div 
                class="px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0"
                :class="warehouse?.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'"
              >
                <div class="w-1 h-1 rounded-full" :class="warehouse?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></div>
                {{ warehouse?.status === 'active' ? 'FAOL' : 'NOFAOL' }}
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 justify-center sm:justify-start">
              <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <i class="pi pi-building text-emerald-500 text-[10px]"></i>
                {{ warehouse?.store_name }}
              </p>
              <p class="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 uppercase tracking-wide">
                <i class="pi pi-map-marker text-emerald-500/50 text-[10px]"></i>
                {{ warehouse?.address }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Stats - More Compact & Elegant -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center min-w-[110px]">
              <span class="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Sana</span>
              <span class="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight whitespace-nowrap">{{ warehouse?.created_on?.split('|')[0] || '—' }}</span>
            </div>
          </div>

          <button 
            @click="openMovementDialog"
            class="h-11 sm:h-12 w-full sm:w-auto px-6 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 sm:ml-2"
          >
            <i class="pi pi-sync text-xs"></i>
            <span>Harakat</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="space-y-6">
      <div class="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 sm:flex-none px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
          :class="activeTab === tab.id 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tabs-content min-h-[400px]">
        <Transition name="fade-slide" mode="out-in">
          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" key="products" class="lg:col-span-4">
            <div class="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-4 sm:p-8 min-h-[500px] flex flex-col relative overflow-hidden shadow-sm">
              <!-- Section Header for Table -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 px-2">
                <h3 class="text-[10px] sm:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em] flex items-center gap-3 text-center sm:text-left">
                  <span class="hidden sm:block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Zaxira Ob'ektlari Ro'yxati
                </h3>
                <div class="px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/50 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                  Jami: {{ warehouse?.products?.length || 0 }} xil mahsulot
                </div>
              </div>

              <!-- Inventory List View -->
              <div v-if="warehouse?.products?.length">
                <!-- Table View -->
                <div class="hidden sm:block overflow-x-auto custom-scrollbar">
                  <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr class="bg-slate-50/50 dark:bg-slate-800/30">
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">№</th>
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">Mahsulot Nomi</th>
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">Shtrix-kod</th>
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">Miqdori</th>
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">Xarid Narxi</th>
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">Sotuv Narxi</th>
                        <th class="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">Qo'shilgan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in warehouse.products" :key="item.product_id" class="group border-b border-slate-50 dark:border-slate-800/50 hover:bg-emerald-500/[0.02] transition-colors">
                        <td class="px-6 py-4">
                          <span class="text-[10px] font-bold text-slate-400 tracking-tight">{{ index + 1 }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex flex-col">
                            <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{{ item.product_name }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-[10px] font-bold text-slate-400 tracking-widest font-mono bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">{{ item.barcode }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <span class="text-[11px] font-black tracking-tight">{{ item.quantity }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">{{ Number(item.purchase_price).toLocaleString() }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <span class="text-[11px] font-black text-slate-900 dark:text-slate-100 tracking-tight">{{ Number(item.sale_price).toLocaleString() }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-[10px] font-bold text-slate-400 tracking-tight uppercase">{{ item.added_on?.split('|')[0] || '—' }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Card View -->
                <div class="block sm:hidden space-y-4">
                  <div v-for="(item, index) in warehouse.products" :key="item.product_id" class="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
                    <div class="flex justify-between items-start gap-3">
                      <div class="flex-grow">
                        <h4 class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ item.product_name }}</h4>
                        <span class="text-[9px] font-bold text-slate-400 tracking-widest font-mono mt-1 block tracking-wider">{{ item.barcode }}</span>
                      </div>
                      <div class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black">
                        {{ item.quantity }}
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <div class="flex flex-col gap-1">
                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Xarid Narxi</span>
                        <span class="text-[11px] font-bold text-slate-500">{{ Number(item.purchase_price).toLocaleString() }}</span>
                      </div>
                      <div class="flex flex-col gap-1 text-right">
                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sotuv Narxi</span>
                        <span class="text-[11px] font-black text-slate-900 dark:text-slate-100">{{ Number(item.sale_price).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="flex-grow flex flex-col items-center justify-center py-20 relative z-10">
                <div class="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm">
                  <i class="pi pi-database text-2xl text-slate-300"></i>
                </div>
                <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">Zaxira Ob'ektlari</h3>
                <p class="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">Ushbu omborda hozirda mahsulotlar mavjud emas</p>
              </div>
            </div>
          </div>

          <!-- Transfers Tab -->
          <div v-else-if="activeTab === 'transfers'" key="transfers">
            <TransfersTab 
              :source-id="warehouse?.id || warehouse?._id"
              source-type="warehouse"
              :source-name="warehouse?.name"
              :available-products="warehouse?.products"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { warehousesAPI } from '@/services/api'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'

const route = useRoute()
const router = useRouter()
const warehouse = ref(null)
const loading = ref(true)
const activeTab = ref('products')

const tabs = [
  { id: 'products', label: 'Mahsulotlar' },
  { id: 'transfers', label: 'O\'tkazmalar' }
]

const fetchWarehouseDetails = async () => {
  loading.value = true
  try {
    const res = await warehousesAPI.getById(route.params.id)
    warehouse.value = res.data
  } catch (error) {
    console.error('Error fetching warehouse details:', error)
  } finally {
    loading.value = false
  }
}

const openMovementDialog = () => {
  if (warehouse.value) {
    router.push({ 
      name: 'warehouse-bulk', 
      params: { id: warehouse.value.id || warehouse.value._id } 
    })
  }
}

onMounted(() => {
  fetchWarehouseDetails()
})
</script>

<style scoped>
.animate-in { animation: fadeIn 0.7s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
