import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storesAPI } from '@/services/api'

export function useStoreDetail() {
    const route = useRoute()
    const store = ref(null)
    const loading = ref(true)
    const activeTab = ref('branches')

    const tabs = [
        { id: 'branches', label: 'Filiallar' },
        { id: 'workers', label: 'Xodimlar' },
        { id: 'smenas', label: 'Ochiq Smenalar' },
        { id: 'settings', label: 'Sozlamalar' }
    ]

    const fetchDetails = async () => {
        loading.value = true
        try {
            const res = await storesAPI.getById(route.params.id)
            store.value = res.data
        } catch (error) {
            console.error('Error fetching store details:', error)
        } finally {
            loading.value = false
        }
    }

    onMounted(fetchDetails)

    return {
        store,
        loading,
        activeTab,
        tabs,
        fetchDetails
    }
}
