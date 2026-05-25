<template>
  <Dialog 
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal 
    header="Tizim Jurnali Tafsilotlari" 
    :style="{ width: '50rem' }"
    class="font-inter rounded-[1.5rem]"
    pt:root:class="!border-none dark:!bg-slate-900"
    pt:header:class="!pb-3 !font-black !text-slate-800 dark:!text-white border-b border-slate-100 dark:border-slate-800/80"
  >
    <div v-if="log" class="space-y-4 pt-2">
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
          <span class="text-[9px] font-black text-slate-400 tracking-wider block">KIM BAJARDI (ACTOR)</span>
          <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ log.actor || 'Tizim' }}</span>
          <span v-if="log.is_impersonated" class="text-[9px] font-medium text-rose-500 block">Superadmin: {{ log.impersonated_by_name }}</span>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
          <span class="text-[9px] font-black text-slate-400 tracking-wider block">VAQT (CREATED AT)</span>
          <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ log.created_at }}</span>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
          <span class="text-[9px] font-black text-slate-400 tracking-wider block">MODEL & OBYEKT ID</span>
          <span class="text-xs font-black text-slate-700 dark:text-slate-200">
            {{ log.model_label || log.target_model || '-' }}
            <template v-if="log.target_id"> (ID: {{ log.target_id }})</template>
          </span>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
          <span class="text-[9px] font-black text-slate-400 tracking-wider block">AMAL TURI (ACTION)</span>
          <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ log.action_label || log.action }}</span>
        </div>
      </div>

      <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
        <span class="text-[9px] font-black text-slate-400 tracking-wider block">AMAL TAVSIFI (DESCRIPTION)</span>
        <span class="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{{ log.description || '-' }}</span>
      </div>

      <!-- Extra Data JSON display -->
      <div class="space-y-1.5">
        <span class="text-[9px] font-black text-slate-400 tracking-wider block">QO'SHIMCHA MA'LUMOTLAR (EXTRA DATA JSON)</span>
        <div class="relative overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800">
          <pre class="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs overflow-auto max-h-[250px] font-mono leading-relaxed">{{ prettyJson(log.extra_data) }}</pre>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  visible: Boolean,
  log: Object
})

defineEmits(['update:visible'])

const prettyJson = (val) => {
  if (!val) return '{}'
  try {
    if (typeof val === 'string') {
      return JSON.stringify(JSON.parse(val), null, 2)
    }
    return JSON.stringify(val, null, 2)
  } catch (e) {
    return String(val)
  }
}
</script>
