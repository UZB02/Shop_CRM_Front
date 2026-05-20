<template>
  <div v-show="active === 'receipt'" class="settings-section">
    <SectionHeader icon="pi-receipt" color="text-slate-500">{{ $t('settings.receipt.title') }}</SectionHeader>
    <SettingRow v-model="form.show_store_logo"  :label="$t('settings.receipt.logo_label')"        :desc="$t('settings.receipt.logo_desc')" :disabled="readonly || !planFeatures.has_receipt_design" :is-dirty="isFieldDirty('show_store_logo')" />
    
    <!-- Logo Upload -->
    <div class="settings-row" v-if="form.show_store_logo" :class="{'opacity-50 pointer-events-none': readonly || !planFeatures.has_receipt_design}">
      <div class="flex-1">
        <p class="row-label">Do'kon Logotipi</p>
        <p class="row-desc">Chekda chiqishi uchun logotipni yuklang (tavsiya etiladigan o'lcham: kvadrat rasm)</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative w-16 h-16 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-800">
           <img v-if="settingsStore.storeLogoUrl" :src="settingsStore.storeLogoUrl" class="w-full h-full object-contain" />
           <i v-else class="pi pi-image text-slate-400 text-xl"></i>
           <div v-if="logoUploading" class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center">
             <i class="pi pi-spin pi-spinner text-emerald-500"></i>
           </div>
        </div>
        <div class="flex flex-col gap-2">
          <input type="file" ref="logoInput" accept="image/*" class="hidden" @change="handleLogoUpload" />
          <button @click="$refs.logoInput.click()" type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
            Rasmni yuklash
          </button>
          <button v-if="settingsStore.storeLogoUrl" @click="removeLogo" type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            O'chirish
          </button>
        </div>
      </div>
    </div>

    <SettingRow v-model="form.show_worker_name" :label="$t('settings.receipt.worker_name_label')" :desc="$t('settings.receipt.worker_name_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_worker_name')" />

    <SectionHeader icon="pi-map-marker" color="text-slate-500">{{ $t('settings.receipt.info_title') }}</SectionHeader>
    <div class="settings-row" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.address_label') }}</p>
          <span v-if="isFieldDirty('receipt_address')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.address_desc') }}</p>
      </div>
      <input v-model="form.receipt_address" type="text" class="settings-input w-full max-w-[280px]" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_address')}" :placeholder="$t('settings.receipt.address_placeholder')" :disabled="readonly" />
    </div>
    <div class="settings-row" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.phone_label') }}</p>
          <span v-if="isFieldDirty('receipt_phone')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.phone_desc') }}</p>
      </div>
      <input v-model="form.receipt_phone" type="text" class="settings-input w-full max-w-[280px]" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_phone')}" :placeholder="$t('settings.receipt.phone_placeholder')" :disabled="readonly" />
    </div>
    <div class="settings-row" :class="{'opacity-50 pointer-events-none': readonly}">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.promo_label') }}</p>
          <span v-if="isFieldDirty('receipt_promo_text')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.promo_desc') }}</p>
      </div>
      <input v-model="form.receipt_promo_text" type="text" class="settings-input w-full max-w-[280px]" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_promo_text')}" :placeholder="$t('settings.receipt.promo_placeholder')" :disabled="readonly" />
    </div>

    <SectionHeader icon="pi-align-left" color="text-slate-500">{{ $t('settings.receipt.text_title') }}</SectionHeader>

    <!-- Plan lock: receipt_design -->
    <div v-if="planFeatures.has_receipt_design === false" class="px-4 py-3">
      <PlanLockBadge :hint="$t('plan.error_receipt_design')" />
    </div>

    <div class="settings-row" style="align-items: flex-start; flex-wrap: wrap;" :class="{'opacity-50 pointer-events-none': readonly || !planFeatures.has_receipt_design}">
      <div class="flex-1" style="min-width: 140px;">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.header_label') }}</p>
          <span v-if="isFieldDirty('receipt_header')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.header_desc') }}</p>
      </div>
      <textarea v-model="form.receipt_header" rows="3" :placeholder="$t('settings.receipt.header_placeholder')" class="settings-input resize-none text-xs" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_header')}" style="width: 100%; max-width: 280px;" :disabled="readonly || !planFeatures.has_receipt_design"></textarea>
    </div>
    <div class="settings-row" style="align-items: flex-start; flex-wrap: wrap;" :class="{'opacity-50 pointer-events-none': readonly || !planFeatures.has_receipt_design}">
      <div class="flex-1" style="min-width: 140px;">
        <div class="flex items-center gap-2">
          <p class="row-label">{{ $t('settings.receipt.footer_label') }}</p>
          <span v-if="isFieldDirty('receipt_footer')" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <p class="row-desc">{{ $t('settings.receipt.footer_desc') }}</p>
      </div>
      <textarea v-model="form.receipt_footer" rows="3" :placeholder="$t('settings.receipt.footer_placeholder')" class="settings-input resize-none text-xs" :class="{'ring-2 ring-amber-500/20 border-amber-500/50': isFieldDirty('receipt_footer')}" style="width: 100%; max-width: 280px;" :disabled="readonly || !planFeatures.has_receipt_design"></textarea>
    </div>

    <SectionHeader icon="pi-barcode" color="text-slate-500">{{ $t('settings.receipt.barcode_settings_title') }}</SectionHeader>
    <SettingRow v-model="form.show_name_on_barcode"  :label="$t('settings.receipt.show_name_on_barcode_label')"  :desc="$t('settings.receipt.show_name_on_barcode_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_name_on_barcode')" />
    <SettingRow v-model="form.show_price_on_barcode" :label="$t('settings.receipt.show_price_on_barcode_label')" :desc="$t('settings.receipt.show_price_on_barcode_desc')" :disabled="readonly" :is-dirty="isFieldDirty('show_price_on_barcode')" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { storesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useSettingsStore } from '@/store/settings'
import SettingRow from './SettingRow.vue'
import SectionHeader from './SectionHeader.vue'
import PlanLockBadge from '@/components/PlanLockBadge.vue'

const { t } = useI18n()
defineProps({
  form: Object,
  active: String,
  readonly: Boolean,
  isFieldDirty: Function,
  planFeatures: { type: Object, default: () => ({}) }
})

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const toast = useToast()
const logoInput = ref(null)
const logoUploading = ref(false)

const handleLogoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const storeId = authStore.user?.store_id
    if (!storeId) {
        toast.add({ severity: 'error', summary: t('common.error') || 'Xato', detail: "Store ID topilmadi", life: 3000 })
        return
    }

    const formData = new FormData()
    formData.append('logo', file)

    logoUploading.value = true
    try {
        const res = await storesAPI.update(storeId, formData)
        settingsStore.setStoreLogoUrl(res.data?.logo_url || URL.createObjectURL(file))
        toast.add({ severity: 'success', summary: t('common.success') || 'Muvaffaqiyat', detail: "Logotip yuklandi", life: 3000 })
    } catch (e) {
        toast.add({ severity: 'error', summary: t('common.error') || 'Xato', detail: "Logotip yuklashda xatolik yuz berdi", life: 3000 })
        console.error(e)
    } finally {
        logoUploading.value = false
        if (logoInput.value) logoInput.value.value = ''
    }
}

const removeLogo = async () => {
    const storeId = authStore.user?.store_id
    if (!storeId) return
    logoUploading.value = true
    try {
        await storesAPI.update(storeId, { logo: null })
        settingsStore.setStoreLogoUrl(null)
        toast.add({ severity: 'success', summary: t('common.success') || 'Muvaffaqiyat', detail: "Logotip o'chirildi", life: 3000 })
    } catch(e) {
        toast.add({ severity: 'error', summary: t('common.error') || 'Xato', detail: "Xatolik yuz berdi", life: 3000 })
        console.error(e)
    } finally {
        logoUploading.value = false
    }
}
</script>


