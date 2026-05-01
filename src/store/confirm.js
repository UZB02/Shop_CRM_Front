import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const visible = ref(false)
  const options = ref({
    header: '',
    message: '',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Ha',
    rejectLabel: 'Yo\'q',
    acceptClass: '',
    accept: null,
    reject: null
  })

  const require = (params) => {
    options.value = {
      header: params.header || 'Tasdiqlash',
      message: params.message || '',
      icon: params.icon || 'pi pi-exclamation-triangle',
      acceptLabel: params.acceptLabel || 'Ha',
      rejectLabel: params.rejectLabel || 'Yo\'q',
      acceptClass: params.acceptClass || '',
      accept: params.accept,
      reject: params.reject
    }
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  const onAccept = () => {
    if (options.value.accept) options.value.accept()
    close()
  }

  const onReject = () => {
    if (options.value.reject) options.value.reject()
    close()
  }

  return {
    visible,
    options,
    require,
    close,
    onAccept,
    onReject
  }
})


