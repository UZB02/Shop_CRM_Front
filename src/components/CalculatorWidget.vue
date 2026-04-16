<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div 
        v-show="visible" 
        ref="widgetRef"
        class="fixed z-[200] w-[320px] bg-white/70 dark:bg-[#0c121e]/80 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[28px] overflow-hidden flex flex-col"
        :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      >
        <!-- Drag Handle -->
        <div 
          @mousedown="startDrag"
          @touchstart="startDrag"
          class="h-10 flex justify-between items-center px-4 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent cursor-move select-none"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-calculator text-xs text-slate-500 dark:text-slate-400"></i>
            <span class="text-[9px] font-black tracking-widest uppercase text-slate-500 dark:text-slate-400">Kalkulyator</span>
          </div>
          <button @click="closeWidget" @mousedown.stop @touchstart.stop class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors text-slate-400">
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>

        <!-- Display -->
        <div class="px-6 py-4 flex flex-col items-end gap-1 select-none">
          <div class="h-6 text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono tracking-wider overflow-hidden whitespace-nowrap opacity-80">{{ equation }}</div>
          <div class="text-4xl font-black text-slate-800 dark:text-white font-mono tracking-tight overflow-hidden whitespace-nowrap">{{ display }}</div>
        </div>

        <!-- Keypad -->
        <div class="p-4 pt-2 bg-slate-50/50 dark:bg-black/20 grid grid-cols-4 gap-2.5">
          <button @click="clearAll" :class="[btnBase, btnSpec]" class="text-rose-500 col-span-2">C</button>
          <button @click="backspace" :class="[btnBase, btnSpec]" class="text-slate-600 dark:text-slate-300"><i class="pi pi-delete-left" /></button>
          <button @click="setOperation('/')" :class="[btnBase, btnOp]" class="text-indigo-500 dark:text-indigo-400">÷</button>

          <button @click="appendNumber('7')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">7</button>
          <button @click="appendNumber('8')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">8</button>
          <button @click="appendNumber('9')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">9</button>
          <button @click="setOperation('*')" :class="[btnBase, btnOp]" class="text-indigo-500 dark:text-indigo-400">×</button>

          <button @click="appendNumber('4')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">4</button>
          <button @click="appendNumber('5')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">5</button>
          <button @click="appendNumber('6')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">6</button>
          <button @click="setOperation('-')" :class="[btnBase, btnOp]" class="text-indigo-500 dark:text-indigo-400">−</button>

          <button @click="appendNumber('1')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">1</button>
          <button @click="appendNumber('2')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">2</button>
          <button @click="appendNumber('3')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">3</button>
          <button @click="setOperation('+')" :class="[btnBase, btnOp]" class="text-indigo-500 dark:text-indigo-400">+</button>

          <button @click="appendNumber('0')" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200 col-span-2">0</button>
          <button @click="appendDot" :class="[btnBase, btnNum]" class="text-slate-700 dark:text-slate-200">.</button>
          <button @click="calculate" :class="btnBase" class="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white border border-indigo-600/20 shadow-lg shadow-indigo-500/20 text-xl">=</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const btnBase = "h-14 rounded-[18px] font-black transition-all duration-200 active:scale-95 flex items-center justify-center"
const btnNum = "bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm text-lg"
const btnOp = "bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 shadow-sm text-xl"
const btnSpec = "bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 shadow-sm text-xl"

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const closeWidget = () => emit('update:visible', false)

// DOM & Dragging Logic
const widgetRef = ref(null)
const position = ref({ x: 0, y: 0 })
let isDragging = false
let offset = { x: 0, y: 0 }

const startDrag = (e) => {
  isDragging = true
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
  
  if (widgetRef.value) {
    const rect = widgetRef.value.getBoundingClientRect()
    offset.x = clientX - rect.left
    offset.y = clientY - rect.top
  }

  // Bind move/up listeners to document
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging) return
  e.preventDefault() // prevent scrolling on mobile while dragging
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
  
  let newX = clientX - offset.x
  let newY = clientY - offset.y

  // Constrain to screen boundaries
  const maxX = window.innerWidth - (widgetRef.value?.offsetWidth || 320)
  const maxY = window.innerHeight - (widgetRef.value?.offsetHeight || 440)

  if (newX < 0) newX = 0
  if (newY < 0) newY = 0
  if (newX > maxX) newX = maxX
  if (newY > maxY) newY = maxY

  position.value = { x: newX, y: newY }
}

const stopDrag = () => {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// Center initially logic
const centerWidget = () => {
  position.value = { 
    x: Math.max(0, (window.innerWidth - 320) / 2), 
    y: Math.max(0, (window.innerHeight - 440) / 2) 
  }
}

watch(() => props.visible, (newVal) => {
  // Center on first show
  if (newVal && position.value.x === 0 && position.value.y === 0) {
    centerWidget()
  }
})

onMounted(() => {
  window.addEventListener('resize', () => {
    // Re-constrain bounds if window size changes
    if (props.visible) {
      let x = position.value.x
      let y = position.value.y
      const maxX = window.innerWidth - 320
      const maxY = window.innerHeight - 440
      if (x > maxX) x = maxX
      if (y > maxY) y = maxY
      position.value = { x, y }
    }
  })
})

// Calculator Logic
const display = ref('0')
const equation = ref('')
let prevValue = null
let currentOp = null
let expectingNext = false

const formatNum = (numStr) => {
  // simple formatting, optionally Int.NumberFormat if requested
  return numStr
}

const appendNumber = (num) => {
  if (expectingNext) {
    display.value = num
    expectingNext = false
  } else {
    display.value = display.value === '0' ? num : display.value + num
  }
}

const appendDot = () => {
  if (expectingNext) {
    display.value = '0.'
    expectingNext = false
  } else if (!display.value.includes('.')) {
    display.value += '.'
  }
}

const clearAll = () => {
  display.value = '0'
  equation.value = ''
  prevValue = null
  currentOp = null
  expectingNext = false
}

const backspace = () => {
  if (expectingNext) return
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1)
  } else {
    display.value = '0'
  }
}

const compute = () => {
  if (prevValue === null || currentOp === null) return parseFloat(display.value)
  const a = parseFloat(prevValue)
  const b = parseFloat(display.value)
  let result = 0
  switch (currentOp) {
    case '+': result = a + b; break
    case '-': result = a - b; break
    case '*': result = a * b; break
    case '/': result = b !== 0 ? a / b : 'Xata'; break
  }
  return result
}

const setOperation = (op) => {
  if (currentOp !== null && !expectingNext) {
    const res = compute()
    display.value = String(res).slice(0, 12)
    prevValue = res
  } else {
    prevValue = display.value
  }
  currentOp = op
  equation.value = `${prevValue} ${op}`
  expectingNext = true
}

const calculate = () => {
  if (currentOp === null || expectingNext) return
  equation.value = `${prevValue} ${currentOp} ${display.value} =`
  const res = compute()
  display.value = String(res).slice(0, 12)
  prevValue = null
  currentOp = null
  expectingNext = true
}

// Global Keyboard support for basic functions
const onKeydown = (e) => {
  if (!props.visible) return
  const key = e.key
  if (/[0-9]/.test(key)) appendNumber(key)
  if (key === '.' || key === ',') appendDot()
  if (['+', '-', '*', '/'].includes(key)) { e.preventDefault(); setOperation(key) }
  if (key === 'Enter' || key === '=') { e.preventDefault(); calculate() }
  if (key === 'Backspace') backspace()
  if (key === 'Escape') { clearAll() }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>


