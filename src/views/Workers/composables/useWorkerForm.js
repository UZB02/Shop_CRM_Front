// Xodim formasidagi barcha statik ma'lumotlar
export const WORKER_ROLES = [
    { label: 'Egasi (Owner)', value: 'owner' },
    { label: 'Menejer', value: 'manager' },
    { label: 'Sotuvchi', value: 'seller' },
]

export const WORKER_STATUSES = [
    { label: 'Faol', value: 'active' },
    { label: "Ta'tilda", value: 'tatil' },
    { label: "Ishdan bo'shagan", value: 'ishdan_ketgan' },
]

// Backend'dagi permission qiymatlari bilan to'liq mos
export const PERMISSIONS_LIST = [
    { label: 'Boshqaruv', value: 'boshqaruv', icon: 'pi-chart-bar', desc: 'Dashboard va statistikaga kirish' },
    { label: "Do'konlar", value: 'dokonlar', icon: 'pi-building', desc: "Filial va do'konlar boshqaruvi" },
    { label: 'Mahsulotlar', value: 'mahsulotlar', icon: 'pi-box', desc: 'Tovarlar va ombor boshqaruvi' },
    { label: 'Mijozlar', value: 'mijozlar', icon: 'pi-users', desc: 'Mijozlar bazasi bilan ishlash' },
    { label: 'Savdolar', value: 'savdolar', icon: 'pi-shopping-cart', desc: "Savdolar tarixini ko'rish" },
    { label: 'Ombor', value: 'ombor', icon: 'pi-warehouse', desc: 'Omborxona boshqaruvi' },
    { label: 'Sotuv (POS)', value: 'sotuv', icon: 'pi-desktop', desc: 'Kassa va sotuv oynasiga kirish' },
    { label: 'Moliya', value: 'xarajatlar', icon: 'pi-wallet', desc: 'Moliya va xarajatlar' },
    { label: 'Xodimlar', value: 'xodimlar', icon: 'pi-id-card', desc: 'Xodimlarni boshqarish' },
    { label: 'Sozlamalar', value: 'sozlamalar', icon: 'pi-cog', desc: 'Tizim sozlamalari' },
]

export const ROLE_PERMISSIONS = {
    owner: ['boshqaruv', 'sotuv', 'dokonlar', 'ombor', 'mahsulotlar', 'xodimlar', 'savdolar', 'xarajatlar', 'mijozlar', 'sozlamalar'],
    manager: ['boshqaruv', 'sotuv', 'dokonlar', 'ombor', 'mahsulotlar', 'xodimlar', 'savdolar', 'xarajatlar', 'mijozlar'],
    seller: ['sotuv', 'savdolar', 'mijozlar', 'ombor', 'mahsulotlar']
}
