import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { reportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

// Barcha 4 hisobot uchun tab identifikatorlari
export const REPORT_TABS = [
    { id: 'top-selling',       icon: 'pi pi-chart-bar',    color: 'emerald' },
    { id: 'top-profitable',    icon: 'pi pi-dollar',       color: 'violet' },
    { id: 'slow-moving',       icon: 'pi pi-clock',        color: 'amber' },
    { id: 'dead-stock',        icon: 'pi pi-ban',          color: 'rose' },
    { id: 'sold-out',          icon: 'pi pi-exclamation-triangle', color: 'rose' },
    { id: 'sales-trend',       icon: 'pi pi-chart-line',   color: 'blue' },
    { id: 'stockout-forecast', icon: 'pi pi-calendar-times', color: 'orange' },
    { id: 'abc-analysis',      icon: 'pi pi-chart-pie',    color: 'teal' },
]

// Tab'ga qarab sana filtri ko'rsatilsinmi?
export const tabHasDateFilter = (tab) => ['top-selling', 'top-profitable', 'sold-out', 'sales-trend', 'abc-analysis'].includes(tab)

// "tur" maydonini formatlash: null yoki bo'sh → "-", aks holda qiymatini ko'rsatish
export function formatTur(tur) {
    if (!tur || tur.trim() === '') return '-'
    return tur
}

// String Decimal → float konversiya (xatolikka chidamli)
export function parseDecimal(value) {
    if (value === null || value === undefined) return 0
    const n = parseFloat(value)
    return isNaN(n) ? 0 : n
}

// Sonni UZS formatida ko'rsatish
export function formatMoney(value) {
    const n = parseDecimal(value)
    return new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(n) + " so'm"
}

// Sonni oddiy formatlash (dona, kun)
export function formatNum(value) {
    if (value === null || value === undefined) return '—'
    return new Intl.NumberFormat('uz-UZ').format(parseDecimal(value))
}

// Margin foizini ranga aylantirish
export function marginColor(pct) {
    const v = parseDecimal(pct)
    if (v >= 30) return 'text-emerald-500'
    if (v >= 15) return 'text-amber-500'
    return 'text-rose-500'
}

// Blob faylni yuklab olish (Excel)
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

// ─── Asosiy composable ────────────────────────────────────────────────────────
export function useProductReports() {
    const toast  = useToast()
    const route  = useRoute()
    const router = useRouter()

    const VALID_TABS = REPORT_TABS.map(t => t.id)

    // URL'dagi ?tab= parametridan boshlang'ich qiymat
    const initialTab = VALID_TABS.includes(route.query.tab) ? route.query.tab : 'top-selling'
    const activeTab  = ref(initialTab)

    // Har tab uchun holat
    const state = reactive({
        'top-selling':       { loading: false, data: [], count: 0, page: 1 },
        'top-profitable':    { loading: false, data: [], count: 0, page: 1 },
        'slow-moving':       { loading: false, data: [], count: 0, page: 1 },
        'dead-stock':        { loading: false, data: [], count: 0, page: 1 },
        'sold-out':          { loading: false, data: [], count: 0, page: 1 },
        'sales-trend':       { loading: false, data: [], count: 0, page: 1, summary: null },
        'stockout-forecast': { loading: false, data: [], count: 0, page: 1 },
        'abc-analysis':      { loading: false, data: [], count: 0, page: 1, summary: null },
    })

    // Filtrlari
    const filters = reactive({
        'top-selling':       { date_from: '', date_to: '', branch: '', category: '' },
        'top-profitable':    { date_from: '', date_to: '', branch: '', category: '' },
        'slow-moving':       { branch: '', category: '' },
        'dead-stock':        { branch: '', category: '' },
        'sold-out':          { date_from: '', date_to: '', branch: '', category: '' },
        'sales-trend':       { date_from: '', date_to: '', branch: '', category: '' },
        'stockout-forecast': { branch: '', category: '' },
        'abc-analysis':      { date_from: '', date_to: '', branch: '', category: '', sort: 'revenue' },
    })

    const PAGE_SIZE = 20
    const excelLoading = ref(false)

    // Joriy tab uchun qisqartma getterlar
    const currentState   = computed(() => state[activeTab.value])
    const currentFilters = computed(() => filters[activeTab.value])

    // ─── API so'rovlari ───────────────────────────────────────────────────────

    const API_MAP = {
        'top-selling':       reportsAPI.getTopSelling,
        'top-profitable':    reportsAPI.getTopProfitable,
        'slow-moving':       reportsAPI.getSlowMoving,
        'dead-stock':        reportsAPI.getDeadStock,
        'sold-out':          reportsAPI.getSoldOut,
        'sales-trend':       reportsAPI.getSalesTrend,
        'stockout-forecast': reportsAPI.getStockoutForecast,
        'abc-analysis':      reportsAPI.getAbcAnalysis,
    }

    const EXCEL_MAP = {
        'top-selling':       reportsAPI.exportTopSelling,
        'top-profitable':    reportsAPI.exportTopProfitable,
        'slow-moving':       reportsAPI.exportSlowMoving,
        'dead-stock':        reportsAPI.exportDeadStock,
        'sold-out':          reportsAPI.exportSoldOut,
        'sales-trend':       reportsAPI.exportSalesTrend,
        'stockout-forecast': reportsAPI.exportStockoutForecast,
        'abc-analysis':      reportsAPI.exportAbcAnalysis,
    }

    const EXCEL_NAMES = {
        'top-selling':       'eng-kop-sotilgan.xlsx',
        'top-profitable':    'eng-foydali.xlsx',
        'slow-moving':       'sekin-sotiladigan.xlsx',
        'dead-stock':        'sotilmayotgan-tovar.xlsx',
        'sold-out':          'tugagan-tovar.xlsx',
        'sales-trend':       'sotuv-trendi.xlsx',
        'stockout-forecast': 'stockout-bashorat.xlsx',
        'abc-analysis':      'abc-tahlil.xlsx',
    }

    async function fetchReport(tab = null, page = 1) {
        const t = tab || activeTab.value
        const s = state[t]
        const f = filters[t]

        s.loading = true
        s.page    = page

        try {
            const params = { page, page_size: PAGE_SIZE }

            if (tabHasDateFilter(t)) {
                if (f.date_from) params.date_from = f.date_from
                if (f.date_to)   params.date_to   = f.date_to
            }
            if (f.branch)   params.branch   = f.branch
            if (f.category) params.category = f.category
            if (t === 'abc-analysis' && f.sort) params.sort = f.sort

            const res  = await API_MAP[t](params)
            s.data     = res.data?.results || []
            s.count    = res.data?.count   || 0
            if (t === 'sales-trend' || t === 'abc-analysis') {
                s.summary = res.data?.summary || null
            }
        } catch (err) {
            console.error(`[useProductReports] ${t} fetch error:`, err)
            toast.add({
                severity: 'error',
                summary:  'Xatolik',
                detail:   "Hisobotni yuklashda xatolik yuz berdi",
                life:     4000
            })
        } finally {
            s.loading = false
        }
    }

    // Aktiv tabni o'zgartirganda avtomatik fetch + URL yangilash
    async function switchTab(tab) {
        activeTab.value = tab
        router.replace({ query: { ...route.query, tab } })
        if (state[tab].data.length === 0 && !state[tab].loading) {
            await fetchReport(tab, 1)
        }
    }

    // Filtrlarni qo'llaganda fetch
    async function applyFilters() {
        state[activeTab.value].page = 1
        await fetchReport(activeTab.value, 1)
    }

    // Filtrlarni tozalash
    async function clearFilters() {
        const f = filters[activeTab.value]
        Object.keys(f).forEach(k => { f[k] = '' })
        await fetchReport(activeTab.value, 1)
    }

    // Paginatsiya
    async function onPageChange(page) {
        await fetchReport(activeTab.value, page)
    }

    // ABC sort o'zgartirish
    async function onSortChange(val) {
        filters['abc-analysis'].sort = val
        state['abc-analysis'].page = 1
        await fetchReport('abc-analysis', 1)
    }

    // Excel yuklab olish
    async function downloadExcel() {
        const t = activeTab.value
        const f = filters[t]
        excelLoading.value = true
        try {
            const params = {}
            if (tabHasDateFilter(t)) {
                if (f.date_from) params.date_from = f.date_from
                if (f.date_to)   params.date_to   = f.date_to
            }
            if (f.branch)   params.branch   = f.branch
            if (f.category) params.category = f.category

            const res = await EXCEL_MAP[t](params)
            downloadBlob(res.data, EXCEL_NAMES[t])
            toast.add({
                severity: 'success',
                summary:  'Muvaffaqiyatli',
                detail:   `${EXCEL_NAMES[t]} yuklab olindi`,
                life:     3000
            })
        } catch (err) {
            console.error('[useProductReports] excel error:', err)
            toast.add({
                severity: 'error',
                summary:  'Xatolik',
                detail:   "Excel yuklab olishda xatolik yuz berdi",
                life:     4000
            })
        } finally {
            excelLoading.value = false
        }
    }

    // Mini fetch dashboard widget uchun (faqat birinchi 5 yoki 1 ta)
    async function fetchMini(tab, pageSize = 5) {
        const f = API_MAP[tab]
        try {
            const res = await f({ page: 1, page_size: pageSize })
            return {
                results: res.data?.results || [],
                count:   res.data?.count   || 0
            }
        } catch (e) {
            console.error(`[useProductReports] mini fetch ${tab}:`, e)
            return { results: [], count: 0 }
        }
    }

    return {
        // state
        activeTab,
        state,
        filters,
        currentState,
        currentFilters,
        excelLoading,

        // actions
        fetchReport,
        switchTab,
        applyFilters,
        clearFilters,
        onPageChange,
        onSortChange,
        downloadExcel,
        fetchMini,

        // formatters (re-exported)
        formatTur,
        parseDecimal,
        formatMoney,
        formatNum,
        marginColor,
        tabHasDateFilter,
        PAGE_SIZE,
        REPORT_TABS,
    }
}
