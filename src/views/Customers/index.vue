<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      <div class="flex flex-col">
        <h1 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">{{ $t('customers.title') }}</h1>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ totalRecords }} {{ $t('customers.subtitle') }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative group/search min-w-[280px]">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs transition-colors group-focus-within/search:text-emerald-500"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="$t('customers.search_placeholder')" 
            class="w-full pl-10 pr-4 py-2 text-[12px] font-bold rounded-xl bg-slate-50 dark:bg-slate-800/40 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            @input="handleSearch"
          />
        </div>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <Button 
          :label="$t('customers.groups_btn')" 
          icon="pi pi-users" 
          severity="secondary" 
          text
          class="!text-[11px] !font-black !uppercase !tracking-widest !rounded-xl !px-3"
          @click="router.push('/dashboard/customers/groups')" 
        />
        <Button 
          :label="$t('customers.new_customer')" 
          icon="pi pi-plus" 
          severity="success" 
          class="!text-[11px] !font-black !uppercase !tracking-widest !rounded-xl !px-4 !bg-emerald-500 !border-none !shadow-xl !shadow-emerald-500/10 active:scale-95 transition-all text-white"
          @click="openNew" 
        />
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl p-0.5">
      <CustomerTable 
        :customers="customers" 
        :loading="loading" 
        v-model:page="page"
        :totalRecords="totalRecords"
        :pageSize="pageSize"
        @page-change="loadCustomers"
        @edit="editCustomer" 
        @delete="confirmDelete"
        @view-history="viewHistory"
      />
    </div>

    <!-- Dialogs -->
    <CustomerDialog 
      v-model:visible="customerDialog"
      :customer="customer"
      :groups="groups"
      :saving="saving"
      :submitted="submitted"
      @save="saveCustomer"
      @hide="hideDialog"
    />



    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import CustomerTable from './components/CustomerTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'
import { customersAPI, customerGroupsAPI } from '@/services/api'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const customers = ref([])
const groups = ref([])
const customerDialog = ref(false)
const submitted = ref(false)

const totalRecords = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
let searchTimeout = null

const customer = ref({
  name: '',
  phone: '',
  group: null,
  branch: '',
  address: '',
  notes: ''
})

const loadCustomers = async () => {
  loading.value = true
  try {
    const params = { 
      page: page.value, 
      limit: pageSize.value,
      search: searchQuery.value || undefined 
    }
    const response = await customersAPI.getAll(params)
    customers.value = response.data.results || response.data
    totalRecords.value = response.data.count || (response.data.results ? response.data.results.length : response.data.length)
  } catch (error) {
    console.error('Error loading customers:', error)
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 3000 })
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    loadCustomers()
  }, 500)
}

const loadGroups = async () => {
  try {
    const response = await customerGroupsAPI.getAll()
    groups.value = response.data.results || response.data
  } catch (error) {
    console.error('Error loading groups:', error)
  }
}

const openNew = () => {
  customer.value = { name: '', phone: '', group: null, branch: '', address: '', notes: '' }
  submitted.value = false
  customerDialog.value = true
}

const editCustomer = (data) => {
  customer.value = { ...data }
  customerDialog.value = true
}

const viewHistory = (id) => {
  router.push(`/dashboard/customers/${id}`)
}

const saveCustomer = async () => {
  submitted.value = true
  if (!customer.value.name?.trim() || !customer.value.phone?.trim()) return

  saving.value = true
  try {
    const payload = {
      name: customer.value.name,
      phone: customer.value.phone,
      address: customer.value.address,
      group: customer.value.group
    }

    if (customer.value.id) {
      await customersAPI.update(customer.value.id, payload)
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.messages.updated'), life: 3000 })
    } else {
      await customersAPI.create(payload)
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.messages.added'), life: 3000 })
    }
    customerDialog.value = false
    loadCustomers()
  } catch (error) {
    console.error('Error saving customer:', error)
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.save_error'), life: 3000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (data) => {
  confirm.require({
    message: t('customers.messages.delete_confirm', { name: data.name }),
    header: t('common.confirm_title') || 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await customersAPI.delete(data.id)
        toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('customers.messages.deleted'), life: 3000 })
        loadCustomers()
      } catch (error) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.delete_error'), life: 3000 })
      }
    }
  })
}

const hideDialog = () => {
  customerDialog.value = false
  submitted.value = false
}

onMounted(() => {
  loadCustomers()
  loadGroups()
})
</script>

