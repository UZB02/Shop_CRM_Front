<template>
  <div class="max-w-[1100px] mx-auto pb-10">

    <!-- Page Header -->
    <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div class="min-w-0">
        <h1 class="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
          {{ $t('settings.title') }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[220px] sm:max-w-none">
          {{ settings?.store_name }}
        </p>
      </div>
      <button @click="saveSettings" :disabled="saving || !isDirty || !isOwner" class="save-btn flex-shrink-0">
        <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'" class="text-xs"></i>
        <span>{{ saving ? $t('settings.saving') : $t('settings.save') }}</span>
      </button>
    </div>

    <!-- Unsaved changes banner -->
    <transition name="slide-down">
      <div v-if="isDirty && !saving" class="mb-4 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center gap-3 text-amber-700 dark:text-amber-400 text-xs font-semibold">
        <i class="pi pi-exclamation-triangle text-sm"></i>
        <div class="flex-1">
          <p>{{ $t('settings.unsaved_changes') }}</p>
          <div class="flex flex-wrap gap-1 mt-1 opacity-80">
            <template v-for="tab in SETTINGS_TABS" :key="tab.key">
              <span v-if="dirtyTabs[tab.key]" class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-400/10 text-[11px] tracking-wider">
                {{ $t(tab.tKey) }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile tabs — above content, only on small screens -->
    <div class="md:hidden mb-4 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="tab in SETTINGS_TABS" :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border relative"
        :class="activeTab === tab.key
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'"
      >
        <i :class="['pi', tab.icon, 'mr-1 text-[12px]']"></i>
        {{ $t(tab.tKey) }}
        <span v-if="dirtyTabs[tab.key]" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
      </button>
    </div>

    <!-- Flex layout: sidebar (desktop) + content -->
    <div class="flex gap-5 items-start">

      <!-- Sidebar (desktop only) -->
      <aside class="w-[185px] flex-shrink-0 hidden md:block">
        <nav class="sticky top-4 space-y-0.5">
          <button
            v-for="tab in SETTINGS_TABS" :key="tab.key"
            @click="activeTab = tab.key"
            class="nav-btn w-full text-left relative"
            :class="activeTab === tab.key ? 'nav-btn--active' : 'nav-btn--inactive'"
          >
            <i :class="['pi', tab.icon, 'text-xs w-4 flex-shrink-0']"></i>
            <span class="truncate">{{ $t(tab.tKey) }}</span>
            <span v-if="dirtyTabs[tab.key]" class="ml-auto w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-sm shadow-amber-500/50"></span>
          </button>
        </nav>
      </aside>

      <!-- Main content panel -->
      <main class="flex-1 min-w-0">

        <!-- Loading skeleton -->
        <div v-if="loading" class="settings-section">
          <div v-for="i in 6" :key="i" class="skeleton-row animate-pulse">
            <div class="flex-1 space-y-2 min-w-0">
              <div class="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-2 w-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
            <div class="h-5 w-9 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
          </div>
        </div>

        <!-- Tab panels -->
        <template v-else-if="settings">
          <SettingsModulesTab  :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
          <SettingsStockTab    :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
          <SettingsPaymentTab  :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
          <SettingsCurrencyTab :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
          <SettingsReceiptTab  :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
          <SettingsTaxTab      :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
          <SettingsTelegramTab :form="form" :active="activeTab" :readonly="!isOwner" :is-field-dirty="isFieldDirty" />
        </template>

        <!-- Error state -->
        <div v-else-if="!loading" class="text-center py-20 text-slate-400 text-sm">
          <i class="pi pi-exclamation-circle text-3xl mb-3 block"></i>
          {{ $t('settings.load_error') }}
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings, SETTINGS_TABS } from './composables/useSettings'

import SettingsModulesTab  from './components/tabs/SettingsModulesTab.vue'
import SettingsStockTab    from './components/tabs/SettingsStockTab.vue'
import SettingsPaymentTab  from './components/tabs/SettingsPaymentTab.vue'
import SettingsCurrencyTab from './components/tabs/SettingsCurrencyTab.vue'
import SettingsReceiptTab  from './components/tabs/SettingsReceiptTab.vue'
import SettingsTaxTab      from './components/tabs/SettingsTaxTab.vue'
import SettingsTelegramTab from './components/tabs/SettingsTelegramTab.vue'

const { t } = useI18n()
const activeTab = ref('modules')
const { loading, saving, settings, form, isDirty, isFieldDirty, dirtyTabs, isOwner, saveSettings } = useSettings()
</script>

<!-- ─────────────────────────────────────────────────
     GLOBAL shared styles (no `scoped` — applied to 
     all child tab components automatically)
───────────────────────────────────────────────── -->
<style>
/* ── Section wrapper ── */
.settings-section {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}
.dark .settings-section {
  background: #0f172a;
  border-color: #1e293b;
}

/* ── Section group header ── */
.section-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 10px;
  font-weight: 800;
  text-transform: ;
  letter-spacing: 0.09em;
  color: #94a3b8;
}
.section-header:first-child { border-top: none; }
.dark .section-header {
  background: rgba(255,255,255,0.025);
  border-color: #1e293b;
  color: #475569;
}

/* ── Setting row ── */
.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding: 11px 16px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.12s;
}
.settings-row:last-child { border-bottom: none; }
.dark .settings-row { border-color: #1e293b; }
.settings-row:hover   { background: #f8fafc; }
.dark .settings-row:hover { background: rgba(255,255,255,0.018); }

/* ── Label & description ── */
.row-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.35;
}
.dark .row-label { color: #e2e8f0; }

.row-desc {
  font-size: 11.5px;
  color: #94a3b8;
  line-height: 1.4;
  margin-top: 1px;
}
.dark .row-desc { color: #475569; }

/* ── Number / text input inside rows ── */
.settings-input {
  padding: 5px 10px;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  min-width: 0;
}
.dark .settings-input {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}
.settings-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.14);
  background: #fff;
}
.dark .settings-input:focus { background: #0f172a; }
</style>

<!-- ──────────────────────────────────────────────
     SCOPED styles — only for this index.vue
────────────────────────────────────────────── -->
<style scoped>
/* Save button */
.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  background: #10b981;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 4px 14px rgba(16,185,129,0.25);
  white-space: nowrap;
}
.save-btn:hover:not(:disabled) { background: #059669; }
.save-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

/* Sidebar nav buttons */
.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.14s, color 0.14s;
  width: 100%;
  text-align: left;
}
.nav-btn--active   { background: #f0fdf4; color: #059669; }
.nav-btn--inactive { background: transparent; color: #64748b; }
.nav-btn--inactive:hover { background: #f8fafc; color: #334155; }
.dark .nav-btn--active   { background: rgba(16,185,129,0.12); color: #34d399; }
.dark .nav-btn--inactive { color: #94a3b8; }
.dark .nav-btn--inactive:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; }

/* Skeleton loading rows */
.skeleton-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 16px;
  border-bottom: 1px solid #f1f5f9;
}
.dark .skeleton-row { border-color: #1e293b; }

/* Slide-in banner animation */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>


