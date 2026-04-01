<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col
           bg-white dark:bg-slate-900
           border-r border-slate-200 dark:border-slate-800
           transition-[transform,width] duration-300 ease-in-out
           w-64"
    :class="{
      '-translate-x-full': !sidebarOpen,
      'translate-x-0 shadow-2xl': sidebarOpen,
      'lg:translate-x-0': true,
      'lg:w-16': !sidebarOpen && desktopCollapsed,
      'lg:w-64': !desktopCollapsed,
    }"
  >
    <!-- Logo row -->
    <div class="h-16 flex items-center justify-between px-4
                border-b border-slate-100 dark:border-slate-800 flex-shrink-0 overflow-hidden">
      <span
        class="text-xl font-black text-emerald-500 whitespace-nowrap transition-all duration-200"
        :class="desktopCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'"
      >
        Shop Searem
      </span>

      <!-- Desktop collapse btn (icon only) -->
      <button
        class="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center
               text-slate-400 hover:text-emerald-500 hover:bg-emerald-50
               dark:hover:bg-emerald-900/20 transition-all ml-auto flex-shrink-0"
        @click="$emit('update:desktopCollapsed', !desktopCollapsed)"
      >
        <i :class="desktopCollapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'" class="text-xs" />
      </button>

      <!-- Mobile close btn -->
      <button
        class="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center
               text-slate-400 hover:text-slate-600 dark:hover:text-white
               hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ml-auto flex-shrink-0"
        @click="$emit('update:sidebarOpen', false)"
      >
        <i class="pi pi-times text-xs" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
      <RouterLink
        v-for="item in filteredMenu"
        :key="item.key"
        :to="item.to"
        v-tooltip.right="desktopCollapsed ? item.label : null"
        class="flex items-center px-3 py-2.5 rounded-xl
               text-slate-600 dark:text-slate-400
               hover:bg-emerald-50 hover:text-emerald-600
               dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400
               transition-all duration-200 group overflow-hidden relative"
        :class="[
          desktopCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3',
          (item.to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(item.to))
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 font-semibold shadow-sm animate-in fade-in duration-300'
            : ''
        ]"
        @click="$emit('update:sidebarOpen', false)"
      >
        <i :class="[item.icon, 'text-base group-hover:scale-110 transition-transform flex-shrink-0 relative z-10']" />
        <span
          class="text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden"
          :class="desktopCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'"
        >
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>

    <!-- User Card -->
    <div class="p-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 transition-all duration-300"
         :class="desktopCollapsed ? 'lg:p-2' : 'p-3'">
      <div
        class="flex items-center rounded-2xl
               bg-slate-50 dark:bg-slate-800/40
               hover:bg-emerald-50 dark:hover:bg-emerald-900/20
               border border-slate-100 dark:border-slate-800/50
               hover:border-emerald-200 dark:hover:border-emerald-800/50
               cursor-pointer transition-all group overflow-hidden relative"
        :class="desktopCollapsed ? 'justify-center p-0 h-10' : 'gap-3 px-3 py-2.5'"
        @click="$emit('showProfile')"
        v-tooltip.right="desktopCollapsed ? user?.username : null"
      >
        <Avatar
          icon="pi pi-user"
          shape="circle"
          class="!w-8 !h-8 bg-white dark:bg-slate-700
                 text-emerald-600 shadow-sm
                 transition-transform group-hover:scale-110 flex-shrink-0 z-10"
        />
        <div
          v-if="!desktopCollapsed"
          class="flex-1 min-w-0 transition-all duration-300"
        >
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{{ user?.username }}</p>
          <p class="text-[10px] uppercase font-bold text-slate-400 truncate tracking-wider">
            {{ user?.worker?.role_display || 'Xodim' }}
          </p>
        </div>
        <Button
          v-if="!desktopCollapsed"
          icon="pi pi-sign-out"
          text severity="secondary" size="small"
          class="!w-8 !h-8 flex-shrink-0 z-10
                 hover:!bg-rose-50 hover:!text-rose-500
                 dark:hover:!bg-rose-900/30 transition-all"
          @click.stop="$emit('logout')"
        />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

const route = useRoute()

defineProps({
  sidebarOpen: Boolean,
  desktopCollapsed: Boolean,
  filteredMenu: Array,
  user: Object
})

defineEmits(['update:sidebarOpen', 'update:desktopCollapsed', 'showProfile', 'logout'])
</script>
