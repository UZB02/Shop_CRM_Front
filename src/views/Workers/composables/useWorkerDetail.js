import { useI18n } from 'vue-i18n'

export function useWorkerDetail() {
    const { t } = useI18n()

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('uz-UZ').format(val || 0)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        // If backend already formatted the date (e.g. "2024-03-05 | 12:14")
        if (typeof dateStr === 'string' && dateStr.includes('|')) return dateStr

        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return dateStr // Return raw if invalid

        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getInitials = (fullName) => {
        if (!fullName) return '?'
        const parts = fullName.trim().split(' ')
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
        return parts[0].slice(0, 2).toUpperCase()
    }

    const gradients = [
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #3b82f6, #2563eb)',
        'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        'linear-gradient(135deg, #f59e0b, #d97706)',
    ]

    const getAvatarGradient = (name) => {
        const index = (name?.charCodeAt(0) || 0) % gradients.length
        return { background: gradients[index] }
    }

    const getStatusStyles = (status) => {
        if (status === 'active') return { bg: 'bg-emerald-500', icon: 'pi-check' }
        if (status === 'tatil') return { bg: 'bg-amber-500', icon: 'pi-clock' }
        if (status === 'ishdan_ketgan') return { bg: 'bg-rose-500', icon: 'pi-times' }
        return { bg: 'bg-slate-400', icon: 'pi-question' }
    }

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'owner': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
            case 'admin': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
            case 'manager': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
            default: return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
        }
    }

    return {
        formatCurrency,
        formatDate,
        getInitials,
        getAvatarGradient,
        getStatusStyles,
        getRoleBadgeClass,
        t
    }
}


