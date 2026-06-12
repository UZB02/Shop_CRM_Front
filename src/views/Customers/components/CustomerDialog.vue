<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="visible" @click="$emit('update:visible', false)" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
    </Transition>

    <!-- Slide-over Panel -->
    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
      enter-from-class="translate-x-full" 
      enter-to-class="translate-x-0" 
      leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)" 
      leave-from-class="translate-x-0" 
      leave-to-class="translate-x-full"
    >
      <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col">
        <!-- Panel Header -->
        <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-sm font-black tracking-widest text-emerald-500">{{ customer.id ? $t('customers.form.edit') : $t('customers.form.add') }}</span>
            <span class="text-[11px] font-bold text-slate-400 tracking-[0.2em] mt-1">{{ $t('customers.subtitle') }}</span>
          </div>
          <button @click="$emit('update:visible', false)" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white transition-all shadow-sm">
            <i class="pi pi-times text-[12px]"></i>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-6 space-y-6 flex-1 overflow-y-auto">
          <div class="space-y-4">
            <!-- Full Name -->
            <div class="field">
              <label for="name" class="text-[12px] font-black tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('customers.form.full_name') }} <span class="text-rose-500">*</span></label>
              <div class="relative group/input">
                 <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-emerald-500 transition-colors"></i>
                 <InputText id="name" v-model.trim="customer.name" required="true" autofocus :class="{ '!border-rose-500': submitted && !customer.name }" :placeholder="$t('customers.form.name_placeholder')" class="!h-11 !pl-10 !text-sm !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" />
              </div>
              <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
                <div v-if="submitted && !customer.name" class="flex items-center gap-1.5 mt-1.5 ml-1">
                  <i class="pi pi-exclamation-circle text-rose-500 text-[11px] shrink-0"></i>
                  <span class="text-[12px] font-bold text-rose-500">{{ $t('customers.form.name_required') }}</span>
                </div>
              </Transition>
            </div>

            <!-- Phone Number -->
            <div class="field">
              <label for="phone" class="text-[12px] font-black tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('customers.form.phone') }} <span class="text-rose-500">*</span></label>
              <div class="relative group/input">
                <i class="pi pi-phone absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-emerald-500 transition-colors"></i>
                <InputMask id="phone" v-model="customer.phone" mask="+999999999999" placeholder="+998" :class="{ '!border-rose-500': submitted && !customer.phone }" class="!h-11 !pl-10 !text-sm !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" />
              </div>
              <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
                <div v-if="submitted && !customer.phone" class="flex items-center gap-1.5 mt-1.5 ml-1">
                  <i class="pi pi-exclamation-circle text-rose-500 text-[11px] shrink-0"></i>
                  <span class="text-[12px] font-bold text-rose-500">{{ $t('customers.form.phone_required') }}</span>
                </div>
              </Transition>
            </div>

            <!-- Customer Group -->
            <div class="field">
              <label for="group" class="text-[12px] font-black tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('customers.form.group') }}</label>
              <Select 
                id="group" 
                v-model="customer.group" 
                :options="groups" 
                optionLabel="name" 
                optionValue="id" 
                :placeholder="$t('customers.form.group_placeholder')" 
                class="!h-11 !text-sm !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full"
                pt:root:class="!border-none"
                pt:input:class="!py-0 !flex !items-center !px-3"
              />
            </div>

            <!-- Address -->
            <div class="field">
              <label for="address" class="text-[12px] font-black tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('customers.form.address') }}</label>
              <div class="relative group/input">
                <i class="pi pi-map-marker absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-emerald-500 transition-colors"></i>
                <InputText id="address" v-model="customer.address" :placeholder="$t('customers.form.address_placeholder')" class="!h-11 !pl-10 !text-sm !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" />
              </div>
            </div>
          </div>

        </div>

        <!-- Panel Footer -->
        <div class="px-6 py-3 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div class="flex gap-3 items-center">
            <Button 
              :label="$t('common.cancel')"
              text
              class="!flex-1 !text-[12px] !font-black !!tracking-widest !rounded-2xl !text-slate-400 !h-10"
              @click="$emit('update:visible', false)"
            />
            <Button 
              :label="$t('common.save')" 
              :loading="saving" 
              class="!flex-[2] !h-10 !rounded-2xl !bg-emerald-500 !border-none !shadow-xl !shadow-emerald-500/20 active:scale-95 transition-all text-white !text-[12px] !font-black !!tracking-widest" 
              @click="$emit('save')" 
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Select from 'primevue/select'

const props = defineProps({
  visible: Boolean,
  customer: Object,
  groups: Array,
  saving: Boolean,
  submitted: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'hide'])
</script>

<style scoped>
:deep(.p-inputtext), :deep(.p-inputmask) {
  border-color: transparent !important;
}
</style>


