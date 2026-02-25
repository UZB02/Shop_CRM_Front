<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Tizim Sozlamalari</h1>
      <Button label="Saqlash" icon="pi pi-save" severity="success" @click="saveSettings" />
    </div>

    <RolePermissions 
      :roles="roles"
      :allSections="allSections"
      v-model:selectedRole="selectedRole"
      v-model:permissions="currentPermissions"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import RolePermissions from './components/RolePermissions.vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const selectedRole = ref('admin')

const roles = [
  { key: 'superadmin', label: 'Super Admin' },
  { key: 'admin', label: 'Admin (Menejer)' },
  { key: 'seller', label: 'Sotuvchi' },
]

const allSections = [
  { key: 'dashboard', label: 'Boshqaruv', icon: 'pi pi-home' },
  { key: 'pos', label: 'Sotuv (POS)', icon: 'pi pi-calculator' },
  { key: 'stores', label: 'Do\'konlar', icon: 'pi pi-shop' },
  { key: 'warehouse', label: 'Ombor', icon: 'pi pi-database' },
  { key: 'products', label: 'Mahsulotlar', icon: 'pi pi-tag' },
  { key: 'workers', label: 'Xodimlar', icon: 'pi pi-users' },
  { key: 'trades', label: 'Savdolar', icon: 'pi pi-shopping-cart' },
  { key: 'expenses', label: 'Xarajatlar', icon: 'pi pi-wallet' },
  { key: 'customers', label: 'Mijozlar', icon: 'pi pi-id-card' },
  { key: 'settings', label: 'Sozlamalar', icon: 'pi pi-cog' },
]

const currentPermissions = ref([...authStore.permissions[selectedRole.value]])

watch(selectedRole, (newRole) => {
  currentPermissions.value = [...authStore.permissions[newRole]]
})

const saveSettings = () => {
  if (selectedRole.value === 'superadmin') return
  authStore.setPermissions(selectedRole.value, currentPermissions.value)
  alert(`${selectedRole.value} roli uchun huquqlar yangilandi!`)
}
</script>
