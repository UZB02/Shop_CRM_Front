import { computed } from 'vue'
import { PERMISSIONS_LIST } from './useWorkerForm.js'

/**
 * Permissions boshqaruvi uchun composable.
 * worker.permissions massivini toggle qilish va "barchasini tanlash" logikasini boshqaradi.
 * @param {Object} worker - reaktiv worker ref yoki prop
 */
export function useWorkerPermissions(worker) {
    const allSelected = computed(() =>
        PERMISSIONS_LIST.every(p => worker.permissions?.includes(p.value))
    )

    const selectedCount = computed(() => worker.permissions?.length || 0)

    const togglePermission = (val) => {
        if (!Array.isArray(worker.permissions)) {
            worker.permissions = []
        }
        const idx = worker.permissions.indexOf(val)
        if (idx === -1) {
            worker.permissions.push(val)
        } else {
            worker.permissions.splice(idx, 1)
        }
    }

    const toggleAll = () => {
        if (allSelected.value) {
            worker.permissions = []
        } else {
            worker.permissions = PERMISSIONS_LIST.map(p => p.value)
        }
    }

    const isSelected = (val) => worker.permissions?.includes(val) ?? false

    return {
        allSelected,
        selectedCount,
        togglePermission,
        toggleAll,
        isSelected,
    }
}
