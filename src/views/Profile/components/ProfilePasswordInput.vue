<template>
  <div class="profile-pw-wrap">
    <i v-if="icon" :class="['pi', icon, 'input-icon']"></i>
    <input 
      :type="showPassword ? 'text' : 'password'" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="profile-pw-input"
      :placeholder="placeholder"
    />
    <button type="button" @click="showPassword = !showPassword" class="reveal-btn">
      <i :class="['pi', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: String,
  icon: String,
  placeholder: String
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>

<style scoped>
.profile-pw-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.85rem;
  color: #94a3b8;
  z-index: 10;
}

.profile-pw-input {
  width: 100%;
  height: 2.5rem;
  padding-left: 2.25rem;
  padding-right: 2.25rem;
  border-radius: 0.5rem;
  border: 2px solid #f8fafc;
  background-color: rgba(248, 250, 252, 0.5);
  font-size: 0.875rem;
  font-weight: 700;
  color: #334155;
  outline: none;
  transition: all 0.2s;
}

.dark .profile-pw-input {
  background-color: rgba(30, 41, 59, 0.5);
  border-color: #1e293b;
  color: #e2e8f0;
}

.profile-pw-input:focus {
  border-color: #6366f1;
  background-color: rgba(248, 250, 252, 0.8);
}
.dark .profile-pw-input:focus {
  background-color: rgba(30, 41, 59, 0.8);
}

.reveal-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  z-index: 10;
  padding: 0;
}
.reveal-btn:hover {
  color: #6366f1;
}
</style>
